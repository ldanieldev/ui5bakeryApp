sap.ui.define(
  ['./BaseController', 'sap/ui/model/json/JSONModel', 'sap/m/MessageBox'],
  function (BaseController, JSONModel, MessageBox) {
    'use strict';

    return BaseController.extend('bakeryApp.controller.ProductDetailChange', {
      onInit: function () {
        this.sProductUrl = this.getDataSources().products.uri;

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
          oComponent = this.byId('productDetailPage'),
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

      onEditRecipeStepPress: function (oEvent) {},

      onDeleteRecipeStepPress: function (oEvent) {
        const that = this,
          oBindingContext = oEvent.getSource().getBindingContext(),
          oRecipeStepData = oBindingContext.getObject(),
          sStepName = this.formatter.toTitleCase(oRecipeStepData.description);

        MessageBox.warning(
          this.localizeText(
            'dynamic.confirmDelete.text',
            this.localizeText('product.title.recipeStep').toLowerCase()
          ),
          {
            title: this.localizeText('dynamic.confirmDelete.title', [
              sStepName
            ]),
            actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
            onClose: (sAction) => {
              if (sAction === MessageBox.Action.YES) {
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
              }
            }
          }
        );
      },

      _updateRecipeStepOrder: function (aSteps) {
        aSteps.forEach((oStep, iIdx) => (oStep.order = iIdx + 1));
      }
    });
  }
);
