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

    return BaseController.extend('bakeryApp.controller.Products', {
      onInit: function () {
        this.sProductUrl = this.getDataSources().products.uri;
        this.sIngredientUrl = this.getDataSources().ingredients.uri;
        this.oProductList = this.byId('productList');
        this.oProductDialog = this.byId('productDialog');
        this.oProductWizard = this.byId('productWizard');
        this.oNewRecipeStepFragmentId = this.createId('newRecipeStepFragment');
        this.oNewRecipeStepDialog;
        this.oAvailableIngredientTable;
        this.oSelectedIngredientTable;

        this.getView().addEventDelegate(
          { onBeforeShow: this.onBeforeShow },
          this
        );

        //add validator to multiInput
        this.byId('tagInput').addValidator(
          (args) => new Token({ key: args.text, text: args.text })
        );
      },

      onBeforeShow: function () {
        this.loadProductListData();
      },

      loadProductListData: function () {
        const oModel = new JSONModel(),
          oComponent = this.oProductList;

        oComponent.setBusy(true);

        this.getData(oModel, {
          url: this.sProductUrl,
          then: () => oComponent.setModel(oModel),
          finally: () => oComponent.setBusy(false)
        });
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

      onFilterProducts: function (oEvent) {
        const sQuery =
          oEvent.getParameter('query') || oEvent.getParameter('newValue');
        let aFilters = [];

        if (sQuery) {
          aFilters = [
            new Filter({
              filters: [
                new Filter('name', FilterOperator.Contains, sQuery),
                new Filter('category', FilterOperator.Contains, sQuery)
              ],
              and: false
            })
          ];
        }

        this._applySearchFilter(
          this.oProductList,
          aFilters,
          'entity.product.plural'
        );
      },

      onEditBtnPress: function (oEvent) {
        this.wizardAction = 'edit';
        const oData = oEvent.getSource().getBindingContext().getObject();

        this.oForm.setModel(new JSONModel({ ...oData }));
        this._handleButtonsVisibility();
        this.oProductDialog.open();
      },

      onAddBtnPress: function () {
        this.wizardAction = 'add';
        this.oProductWizard.setModel(new JSONModel('./model/newProduct.json'));

        this._handleButtonsVisibility();
        this.oProductDialog.open();
      },

      onImageChange: function (oEvent) {
        const fileList = oEvent.getParameter('files');

        if (fileList.length === 1) {
          oEvent.getSource().getModel().setProperty('/image', fileList[0]);
        }
      },

      _handleButtonsVisibility: function (iSelectedStepIndex = 0) {
        const [oPrevBtn, oNextBtn, oReviewBtn, oFinishBtn] =
          this.oProductDialog.getButtons();

        oNextBtn.setVisible(iSelectedStepIndex < 1);
        oPrevBtn.setVisible(iSelectedStepIndex > 0);
        oReviewBtn.setVisible(iSelectedStepIndex === 1);
        oFinishBtn.setVisible(iSelectedStepIndex === 2);
      },

      onWizardNavigationChange: function (oEvent) {
        const oSelectedStep = oEvent.getParameter('step'),
          iSelectedStepIndex = this.oProductWizard
            .getSteps()
            .indexOf(oSelectedStep);
        this._handleButtonsVisibility(iSelectedStepIndex);
      },

      onWizardBackButtonPress: function (oEvent) {
        this.oProductWizard.previousStep();
        this._handleButtonsVisibility(
          this.oProductWizard.indexOfStep(this.oProductWizard.getProgressStep())
        );
      },

      onWizardNextButtonPress: function (oEvent) {
        this.oProductWizard.nextStep();
        this._handleButtonsVisibility(
          this.oProductWizard.indexOfStep(this.oProductWizard.getProgressStep())
        );
      },

      onWizardSubmitPress: function (oEvent) {
        MessageBox.confirm(
          this.localizeText('productWizard.messageBox.text.submit'),
          {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.YES) {
                this.oProductWizard.discardProgress(
                  this.oProductWizard.getSteps()[0]
                );
                this.oProductDialog.close();
              }
            }.bind(this)
          }
        );
      },

      onWizardCancelPress: function (oEvent) {
        MessageBox.warning(
          this.localizeText('productWizard.messageBox.text.cancel'),
          {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.YES) {
                this.oProductWizard.discardProgress(
                  this.oProductWizard.getSteps()[0]
                );
                this.oProductDialog.close();
              }
            }.bind(this)
          }
        );
      },

      onDeleteBtnPress: function (oEvent) {
        const that = this,
          oModel = new JSONModel(),
          oTable = this.oProductList,
          oData = oEvent.getSource().getBindingContext().getObject();

        MessageBox.warning(
          this.localizeText(
            'dynamic.confirmDelete.text',
            this.localizeText('entity.product')
          ),
          {
            title: this.localizeText('dynamic.confirmDelete.title', oData.name),
            actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
            onClose: (sAction) => {
              if (sAction === MessageBox.Action.YES) {
                this.getData(oModel, {
                  url: this.sProductUrl + oData.id,
                  params: {
                    image: oData.image
                  },
                  type: 'DELETE',
                  then: () => {
                    if (oModel.getProperty('/id')) {
                      that.loadProductListData();
                      MessageToast.show(
                        that.localizeText('dynamic.toast.delete', oData.name),
                        { at: 'center center' }
                      );
                    }
                  },
                  finally: () => oTable.setBusy(false)
                });
              }
            }
          }
        );
      },

      onAddRecipeStepBtnPress: function (oEvent) {
        let oFragment;

        if (!this.oNewRecipeStepDialog) {
          oFragment = this.loadFragment({
            name: 'bakeryApp.view.ProductsWizardRecipeDetailStepDialog',
            type: 'JS',
            id: this.oNewRecipeStepFragmentId
          });

          oFragment.then((oDialog) => {
            this.oNewRecipeStepDialog = oDialog;

            this.oAvailableIngredientTable = Fragment.byId(
              this.oNewRecipeStepFragmentId,
              'availableIngredientTable'
            );
            this.oSelectedIngredientTable = Fragment.byId(
              this.oNewRecipeStepFragmentId,
              'selectedIngredientTable'
            );

            this.oNewRecipeStepDialog
              .setModel(new JSONModel('./model/recipeOperation.json'))
              .open();
            this.loadIngredientListData();
          });
        } else {
          this.oNewRecipeStepDialog.open();
          this.loadIngredientListData();
        }
      },

      onAddInstructionBtnPress: function (oEvent) {
        const oInstructionForm = Fragment.byId(
            this.oNewRecipeStepFragmentId,
            'instructionForm'
          ),
          oFormContent = oInstructionForm.getContent(),
          iIndex = oFormContent.length / 2 + 1;

        oInstructionForm.insertContent(
          new Label({ text: iIndex, required: false }),
          oFormContent.length
        );
        oInstructionForm.insertContent(
          new TextArea({
            value: `{/instructions/${iIndex - 1}/}`
          }).addEventDelegate({
            onAfterRendering: (oAfterRender) => {
              const oTextArea = oAfterRender.srcControl;

              oTextArea.focus();
              document.querySelector(`#${oTextArea.sId}`).scrollIntoView();
            }
          }),
          oFormContent.length + 1
        );
      },

      onRemoveLastInstructionBtnPress: function (oEvent) {
        const oInstructionForm = Fragment.byId(
            this.oNewRecipeStepFragmentId,
            'instructionForm'
          ),
          oModel = oInstructionForm.getModel();

        let oFormContentMaxIndex = oInstructionForm.getContent().length - 1,
          aContexts = oModel.getProperty('/instructions'),
          sInstruction = oInstructionForm
            .getContent()
            [oFormContentMaxIndex].getValue();

        if (oFormContentMaxIndex > 1) {
          //remove data from model
          oModel.setProperty(
            '/instructions',
            aContexts.filter((oContext) => oContext !== sInstruction)
          );

          //remove control from form
          oInstructionForm.removeContent(oFormContentMaxIndex--);
          oInstructionForm.removeContent(oFormContentMaxIndex);
        }
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
          Fragment.byId(
            this.oNewRecipeStepFragmentId,
            'availableIngredientTable'
          ),
          aFilters,
          'entity.ingredient.plural'
        );
      },

      onTagInputTokenUpdate: function (oEvent) {
        const { type, addedTokens, removedTokens } = oEvent.getParameters(),
          oControl = oEvent.getSource(),
          oModel = oControl.getModel();

        oControl.setBusy(true);
        let aContexts = oModel.getProperty('/tags');

        if (type === 'added') {
          addedTokens.forEach((oToken) =>
            aContexts.push({ key: oToken.getKey(), text: oToken.getText() })
          );
        } else if (type === 'removed') {
          removedTokens.forEach((oToken) => {
            aContexts = aContexts.filter(
              (oContext) => oContext.key !== oToken.getKey()
            );
          });
        }

        oModel.setProperty('/tags', aContexts);
        oControl.setBusy(false);
      },

      validateProductDetailForm: function (oEvent) {
        return true;
      }
    });
  }
);
