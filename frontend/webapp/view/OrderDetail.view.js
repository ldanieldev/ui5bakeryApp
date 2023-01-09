sap.ui.define(
  [
    'sap/ui/core/mvc/View',
    'sap/f/semantic/SemanticPage',
    'sap/m/MessageBox',
    'sap/m/Title',
    'sap/m/Text',
    'sap/m/Label',
    'sap/m/ObjectNumber',
    'sap/ui/layout/form/SimpleForm'
  ],
  function (
    View,
    SemanticPage,
    MessageBox,
    Title,
    Text,
    Label,
    ObjectNumber,
    SimpleForm
  ) {
    'use strict';
    return View.extend('bakeryApp.view.OrderDetail', {
      async: true,

      getAutoPrefixId: function () {
        return true;
      },
      getControllerName: function () {
        return 'bakeryApp.controller.OrderDetail';
      },
      createContent: async function (oController) {
        try {
          return await new Promise(function (res, rej) {
            res(
              new SemanticPage('orderDetailPage', {
                busyIndicatorDelay: 1,
                titleHeading: new Title({
                  text: {
                    parts: ['i18n>orderDetail.header.title', '/OrderID'],
                    formatter: oController.formatter.formatMessage
                  }
                }),
                headerContent: new SimpleForm({
                  editable: false,
                  content: [
                    new Label({
                      required: false,
                      text: '{i18n>orderDetail.header.customer}'
                    }),
                    new Text({
                      text: '{/CustomerName}'
                    }),
                    new Label({
                      required: false,
                      text: '{i18n>orderDetail.header.ordered}'
                    }),
                    new Text({
                      text: {
                        path: '/OrderDate',
                        type: 'sap.ui.model.type.Date',
                        formatOptions: {
                          source: {
                            pattern: 'yyyy-MM-ddTHH:mm:ss'
                          },
                          style: 'full'
                        }
                      }
                    }),
                    new Label({
                      required: false,
                      text: '{i18n>orderDetail.header.price}'
                    }),
                    new ObjectNumber({
                      number: {
                        parts: [{ path: '/Price' }, { value: 'USD' }],
                        type: 'sap.ui.model.type.Currency',
                        formatOptions: {
                          showMeasure: false
                        }
                      },
                      numberUnit: 'USD'
                    })
                  ]
                })
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
