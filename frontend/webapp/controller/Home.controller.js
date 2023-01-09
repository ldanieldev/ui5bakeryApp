sap.ui.define(
  ['./BaseController', 'sap/ui/model/json/JSONModel', 'sap/m/MessageBox'],
  function (BaseController, JSONModel, MessageBox) {
    'use strict';

    return BaseController.extend('bakeryApp.controller.Home', {
      urlDashboardTileSelect: 'localService/mockData/dashboardTileData.json',
      urlChartSelect: 'localService/mockData/chartData.json',
      urlDtChartSelect: 'localService/mockData/downtimeChartData.json',
      urlScrapChartSelect: 'localService/mockData/scrapChartData.json',

      onInit: function () {
        this.getView().addEventDelegate(
          { onBeforeShow: this.onBeforeShow },
          this
        );
      },

      onBeforeShow: function () {
        this.loadDashboardData();
      },

      onViewOrdersBtnPress: function () {
        this.getRouter().navTo('orders');
      },

      loadDashboardData: function () {
        const oPageLastUpdatedText = this.byId('pageLastUpdatedText');

        // this.loadDashboardTileData();
        // this.loadChartData();
        // this.loadDtChartData();
        // this.loadScrapReasonChartData();

        oPageLastUpdatedText.setText(new Date().toLocaleTimeString());
      },

      loadDashboardTileData: function () {
        const oModel = new JSONModel(),
          oContainer = this.byId('overviewTileContainer');

        oContainer.setBusy(true);

        oModel
          .loadData(this.urlDashboardTileSelect)
          .catch((oErr) => MessageBox.error(oErr))
          .then(() => {
            oContainer.setModel(oModel);
          })
          .finally(() => oContainer.setBusy(false));
      },

      loadChartData: function () {
        const oModel = new JSONModel(),
          oChart = this.byId('colChart');

        oChart.setBusy(true);

        oModel
          .loadData(this.urlChartSelect)
          .catch((oErr) => MessageBox.error(oErr))
          .then(() => {
            oChart.setModel(oModel);
          })
          .finally(() => oChart.setBusy(false));
      },

      loadDtChartData: function () {
        const oModel = new JSONModel(),
          oChart = this.byId('downtimeChart');

        oChart.setBusy(true);

        oModel
          .loadData(this.urlDtChartSelect)
          .catch((oErr) => MessageBox.error(oErr))
          .then(() => {
            oChart.setModel(oModel);
          })
          .finally(() => oChart.setBusy(false));
      },
      loadScrapReasonChartData: function () {
        const oModel = new JSONModel(),
          oChart = this.byId('scrapReasonChart');

        oChart.setBusy(true);

        oModel
          .loadData(this.urlScrapChartSelect)
          .catch((oErr) => MessageBox.error(oErr))
          .then(() => {
            oChart.setModel(oModel);
          })
          .finally(() => oChart.setBusy(false));
      },

      onPanelExpand: function (oEvent) {
        const oPerfPanel = this.byId('plantPerformancePanel'),
          oKpiPanel = this.byId('orderOverviewPanel'),
          oVizPanel = this.byId('vizViewPanel');

        if (oPerfPanel && oKpiPanel && oVizPanel) {
          const bPerfPanelExpanded = oPerfPanel.getExpanded(),
            bKpiPanelExpanded = oKpiPanel.getExpanded(),
            bVizPanelExpanded = oVizPanel.getExpanded(),
            oVizContainer = oVizPanel.getContent()[0];

          if (oVizContainer) {
            if (!bPerfPanelExpanded && !bKpiPanelExpanded) {
              oVizContainer.getItems().forEach((oItem, iIndex) => {
                oItem
                  .getLayoutData()
                  .setMinWidth(iIndex === 0 ? '100%' : '50%');
              });
            } else {
              oVizContainer.getItems().forEach((oItem, iIndex) => {
                oItem.getLayoutData().setMinWidth(iIndex === 0 ? '50%' : '25%');
              });
            }
          }
        }
      },

      onOverviewFilterChange: function (oEvent) {
        const sSelectedKey = oEvent.getParameters().selectedItem.getKey();
        this.byId('overviewDtRangeSelect').setVisible(sSelectedKey === 'CUS');
      }
    });
  }
);
