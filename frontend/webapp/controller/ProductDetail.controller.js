sap.ui.define(
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast'
  ],
  function (BaseController, JSONModel, MessageBox, MessageToast) {
    'use strict';

    return BaseController.extend('bakeryApp.controller.ProductDetail', {
      onInit: function () {
        this.sProductUrl = this.getDataSources().products.uri;

        this.getCurrentRoute().attachPatternMatched(this.onBeforeShow, this);
      },

      onBeforeShow: function (oEvent) {
        //swap current view in product flexContainer midColumn aggration
        this.getView().getParent().to(this.getView(), 'slide');

        this.sProductId = oEvent.getParameters().arguments.productId;
        this.loadProductData();
      },

      loadProductData: function () {
        const that = this,
          oModel = new JSONModel(),
          oComponent = this.byId('productDetailPage'),
          oController = this;

        oComponent.setBusy(true);

        this.getData(oModel, {
          url: this.sProductUrl + this.sProductId,
          then: () => {
            const sId = oModel.getProperty('/id');

            if (sId && sId === this.sProductId) {
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
              that.getRouter().navTo('products');
            }
          },
          finally: () => oComponent.setBusy(false)
        });
      },

      formatObjectStatusActiveText: function (
        bEnabled,
        sEnabledText,
        sDisabledText
      ) {
        return bEnabled ? sEnabledText : sDisabledText;
      },

      formatObjectStatusActiveState: function (bEnabled) {
        return bEnabled ? 'Success' : 'Error';
      },

      formatObjectStatusActiveIcon: function (bEnabled) {
        return bEnabled ? 'sap-icon://accept' : 'sap-icon://cancel';
      },

      _setProductPageLayout: function (sLayout) {
        this.getView().getParent().getParent().setLayout(sLayout);
      },

      onEditProductPress: function (oEvent) {
        this._setProductPageLayout('TwoColumnsMidExpanded');

        this.getRouter().navTo('productDetailEdit', {
          productId: this.sProductId
        });
      },

      onDeleteProductPress: function (oEvent) {
        const that = this,
          oModel = new JSONModel(),
          oPage = this.byId('productDetailPage'),
          sProductName = oPage.getModel().getProperty('/name');

        MessageBox.warning(
          this.localizeText(
            'dynamic.confirmDelete.text',
            this.localizeText('entity.product')
          ),
          {
            title: this.localizeText(
              'dynamic.confirmDelete.title',
              sProductName
            ),
            actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
            onClose: (sAction) => {
              if (sAction === MessageBox.Action.YES) {
                this.getData(oModel, {
                  url: this.sProductUrl + this.sProductId,
                  type: 'DELETE',
                  then: () => {
                    if (oModel.getProperty('/id')) {
                      MessageToast.show(
                        that.localizeText('dynamic.toast.delete', sProductName),
                        { at: 'center center' }
                      );
                    } else {
                      that._showDefaultErrorMessage();
                    }
                  },
                  finally: () => {
                    oPage.setBusy(false);

                    this._setProductPageLayout('OneColumn');

                    that.getRouter().navTo('products');
                  }
                });
              }
            }
          }
        );
      },

      formatIngredientListInfo: function (sAmount, sUomAbbr) {
        return `${sAmount} (${sUomAbbr})`;
      }
    });
  }
);
