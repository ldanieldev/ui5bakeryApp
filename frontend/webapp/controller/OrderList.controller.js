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

    return BaseController.extend('bakeryApp.controller.OrderList', {
      urlOrderListSelect: 'localService/mockData/orders.json',

      onInit: function () {
        this.getView().addEventDelegate(
          { onBeforeShow: this.onBeforeShow },
          this
        );
      },

      onBeforeShow: function () {
        this.oOrderList = this.byId('orderList');
        this.loadOrderListData();
      },

      loadOrderListData: function () {
        const oModel = new JSONModel(),
          oComponent = this.oOrderList;

        oComponent.setBusy(true);

        oModel
          .loadData(this.urlOrderListSelect)
          .catch((oErr) => MessageBox.error(oErr))
          .then(() => oComponent.setModel(oModel))
          .finally(() => oComponent.setBusy(false));
      },

      onOrderSearch: function (oEvent) {
        const sQuery =
          oEvent.getParameter('query') || oEvent.getParameter('newValue');
        let aFilters = [];

        if (sQuery) {
          aFilters = [
            new Filter({
              filters: [
                new Filter('OrderID', FilterOperator.Contains, sQuery),
                new Filter('MaterialID', FilterOperator.Contains, sQuery),
                new Filter('MaterialDS', FilterOperator.Contains, sQuery)
              ],
              and: false
            })
          ];
        }
        this._applySearchFilter(
          this.oOrderList,
          aFilters,
          'entity.order.plural'
        );
      },

      onOrderListItemPress: function (oEvent) {
        const sOrderId = oEvent
          .getSource()
          .getBindingContext()
          .getProperty('OrderID');

        this.getView()
          .getParent()
          .getParent()
          .setLayout('TwoColumnsMidExpanded');

        this.getRouter().navTo('orderDetail', {
          orderId: sOrderId
        });
      },

      formatFirstStatusText: function (
        iProductionStatus,
        sStartedMsg,
        sStoppedMsg
      ) {
        return iProductionStatus === 1
          ? sStartedMsg
          : iProductionStatus === 2
          ? sStoppedMsg
          : '';
      },
      formatFirstStatusState: function (iProductionStatus) {
        return iProductionStatus === 1
          ? 'Success'
          : iProductionStatus === 2
          ? 'Error'
          : 'None';
      },

      formatSecondStatusText: function (sDate, sPositiveMsg, sNegativeMsg) {
        let orderDate = new Date(sDate),
          currentDate = new Date();

        return currentDate.getTime() < orderDate.getTime()
          ? sPositiveMsg
          : sNegativeMsg;
      },

      formatSecondStatusState: function (sDate) {
        let orderDate = new Date(sDate),
          currentDate = new Date();

        return currentDate.getTime() < orderDate.getTime()
          ? 'Success'
          : 'Error';
      }
    });
  }
);
