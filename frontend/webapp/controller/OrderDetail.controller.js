sap.ui.define(
  ['./BaseController', 'sap/ui/model/json/JSONModel', 'sap/m/MessageBox'],
  function (BaseController, JSONModel, MessageBox) {
    'use strict';

    return BaseController.extend('bakeryApp.controller.OrderDetail', {
      urlOrderListSelect: 'localService/mockData/orders.json',

      onInit: function () {
        this.getRouter()
          .getRoute('orderDetail')
          .attachPatternMatched(this.onBeforeShow, this);
      },

      onBeforeShow: function (oEvent) {
        const sOrderId = oEvent.getParameters().arguments.orderId;
        this.loadOrderData(sOrderId);
      },

      loadOrderData: function (sOrderId) {
        const oModel = new JSONModel(),
          oComponent = this.byId('orderDetailPage');

        oComponent.setBusy(true);
        this.setModel(oModel, 'orderListModel');

        oModel
          .loadData(this.urlOrderListSelect)
          .catch((oErr) => MessageBox.error(oErr))
          .then(() =>
            oComponent.setModel(
              new JSONModel(
                oModel
                  .getData()
                  .filter((order) => order.OrderID === sOrderId)[0]
              )
            )
          )
          .finally(() => oComponent.setBusy(false));
      }
    });
  }
);
