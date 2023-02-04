sap.ui.define(['./BaseController'], function (BaseController) {
  'use strict';

  return BaseController.extend('bakeryApp.controller.Products', {
    onInit: function () {
      this.getCurrentRoute().attachPatternMatched(this.onBeforeShow, this);
    },

    onBeforeShow: function (oEvent) {
      const sViewId = oEvent.getParameters().name;

      this.byId('productFlexLayout').setLayout(
        sViewId === 'products' ? 'OneColumn' : 'TwoColumnsMidExpanded'
      );
    }
  });
});
