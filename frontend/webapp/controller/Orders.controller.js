sap.ui.define(['./BaseController'], function (BaseController) {
  'use strict';

  return BaseController.extend('bakeryApp.controller.Orders', {
    onInit: function () {
      this.getView().addEventDelegate(
        { onBeforeShow: this.onBeforeShow },
        this
      );
    },
    onBeforeShow: function (oEvent) {
      this.byId('orderFlexLayout').setLayout(
        oEvent.data.orderId ? 'TwoColumnsMidExpanded' : 'OneColumn'
      );
    }
  });
});
