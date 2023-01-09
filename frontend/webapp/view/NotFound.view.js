sap.ui.define(
  ['sap/ui/core/mvc/View', 'sap/m/MessagePage', 'sap/m/MessageBox'],
  function (View, MessagePage, MessageBox) {
    'use strict';
    return View.extend('bakeryApp.view.NotFound', {
      async: true,

      getAutoPrefixId: function () {
        return true;
      },

      getControllerName: function () {
        return 'bakeryApp.controller.NotFound';
      },

      createContent: async function (oController) {
        try {
          return await new Promise(function (res, rej) {
            res(
              new MessagePage({
                title: '{i18n>NotFound.title}',
                text: '{i18n>NotFound.text}',
                description: '{i18n>NotFound.description}',
                showHeader: false
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
