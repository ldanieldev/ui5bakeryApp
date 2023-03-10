sap.ui.define(['sap/ui/core/UIComponent'], function (UIComponent) {
  'use strict';

  return UIComponent.extend('bakeryApp.Component', {
    metadata: {
      manifest: 'json',
      interfaces: ['sap.ui.core.IAsyncContentCreation']
    },

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    init: function () {
      // call the base component's init function
      UIComponent.prototype.init.apply(this, arguments);

      // create the views based on the url/hash
      this.getRouter().initialize();
    }
  });
});
