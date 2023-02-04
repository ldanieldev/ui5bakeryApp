sap.ui.define(
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
  ],
  function (BaseController, JSONModel, Filter, FilterOperator) {
    'use strict';

    return BaseController.extend('bakeryApp.controller.ProductList', {
      onInit: function () {
        this.sProductUrl = this.getDataSources().products.uri;

        this.getCurrentRoute().attachPatternMatched(this.onBeforeShow, this);
      },

      onBeforeShow: function (oEvent) {
        const sViewId = oEvent.getParameters().name;

        if (sViewId === 'products') {
          this._setProductPageLayout('OneColumn');
        }

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

      _setProductPageLayout: function (sLayout) {
        this.getView().getParent().getParent().setLayout(sLayout);
      },

      _showDetailView(sProductId) {
        this._setProductPageLayout('TwoColumnsMidExpanded');

        if (sProductId) {
          this.getRouter().navTo('productDetailView', {
            productId: sProductId
          });
        } else {
          this.getRouter().navTo('productDetailAdd', {}, true);
        }
      },

      onProductListItemPress: function (oEvent) {
        const sProductId = oEvent
          .getSource()
          .getBindingContext()
          .getProperty('id');

        this._showDetailView(sProductId);
      },

      onAddBtnPress: function (oEvent) {
        this._showDetailView();
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
