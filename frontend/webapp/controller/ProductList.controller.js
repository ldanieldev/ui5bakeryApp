sap.ui.define(
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
  ],
  function (BaseController, JSONModel, MessageBox, Filter, FilterOperator) {
    'use strict';

    return BaseController.extend('bakeryApp.controller.ProductList', {
      onInit: function () {
        this.sProductUrl = this.getDataSources().products.uri;

        this.getView().addEventDelegate(
          { onBeforeShow: this.onBeforeShow },
          this
        );
      },

      onBeforeShow: function () {
        this.oProductList = this.byId('productList');
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

      onProductSearch: function (oEvent) {
        const sQuery =
          oEvent.getParameter('query') || oEvent.getParameter('newValue');
        let aFilters = [];

        if (sQuery) {
          aFilters = [
            new Filter({
              filters: [
                new Filter('name', FilterOperator.Contains, sQuery),
                new Filter('category', FilterOperator.Contains, sQuery),
                new Filter('description', FilterOperator.Contains, sQuery)
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

      onProductListItemPress: function (oEvent) {
        const sProductId = oEvent
          .getSource()
          .getBindingContext()
          .getProperty('id');

        this.getView()
          .getParent()
          .getParent()
          .setLayout('TwoColumnsMidExpanded');

        this.getRouter().navTo('productDetailView', {
          productId: sProductId
        });
      },

      formatInfoText: function (bEnabled, sEnabledMsg, sDisabledMsg) {
        return bEnabled ? sEnabledMsg : sDisabledMsg;
      },
      formatInfoState: function (bEnabled) {
        return bEnabled ? 'Success' : 'Error';
      }
    });
  }
);
