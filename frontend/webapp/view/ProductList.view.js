sap.ui.define(
  [
    'sap/ui/core/mvc/View',
    'sap/m/Page',
    'sap/m/MessageBox',
    'sap/m/Toolbar',
    'sap/m/ToolbarSpacer',
    'sap/m/Button',
    'sap/m/List',
    'sap/m/StandardListItem',
    'sap/m/SearchField'
  ],
  function (
    View,
    Page,
    MessageBox,
    Toolbar,
    ToolbarSpacer,
    Button,
    List,
    StandardListItem,
    SearchField
  ) {
    'use strict';
    return View.extend('bakeryApp.view.ProductList', {
      async: true,

      getAutoPrefixId: function () {
        return true;
      },
      getControllerName: function () {
        return 'bakeryApp.controller.ProductList';
      },
      createContent: async function (oController) {
        try {
          return await new Promise(function (res, rej) {
            res(
              new Page({
                showFooter: false,
                showHeader: false,
                content: [
                  new List('productList', {
                    noDataText: {
                      parts: [
                        'i18n>dynamic.noDataText',
                        'i18n>entity.product.plural'
                      ],
                      formatter: oController.formatter.formatMessage
                    },
                    headerToolbar: new Toolbar({
                      content: [
                        new SearchField('searchField', {
                          showRefreshButton: false,
                          width: '35%',
                          search: [oController.onProductSearch, oController],
                          liveChange: [oController.onProductSearch, oController]
                        }),
                        new ToolbarSpacer(),
                        new Button({
                          icon: 'sap-icon://add',
                          tooltip: {
                            parts: [
                              'i18n>dynamic.button.add.tooltip',
                              'i18n>entity.product'
                            ],
                            formatter: oController.formatter.formatMessage
                          },
                          press: [oController.onAddBtnPress, oController]
                        }),
                        new Button({
                          icon: 'sap-icon://synchronize',
                          press: [oController.loadProductListData, oController]
                        })
                      ]
                    }),
                    items: {
                      path: '/',
                      sorter: {
                        path: 'name',
                        descending: true
                      },
                      template: new StandardListItem({
                        type: 'Navigation',
                        icon: '{image}',
                        title: '{name}',
                        description: '{description}',
                        adaptTitleSize: false,
                        infoStateInverted: true,
                        info: {
                          parts: [
                            'enabled',
                            'i18n>productList.status.enabled',
                            'i18n>productList.status.disabled'
                          ],
                          formatter: oController.formatInfoText
                        },
                        infoState: {
                          path: 'enabled',
                          formatter: oController.formatInfoState
                        },
                        press: [oController.onProductListItemPress, oController]
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
