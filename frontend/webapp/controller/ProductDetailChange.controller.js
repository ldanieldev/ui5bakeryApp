sap.ui.define(
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/Fragment'
  ],
  function (
    BaseController,
    JSONModel,
    MessageBox,
    MessageToast,
    Filter,
    FilterOperator,
    Fragment
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

      onTagInputChange: function (oEvent) {
        const oInput = oEvent.getSource(),
          oModel = oInput.getModel(),
          sNewTagValue = oEvent.getParameters().value,
          sPath = '/tags';

        if (sNewTagValue) {
          let aData = oModel.getProperty(sPath);
          aData.push({ tag: sNewTagValue });
          oModel.setProperty(sPath, aData);
          oInput.setValue('');
        }
      },

      onTagInputTokenUpdate: function (oEvent) {
        const { type, addedTokens, removedTokens } = oEvent.getParameters(),
          oInput = oEvent.getSource(),
          oModel = oInput.getModel(),
          sPath = '/tags';

        oInput.setBusy(true);
        let aContexts = oModel.getProperty(sPath);

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

        oModel.setProperty(sPath, aContexts);
        oInput.setBusy(false);
      },

      onEditCancelBtnPress: function (oEvent) {
        this._returnToDisplayPage();
      },

      onSaveBtnPress: function (oEvent) {
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
          sTitle = this.localizeText('dynamic.confirmDelete.title', [
            sStepName
          ]),
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
                sPath = '/recipe',
                aData = oModel.getProperty(sPath);

              //remove object from array
              aData = aData.filter((oElement) => oElement !== oRecipeStepData);

              //re-order the instructions
              aData.forEach((oElement, iIdx) => (oElement.order = iIdx + 1));

              //update model data
              oModel.setProperty(sPath, aData);

              that.oPage.setBusy(false);
            }
          }
        });
      },

      onAddRecipeStepBtnPress: function (oEvent) {
        this._loadRecipeStepDialogFragment(() => {
          this.oRecipeStepDialog
            .setTitle(
              this.formatter.toTitleCase(
                this.localizeText('dynamic.form.title.add', [
                  this.localizeText('entity.recipeStep')
                ])
              )
            )
            .setModel(new JSONModel('./model/RecipeStep.json'))
            .open();
        });
      },

      onEditRecipeStepBtnPress: function (oEvent) {
        const oBindingContext = oEvent.getSource().getBindingContext(),
          oRecipeStepData = oBindingContext.getObject(),
          oNewDataInstance = JSON.parse(JSON.stringify(oRecipeStepData));

        this._loadRecipeStepDialogFragment(() => {
          this.oRecipeStepDialog
            .setTitle(
              this.formatter.toTitleCase(
                this.localizeText('dynamic.form.title.edit', [
                  this.localizeText('entity.recipeStep')
                ])
              )
            )
            .setModel(new JSONModel(oNewDataInstance))
            .open();
        });
      },

      /*************************************************************************
       *                         fragment functions                            *
       *************************************************************************/
      _loadRecipeStepDialogFragment: function (callback = () => {}) {
        if (this.oRecipeStepDialog) {
          this._resetRecipeStepFormValueState();
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

          this._resetRecipeStepFormValueState();
          this.loadIngredientListData();
          callback();
        });
      },

      _filterSelectedIngredients: function () {
        const oAvailableIngredientsModel =
            this.oAvailableIngredientTable.getModel(),
          oAvailableIngredientsData =
            oAvailableIngredientsModel.getProperty('/'),
          oSelectedIngredentsData = this.oSelectedIngredientTable
            .getModel()
            .getProperty('/ingredients');

        let afilteredArray = oAvailableIngredientsData.filter(
          (oAvailableIngredient) => {
            return (
              oSelectedIngredentsData.filter(
                (oSelectedIngredient) =>
                  oAvailableIngredient.id === oSelectedIngredient.id
              ).length === 0
            );
          }
        );

        oAvailableIngredientsModel.setProperty('/', afilteredArray);
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
          then: () => {
            oComponent.setModel(oModel);
            this._filterSelectedIngredients();
          },
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

        this.validateRecipeStepForm();
      },

      onRemoveInstructionBtnPress: function (oEvent) {
        const oInstructionList = Fragment.byId(
            this.oRecipeStepFragmentId,
            'instructionList'
          ),
          oModel = oInstructionList.getModel(),
          oObjectToRemove = oEvent.getSource().getBindingContext().getObject(),
          sPath = '/instructions';

        oInstructionList.setBusy(true);

        let aData = oModel.getProperty(sPath);

        //remove object from array
        aData = aData.filter((oElement) => oElement !== oObjectToRemove);

        //re-order the instructions
        aData.forEach((oElement, iIdx) => (oElement.order = iIdx + 1));

        //update model data
        oModel.setProperty(sPath, aData);

        oInstructionList.setBusy(false);
      },

      moveToSelectedIngredientsTable: function (oEvent) {
        //get selected ingredient
        const oSelectedItem = this.oAvailableIngredientTable.getSelectedItem();

        //show error if no ingredient selected
        if (!oSelectedItem) {
          MessageBox.warning(
            this.localizeText(
              'recipeStepDialog.messageBox.warning.moveSelectedIndregient.text'
            )
          );
          return;
        }

        //
        const oAvailableIngredientsModel =
            this.oAvailableIngredientTable.getModel(),
          aAvailableIngredentsData =
            oAvailableIngredientsModel.getProperty('/'),
          oSelectedIngredientsModel = this.oSelectedIngredientTable.getModel(),
          oSelectedIngredientsData =
            oSelectedIngredientsModel.getProperty('/ingredients'),
          oSelectedItemData = oSelectedItem.getBindingContext().getObject();

        //add ingredient to selected ingredient model
        oSelectedIngredientsData.push(oSelectedItemData);
        oSelectedIngredientsModel.setProperty(
          '/ingredients',
          oSelectedIngredientsData
        );

        //remove ingredient from available ingredient model
        oAvailableIngredientsModel.setData(
          aAvailableIngredentsData.filter(
            (oIngredient) => oIngredient.id !== oSelectedItemData.id
          )
        );

        this.validateRecipeStepForm();
      },

      moveToAvailableProductsTable: function (oEvent) {
        //get selected ingredient
        const oSelectedItem = this.oSelectedIngredientTable.getSelectedItem();

        //show error if no ingredient selected
        if (!oSelectedItem) {
          MessageBox.warning(
            this.localizeText(
              'recipeStepDialog.messageBox.warning.moveSelectedIndregient.text'
            )
          );
          return;
        }

        //
        const oAvailableIngredientsModel =
            this.oAvailableIngredientTable.getModel(),
          oAvailableIngredentsData =
            oAvailableIngredientsModel.getProperty('/'),
          oSelectedIngredientsModel = this.oSelectedIngredientTable.getModel(),
          aSelectedIngredentsData =
            oSelectedIngredientsModel.getProperty('/ingredients'),
          oSelectedItemData = oSelectedItem.getBindingContext().getObject();

        //remove amount attribute before moving to table
        delete oSelectedItemData.amount;

        //add ingredient to available ingredient model
        oAvailableIngredentsData.push(oSelectedItemData);
        oAvailableIngredientsModel.setProperty('/', oAvailableIngredentsData);

        //remove ingredient from selected ingredient model
        oSelectedIngredientsModel.setProperty(
          '/ingredients',
          aSelectedIngredentsData.filter(
            (oIngredient) => oIngredient.id !== oSelectedItemData.id
          )
        );
      },

      onAvailableIngredientsTableDrop: function (oEvent) {
        const oDraggedItem = oEvent.getParameter('draggedControl'),
          oDraggedItemContext = oDraggedItem.getBindingContext(),
          oDraggedItemJson = oDraggedItemContext.getObject(),
          sPath = '/ingredients';

        if (!oDraggedItemContext) {
          return;
        }

        let oAvailableIngredientsModel =
            this.oAvailableIngredientTable.getModel(),
          iIndex = oAvailableIngredientsModel.getProperty('/').length,
          oSelectedIngredentsModel = oDraggedItemContext.oModel,
          aSelectedIngredentsData = oSelectedIngredentsModel.getProperty(sPath);

        if (aSelectedIngredentsData && aSelectedIngredentsData.length > 0) {
          //remove amount attribute before moving to table
          delete oDraggedItemJson.amount;

          //move data object to table model
          oAvailableIngredientsModel.setProperty(
            `/${iIndex}`,
            oDraggedItemJson,
            oDraggedItemContext
          );

          //remove ingredient from list of selected ingredients
          oSelectedIngredentsModel.setProperty(
            sPath,
            aSelectedIngredentsData.filter(
              (oIngredient) => oIngredient.id !== oDraggedItemJson.id
            )
          );
        }
      },

      onSelectedIngredientsTableDrop: function (oEvent) {
        const oDraggedItem = oEvent.getParameter('draggedControl'),
          oDraggedItemContext = oDraggedItem.getBindingContext(),
          oDraggedItemJson = oDraggedItemContext.getObject(),
          sPath = '/ingredients';

        if (!oDraggedItemContext) {
          return;
        }

        let oSelectedIngredientModel = this.oSelectedIngredientTable.getModel(),
          iIndex = oSelectedIngredientModel.getProperty(sPath).length,
          oAvailableIngredentsModel = oDraggedItemContext.oModel,
          aAvailableIngredentsData = oAvailableIngredentsModel.getProperty('/');

        if (aAvailableIngredentsData && aAvailableIngredentsData.length > 0) {
          oSelectedIngredientModel.setProperty(
            `${sPath}/${iIndex}`,
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

        this.validateRecipeStepForm();
      },

      _resetRecipeStepFormValueState: function () {
        const oNameInput = Fragment.byId(
            this.oRecipeStepFragmentId,
            'nameInput'
          ),
          oTargetInput = Fragment.byId(
            this.oRecipeStepFragmentId,
            'targetInput'
          ),
          oTargetUomSelect = Fragment.byId(
            this.oRecipeStepFragmentId,
            'targetUomSelect'
          ),
          oIngredentTable = Fragment.byId(
            this.oRecipeStepFragmentId,
            'selectedIngredientTable'
          ),
          oInstructionList = Fragment.byId(
            this.oRecipeStepFragmentId,
            'instructionList'
          );

        oNameInput.setValueState('None');
        oTargetInput.setValueState('None');
        oTargetUomSelect.setValueState('None');

        oIngredentTable
          .getItems()
          .forEach((oItem) => oItem.getCells()[1].setValueState('None'));

        oInstructionList
          .getItems()
          .forEach((oListItem) =>
            oListItem.getContent()[0].getItems()[1].setValueState('None')
          );
      },

      validateRecipeStepForm: function () {
        const oNameInput = Fragment.byId(
            this.oRecipeStepFragmentId,
            'nameInput'
          ),
          oTargetInput = Fragment.byId(
            this.oRecipeStepFragmentId,
            'targetInput'
          ),
          oTargetUomSelect = Fragment.byId(
            this.oRecipeStepFragmentId,
            'targetUomSelect'
          ),
          oIngredentTable = Fragment.byId(
            this.oRecipeStepFragmentId,
            'selectedIngredientTable'
          ),
          oInstructionList = Fragment.byId(
            this.oRecipeStepFragmentId,
            'instructionList'
          ),
          oSubmitBtn = Fragment.byId(this.oRecipeStepFragmentId, 'submitBtn');

        oSubmitBtn.setEnabled(false);

        if (!oNameInput.getValue()) {
          oNameInput.setValueState('Error');
          return false;
        } else {
          oNameInput.setValueState('Success');
        }

        if (!oTargetInput.getValue()) {
          oTargetInput.setValueState('Error');
          return false;
        } else {
          oTargetInput.setValueState('Success');
        }

        if (!oTargetUomSelect.getSelectedKey()) {
          oTargetUomSelect.setValueState('Error');
          return false;
        } else {
          oTargetUomSelect.setValueState('Success');
        }

        if (oIngredentTable.getItems().length < 1) {
          return false;
        } else {
          let isValidIngedients = true;

          oIngredentTable.getItems().forEach((oItem) => {
            let oCells = oItem.getCells(),
              oAmoutCell = oCells[1];

            if (isNaN(parseInt(oAmoutCell.getValue(), 10))) {
              oAmoutCell.setValueState('Error');
              isValidIngedients = false;
            } else {
              oAmoutCell.setValueState('Success');
            }
          });

          if (!isValidIngedients) return false;
        }

        let isValidInstructions = true;

        oInstructionList.getItems().forEach((oListItem) => {
          let oTextArea = oListItem.getContent()[0].getItems()[1];

          if (!oTextArea.getValue()) {
            oTextArea.setValueState('Error');
            isValidInstructions = false;
          } else {
            oTextArea.setValueState('Success');
          }
        });

        if (!isValidInstructions) return false;

        oSubmitBtn.setEnabled(true);

        return true;
      },

      onNewRecipeStepSubmitBtnPress: function (oEvent) {
        if (!this.validateRecipeStepForm()) {
          MessageBox.warning(this.localizeText('error.invalidForm.text'), {
            title: this.localizeText('error.invalidForm.title')
          });
          return;
        }
      }
    });
  }
);
