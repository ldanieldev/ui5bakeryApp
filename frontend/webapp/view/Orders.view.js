sap.ui.define(
  [
    'sap/ui/core/mvc/View',
    'sap/m/Page',
    'sap/m/MessageBox',
    'sap/f/FlexibleColumnLayout'
  ],
  function (View, Page, MessageBox, FlexibleColumnLayout) {
    'use strict';
    return View.extend('bakeryApp.view.Orders', {
      async: true,

      getAutoPrefixId: function () {
        return true;
      },
      getControllerName: function () {
        return 'bakeryApp.controller.Orders';
      },
      createContent: async function (oController) {
        try {
          return await new Promise(function (res, rej) {
            res(
              new Page({
                showFooter: false,
                showHeader: false,
                content: [
                  new FlexibleColumnLayout('orderFlexLayout', {
                    layout: 'OneColumn'
                  })
                ]
              })
            );
          });
        } catch (err) {
          MessageBox.error(err.toLocaleString(), { title: err.name });
        }
      }
    });
  }
);
