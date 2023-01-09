sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    '../model/Formatter',
    'sap/ui/core/routing/History',
    'sap/m/MessageBox'
  ],
  function (Controller, Formatter, History, MessageBox) {
    'use strict';

    return Controller.extend('bakeryApp.controller.BaseController', {
      //global formatter for application
      formatter: Formatter,

      /**
       * Convenience method for accessing the router in every controller of the application.
       * @public
       * @returns {sap.ui.core.routing.Router} the router for this component
       */
      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },

      /**
       * Event handler for navigating back.
       * It there is a history entry we go one step back in the browser history
       * If not, it will replace the current entry of the browser history with the master route.
       * @public
       */
      onNavBackBtnPress: function () {
        var sPreviousHash = History.getInstance().getPreviousHash();

        if (sPreviousHash !== undefined) {
          // eslint-disable-next-line sap-no-history-manipulation
          history.go(-1);
        } else {
          this.getRouter().navTo('home', {}, true);
        }
      },

      onRoutePatternMatched: function (oEvent) {},

      /**
       * Convenience method for getting the view model by name in every controller of the application.
       * @public
       * @param {string} sName the model name
       * @returns {sap.ui.model.Model} the model instance
       */
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },

      /**
       * Convenience method for setting the view model in every controller of the application.
       * @public
       * @param {sap.ui.model.Model} oModel the model instance
       * @param {string} sName the model name
       * @returns {sap.ui.mvc.View} the view instance
       */
      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      /**
       * Convenience method for getting the resource bundle.
       * @public
       * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
       */
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel('i18n').getResourceBundle();
      },

      /**
       * Convenience method for getting the data source.
       * @public
       * @returns {JSON} json list of data sources.
       */
      getDataSources: function () {
        return this.getOwnerComponent().getMetadata().getManifest()['sap.app']
          .dataSources;
      },

      /**
       * Returns a locale-specific string value for the given key sKey.
       * @public
       * @param {string} skey Key to retrieve the text for
       * @param {String/Array} aArgs List of parameter values which should replace the placeholders "{n}"
       * @returns {string}
       */
      localizeText: function (sKey, aArgs, bIgnoreKeyFallback = false) {
        return this.getResourceBundle().getText(
          sKey,
          aArgs,
          bIgnoreKeyFallback
        );
      },

      /**
       * Convenience method to close a dialog box from the begin or end button press event
       * @public
       * @param {sap.ui.base.Event} oEvent button press event
       */
      onDialogCloseBtnPress: function (oEvent) {
        oEvent.getSource().getParent().close();
      },

      /**
       * Convenience method to get load data into a json model with default actions
       * and error handling applied.
       * @public
       * @param {sap.ui.model.json.JSONModel} oModel
       * @param {JSON} oArgs
       */
      getData: function (oModel, oArgs) {
        const oParams = {
          url: '',
          params: {},
          async: true,
          type: 'GET',
          then: () => {},
          catch: (oErr) => {
            if (oErr.statusCode === 0) {
              MessageBox.error(this.localizeText('error.connection.message'), {
                title: this.localizeText('error.connection.title')
              });
            } else if (oErr.responseText.search('duplicate key error') >= 0) {
              MessageBox.error(this.localizeText('error.duplicate.message'), {
                title: this.localizeText('error.duplicate.title')
              });
            } else if (oErr.statusCode) {
              MessageBox.error(oErr.statusText, { title: oErr.message });
            } else {
              MessageBox.error(this.localizeText('error.default.message'), {
                title: this.localizeText('error.default.title')
              });
            }
          },
          finally: () => {},
          ...oArgs
        };

        oModel
          .loadData(oParams.url, oParams.params, oParams.async, oParams.type)
          .catch(oParams.catch)
          .then(oParams.then)
          .finally(oParams.finally);
      },

      /**
       * Convenience method to apply filters to tables as well as setting dyanmic no data text.
       * @public
       * @param {sap.m.Table/sap.f.GridList} oList table/gridList object filters should be applied to
       * @param {Array} aFilters array of filters to be applied
       * @param {String} sEntityI18nCode i18n key for the entity of the table for no data text
       */
      _applySearchFilter: function (oList, aFilters, sEntityI18nCode) {
        oList.getBinding('items').filter(aFilters, 'Application');

        // change the noDataText of the list in case there are no filter results
        oList.setNoDataText(
          this.localizeText(
            aFilters.length !== 0
              ? 'dynamic.filterNoDataText'
              : 'dynamic.noDataText',
            this.localizeText(sEntityI18nCode)
          )
        );
      }
    });
  }
);
