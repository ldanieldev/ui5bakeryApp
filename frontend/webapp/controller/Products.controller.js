sap.ui.define(['./BaseController'], function (BaseController) {
  'use strict';

  return BaseController.extend('bakeryApp.controller.Products', {
    onInit: function () {
      this.getView().addEventDelegate(
        { onBeforeShow: this.onBeforeShow },
        this
      );
    },
    onBeforeShow: function (oEvent) {
      this.byId('productFlexLayout').setLayout(
        oEvent.data.productId ? 'TwoColumnsMidExpanded' : 'OneColumn'
      );
    }
  });
});
