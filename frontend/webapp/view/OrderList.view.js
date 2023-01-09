sap.ui.define(
  [
    'sap/ui/core/mvc/View',
    'sap/m/Page',
    'sap/m/MessageBox',
    'sap/m/Title',
    'sap/m/Toolbar',
    'sap/m/ToolbarSpacer',
    'sap/m/Button',
    'sap/m/List',
    'sap/m/ObjectListItem',
    'sap/m/ObjectAttribute',
    'sap/m/ObjectStatus',
    'sap/m/SearchField'
  ],
  function (
    View,
    Page,
    MessageBox,
    Title,
    Toolbar,
    ToolbarSpacer,
    Button,
    List,
    ObjectListItem,
    ObjectAttribute,
    ObjectStatus,
    SearchField
  ) {
    'use strict';
    return View.extend('bakeryApp.view.OrderList', {
      async: true,

      getAutoPrefixId: function () {
        return true;
      },
      getControllerName: function () {
        return 'bakeryApp.controller.OrderList';
      },
      createContent: async function (oController) {
        try {
          return await new Promise(function (res, rej) {
            res(
              new Page({
                title:
                  '{i18n>orderList.page.title} ({=${orderListModel>/}.length})',
                showFooter: false,
                showHeader: false,
                content: [
                  new List('orderList', {
                    noDataText: '{i18n>orderList.noDataText}',
                    headerToolbar: new Toolbar({
                      content: [
                        new SearchField('searchField', {
                          showRefreshButton: false,
                          width: '35%',
                          search: [oController.onOrderSearch, oController],
                          liveChange: [oController.onOrderSearch, oController]
                        }),
                        new ToolbarSpacer(),
                        new Button({ icon: 'sap-icon://filter' }),
                        new Button({ icon: 'sap-icon://group-2' }),
                        new Button({
                          icon: 'sap-icon://synchronize',
                          press: [oController.loadOrderListData, oController]
                        })
                      ]
                    }),
                    items: {
                      path: '/',
                      sorter: {
                        path: 'OrderID',
                        descending: true
                      },
                      template: new ObjectListItem({
                        type: 'Active',
                        press: [oController.onOrderListItemPress, oController],
                        title: {
                          parts: ['i18n>orderList.listtItem.title', 'OrderID'],
                          formatter: oController.formatter.formatMessage
                        },
                        firstStatus: new ObjectStatus({
                          inverted: true,
                          text: {
                            parts: [
                              'ProductionStatus',
                              'i18n>orderList.status.started',
                              'i18n>orderList.status.stopped'
                            ],
                            formatter: oController.formatFirstStatusText
                          },
                          state: {
                            path: 'ProductionStatus',
                            formatter: oController.formatFirstStatusState
                          }
                        }),
                        secondStatus: new ObjectStatus({
                          text: {
                            parts: [
                              'TargetDate',
                              'i18n>orderList.status.onTime',
                              'i18n>orderList.status.overdue'
                            ],
                            formatter: oController.formatSecondStatusText
                          },
                          state: {
                            path: 'TargetDate',
                            formatter: oController.formatSecondStatusState
                          }
                        }),
                        attributes: [
                          new ObjectAttribute({ text: '{MaterialDS}' }),
                          new ObjectAttribute({ text: '{MaterialID}' })
                        ],
                        number: {
                          path: 'TargetDate',
                          type: 'sap.ui.model.type.Date',
                          formatOptions: {
                            source: {
                              pattern: 'yyyy-MM-ddTHH:mm:ss'
                            },
                            style: 'short'
                          }
                        }
                      })
                    }
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
