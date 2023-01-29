sap.ui.define(
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/Token',
    'sap/ui/core/Fragment',
    'sap/m/Label',
    'sap/m/TextArea'
  ],
  function (
    BaseController,
    JSONModel,
    MessageBox,
    MessageToast,
    Filter,
    FilterOperator,
    Token,
    Fragment,
    Label,
    TextArea
  ) {
    'use strict';

    return BaseController.extend('bakeryApp.controller.ProductDetailChange', {
      onInit: function () {
        this.sProductUrl = this.getDataSources().products.uri;
        this.sIngredientUrl = this.getDataSources().ingredients.uri;
        this.oPage = this.byId('productDetailPage');
        this.oRecipeStepFragmentId = this.createId('recipeStepDialogFragment');
        this.oRecipeStepDialog;
        this.oAvailableIngredientTable;
        this.oSelectedIngredientTable;

        let oRoute =
          this.getRouter().getRoute('productDetailEdit') ||
          this.getRouter().getRoute('productDetailNew');

        if (oRoute) {
          oRoute.attachPatternMatched(this.onBeforeShow, this);
        }
      },

      onBeforeShow: function (oEvent) {
        //swap current view in product flexContainer midColumn aggration
        this.getView().getParent().to(this.getView(), 'slide');

        this.sProductId = oEvent.getParameters().arguments.productId;
        this.loadProductData(this.sProductId);
      },

      loadProductData: function (sProductId) {
        const oModel = new JSONModel(),
          oComponent = this.oPage,
          oController = this;

        oComponent.setBusy(true);

        this.getData(oModel, {
          url: this.sProductUrl + sProductId,
          then: () => {
            const sId = oModel.getProperty('/id');

            if (sId && sId === sProductId) {
              oComponent.setModel(oModel);
            } else {
              MessageBox.error(
                oController.formatter.toTitleCase(
                  oController.localizeText('dynamic.notFoundText', [
                    oController.localizeText('entity.product')
                  ])
                )
              );
              oComponent.setModel(new JSONModel());
            }
          },
          finally: () => oComponent.setBusy(false)
        });
      },

      formatText: function (bEnabled, sEnabledMsg, sDisabledMsg) {
        return bEnabled ? sEnabledMsg : sDisabledMsg;
      },

      formatState: function (bEnabled) {
        return bEnabled ? 'Success' : 'Error';
      },

      formatIcon: function (bEnabled) {
        return bEnabled ? 'sap-icon://accept' : 'sap-icon://cancel';
      },

      onTagInputTokenUpdate: function (oEvent) {
        const { type, addedTokens, removedTokens } = oEvent.getParameters(),
          oControl = oEvent.getSource(),
          oModel = oControl.getModel();

        oControl.setBusy(true);
        let aContexts = oModel.getProperty('/tags');

        if (type === 'added') {
          addedTokens.forEach((oToken) =>
            aContexts.push({ tag: oToken.getText() })
          );
        } else if (type === 'removed') {
          removedTokens.forEach((oToken) => {
            aContexts = aContexts.filter(
              (oContext) => oContext.tag !== oToken.getText()
            );
          });
        }

        oModel.setProperty('/tags', aContexts);
        oControl.setBusy(false);
      },

      onEditCancelBtnPress: function (oEvent) {
        this._returnToDisplayPage();
      },

      _returnToDisplayPage: function () {
        this.getView()
          .getParent()
          .getParent()
          .setLayout('TwoColumnsMidExpanded');

        this.getRouter().navTo('productDetailView', {
          productId: this.sProductId
        });
      },

      onImageChange: function (oEvent) {
        const fileList = oEvent.getParameter('files');

        if (fileList.length === 1) {
          oEvent.getSource().getModel().setProperty('/image', fileList[0]);
        }
      },

      onImageFileSizeExceeded: function (oEvent) {
        MessageBox.warning(
          this.localizeText('error.fileSizeExceeded.message', ['512', 'kb']),
          {
            title: this.localizeText('error.fileSizeExceeded.title')
          }
        );
      },

      onDeleteRecipeStepBtnPress: function (oEvent) {
        const that = this,
          oBindingContext = oEvent.getSource().getBindingContext(),
          oRecipeStepData = oBindingContext.getObject(),
          sStepName = this.formatter.toTitleCase(oRecipeStepData.description),
          sTitle = this.localizeText('dynamic.confirmDelete.title'[sStepName]),
          sText = this.localizeText(
            'dynamic.confirmDelete.text',
            this.localizeText('product.title.recipeStep').toLowerCase()
          );

        MessageBox.warning(sText, {
          title: sTitle,
          actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
          onClose: (sAction) => {
            if (sAction === MessageBox.Action.YES) {
              that.oPage.setBusy(true);

              let oModel = oBindingContext.getModel(),
                oData = oModel.getData(),
                sPath = oBindingContext.getPath(),
                iIdx = parseInt(sPath.split('recipe/')[1], 10);

              if (!isNaN(iIdx)) {
                oData.recipe = oData.recipe.slice(iIdx + 1);
                that._updateRecipeStepOrder(oData.recipe);
                oModel.setData(oData);
                oModel.updateBindings(true);
              }

              that.oPage.setBusy(false);
            }
          }
        });
      },

      _updateRecipeStepOrder: function (aSteps) {
        aSteps.forEach((oStep, iIdx) => (oStep.order = iIdx + 1));
      },

      onAddRecipeStepBtnPress: function (oEvent) {
        this._loadRecipeStepDialogFragment(() => {
          this.oRecipeStepDialog
            .setModel(new JSONModel('./model/RecipeStep.json'))
            .open();
        });
      },

      onEditRecipeStepBtnPress: function (oEvent) {
        const oBindingContext = oEvent.getSource().getBindingContext(),
          oRecipeStepData = oBindingContext.getObject();

        this._loadRecipeStepDialogFragment(() => {
          this.oRecipeStepDialog
            .setModel(new JSONModel(oRecipeStepData))
            .open();
        });
      },

      /*************************************************************************
       *                         fragment functions                            *
       *************************************************************************/
      _loadRecipeStepDialogFragment: function (callback = () => {}) {
        if (this.oRecipeStepDialog) {
          this.loadIngredientListData();
          callback();
          return;
        }

        this.loadFragment({
          name: 'bakeryApp.view.RecipeStepDialog',
          type: 'JS',
          id: this.oRecipeStepFragmentId
        }).then((oDialog) => {
          if (!oDialog) {
            this._showDefaultErrorMessage();
            return;
          }

          this.oRecipeStepDialog = oDialog;

          this.oAvailableIngredientTable = Fragment.byId(
            this.oRecipeStepFragmentId,
            'availableIngredientTable'
          );
          this.oSelectedIngredientTable = Fragment.byId(
            this.oRecipeStepFragmentId,
            'selectedIngredientTable'
          );

          this.loadIngredientListData();
          callback();
        });
      },

      onFilterIngredients: function (oEvent) {
        const sQuery =
          oEvent.getParameter('query') || oEvent.getParameter('newValue');
        let aFilters = [];

        if (sQuery) {
          aFilters = [
            new Filter({
              filters: [new Filter('name', FilterOperator.Contains, sQuery)],
              and: false
            })
          ];
        }

        this._applySearchFilter(
          Fragment.byId(this.oRecipeStepFragmentId, 'availableIngredientTable'),
          aFilters,
          'entity.ingredient.plural'
        );
      },

      loadIngredientListData: function () {
        const oModel = new JSONModel(),
          oComponent = this.oAvailableIngredientTable;

        oComponent.setBusy(true);

        this.getData(oModel, {
          url: this.sIngredientUrl,
          then: () => oComponent.setModel(oModel),
          finally: () => oComponent.setBusy(false)
        });
      },

      formatRemoveInstructionEnabled: function (sOrder) {
        return sOrder && parseInt(sOrder, 10) < 2 ? false : true;
      },

      onAddInstructionBtnPress: function (oEvent) {
        const oInstructionList = Fragment.byId(
            this.oRecipeStepFragmentId,
            'instructionList'
          ),
          oModel = oInstructionList.getModel(),
          aData = oModel.getProperty('/instructions'),
          iNextIndex = aData[aData.length - 1].order + 1;

        aData.push({ order: iNextIndex, instruction: null });
        oModel.setProperty('/instructions', aData);
      },

      onRemoveInstructionBtnPress: function (oEvent) {
        const oInstructionList = Fragment.byId(
            this.oRecipeStepFragmentId,
            'instructionList'
          ),
          oModel = oInstructionList.getModel(),
          oObjectToRemove = oEvent.getSource().getBindingContext().getObject();

        let aData = oModel.getProperty('/instructions');

        //remove object from array
        aData = aData.filter((oElement) => oElement !== oObjectToRemove);

        //re-order the instructions
        aData.forEach((oElement, iIdx) => (oElement.order = iIdx + 1));

        //update model data
        oModel.setProperty('/instructions', aData);
      },

      onNewRecipeStepSubmitBtnPress: function (oEvent) {},

      moveToSelectedIngredientsTable: function (oEvent) {},

      moveToAvailableProductsTable: function (oEvent) {},

      onAvailableIngredientsTableDrop: function (oEvent) {
        const oDraggedItem = oEvent.getParameter('draggedControl'),
          oDraggedItemContext = oDraggedItem.getBindingContext(),
          oDraggedItemJson = oDraggedItemContext.getObject();

        if (!oDraggedItemContext) {
          return;
        }

        let oModel = this.oAvailableIngredientTable.getModel(),
          iIndex = oModel.getProperty('/').length,
          oSelectedIngredentsModel = oDraggedItemContext.oModel,
          aSelectedIngredentsData =
            oSelectedIngredentsModel.getProperty('/ingredients');

        if (aSelectedIngredentsData && aSelectedIngredentsData.length > 0) {
          //remove amount attribute before moving to table
          delete oDraggedItemJson.amount;

          //move data object to table model
          oModel.setProperty(
            `/${iIndex}`,
            oDraggedItemJson,
            oDraggedItemContext
          );

          //remove ingredient from list of selected ingredients
          oSelectedIngredentsModel.setProperty(
            '/ingredients',
            aSelectedIngredentsData.filter(
              (oIngredient) => oIngredient.id !== oDraggedItemJson.id
            )
          );
        }

        this.validateSelectedIngredientsAmount();
      },

      onSelectedIngredientsTableDrop: function (oEvent) {
        const oDraggedItem = oEvent.getParameter('draggedControl'),
          oDraggedItemContext = oDraggedItem.getBindingContext(),
          oDraggedItemJson = oDraggedItemContext.getObject();

        if (!oDraggedItemContext) {
          return;
        }

        let oModel = this.oSelectedIngredientTable.getModel(),
          iIndex = oModel.getProperty('/ingredients').length,
          oAvailableIngredentsModel = oDraggedItemContext.oModel,
          aAvailableIngredentsData = oAvailableIngredentsModel.getProperty('/');

        if (aAvailableIngredentsData && aAvailableIngredentsData.length > 0) {
          oModel.setProperty(
            `/ingredients/${iIndex}`,
            oDraggedItemJson,
            oDraggedItemContext
          );

          //remove ingredient from list of available ingredients
          oAvailableIngredentsModel.setData(
            aAvailableIngredentsData.filter(
              (oIngredient) => oIngredient.id !== oDraggedItemJson.id
            )
          );
        }

        this.validateSelectedIngredientsAmount();
      },

      validateSelectedIngredientsAmount: function () {
        let bIsValid = true;

        this.oSelectedIngredientTable.getItems().forEach((oItem) => {
          let oInput = oItem.getCells()[1],
            fAmount = parseFloat(oInput.getValue());

          if (isNaN(fAmount)) {
            bIsValid = false;
            oInput.setValueState('Error');
          } else {
            oInput.setValueState('Success');
          }
        });

        return bIsValid;
      }
    });
  }
);
