sap.ui.define(
  [
    'sap/ui/core/mvc/View',
    'sap/m/Page',
    'sap/m/MessageBox',
    'sap/m/Table',
    'sap/m/Column',
    'sap/m/Label',
    'sap/m/Text',
    'sap/ui/core/Item',
    'sap/m/Input',
    'sap/m/Select',
    'sap/m/ColumnListItem',
    'sap/m/ObjectNumber',
    'sap/m/SearchField',
    'sap/m/Toolbar',
    'sap/m/ToolbarSpacer',
    'sap/m/Button',
    'sap/m/Dialog',
    'sap/ui/layout/form/SimpleForm',
    'sap/ui/layout/HorizontalLayout',
    'sap/ui/core/CustomData'
  ],
  function (
    View,
    Page,
    MessageBox,
    Table,
    Column,
    Label,
    Text,
    Item,
    Input,
    Select,
    ColumnListItem,
    ObjectNumber,
    SearchField,
    Toolbar,
    ToolbarSpacer,
    Button,
    Dialog,
    SimpleForm,
    HorizontalLayout,
    CustomData
  ) {
    'use strict';
    return View.extend('bakeryApp.view.Ingredients', {
      async: true,

      getAutoPrefixId: function () {
        return true;
      },
      getControllerName: function () {
        return 'bakeryApp.controller.Ingredients';
      },
      createContent: async function (oController) {
        try {
          return await new Promise(function (res, rej) {
            res(
              new Page({
                showHeader: false,
                content: [
                  new Dialog('ingredientFormDialog', {
                    icon: 'sap-icon://nutrition-activity',
                    title: '{i18n>dynamic.form.title.edit}',
                    beforeOpen: [oController.onFormBeforeOpen, oController],
                    content: [
                      new SimpleForm('ingredientForm', {
                        editable: true,
                        content: [
                          new Label({
                            required: true,
                            text: '{i18n>generic.label.name}'
                          }),
                          new Input({
                            value: {
                              path: '/name',
                              type: 'sap.ui.model.type.String'
                            },
                            liveChange: [oController.validateForm, oController]
                          }),
                          new Label({
                            text: '{i18n>ingredientList.form.label.stockCount}'
                          }),
                          new Input({
                            type: 'Number',
                            value: {
                              path: '/stockCount',
                              type: 'sap.ui.model.type.Float',
                              formatOptions: {
                                groupingEnabled: false
                              },
                              constraints: {
                                minimum: 0
                              }
                            },
                            liveChange: [oController.validateForm, oController]
                          }),
                          new Label({
                            text: '{i18n>ingredientList.form.label.reorderThreshold}'
                          }),
                          new Input({
                            type: 'Number',
                            value: {
                              path: '/reorderThreshold',
                              type: 'sap.ui.model.type.Float',
                              formatOptions: {
                                groupingEnabled: false,
                                maxFractionDigits: 2
                              },
                              constraints: {
                                minimum: 0
                              }
                            },
                            liveChange: [oController.validateForm, oController]
                          }),
                          new Label({
                            required: true,
                            text: '{i18n>generic.label.uom}'
                          }),
                          new Select({
                            forceSelection: false,
                            selectedKey: '{/uomAbbreviation}',
                            change: [oController.onUomChange, oController],
                            items: {
                              path: 'appSettings>/ingredientUnits',
                              template: new Item({
                                key: '{appSettings>key}',
                                text: {
                                  parts: [
                                    { path: 'appSettings>text' },
                                    { value: oController }
                                  ],
                                  formatter: oController.formatIngredientText
                                },
                                customData: new CustomData({
                                  key: 'uom',
                                  value: '{appSettings>text}'
                                })
                              })
                            }
                          }),
                          new Label({
                            required: true,
                            text: '{i18n>ingredientList.form.label.price}'
                          }),
                          new Input({
                            type: 'Number',
                            value: {
                              parts: [{ path: '/price' }, { value: 'USD' }],
                              type: 'sap.ui.model.type.Currency',
                              formatOptions: {
                                showMeasure: false
                              }
                            },
                            liveChange: [oController.validateForm, oController]
                          })
                        ]
                      })
                    ],
                    beginButton: new Button({
                      text: '{i18n>Submit}',
                      enabled: false,
                      press: [oController.onFormSubmit, oController]
                    }),
                    endButton: new Button({
                      text: '{i18n>Cancel}',
                      press: [oController.onDialogCloseBtnPress]
                    })
                  }),

                  new Table('ingredientTable', {
                    growing: true,
                    growingThreshold: 20,
                    busyIndicatorDelay: 1,
                    noDataText: {
                      parts: [
                        'i18n>dynamic.noDataText',
                        'i18n>entity.ingredient.plural'
                      ],
                      formatter: oController.formatter.formatMessage
                    },
                    headerToolbar: new Toolbar({
                      content: [
                        new SearchField('searchField', {
                          showRefreshButton: false,
                          width: '15%',
                          search: [oController.onSearch, oController],
                          liveChange: [oController.onSearch, oController]
                        }),
                        new ToolbarSpacer(),
                        new Button({
                          icon: 'sap-icon://add',
                          tooltip: {
                            parts: [
                              'i18n>dynamic.button.add.tooltip',
                              'i18n>entity.ingredient'
                            ],
                            formatter: oController.formatter.formatMessage
                          },
                          press: [oController.onAddBtnPress, oController]
                        }),
                        new Button({
                          icon: 'sap-icon://synchronize',
                          press: [oController.loadListData, oController]
                        })
                      ]
                    }),
                    columns: [
                      new Column({
                        header: new Text({
                          text: '{i18n>ingredientList.columnHeading.ingredient}'
                        })
                      }),
                      new Column({
                        header: new Text({
                          text: '{i18n>ingredientList.columnHeading.inStock}'
                        })
                      }),
                      new Column({
                        header: new Text({
                          text: '{i18n>ingredientList.columnHeading.price}'
                        })
                      }),
                      new Column({
                        header: new Text({
                          text: '{i18n>ingredientList.columnHeading.actions}'
                        })
                      })
                    ],
                    items: {
                      path: '/',
                      sorter: {
                        path: 'name',
                        descending: true
                      },
                      template: new ColumnListItem({
                        vAlign: 'Middle',
                        cells: [
                          new Text({ text: '{name}' }),
                          new ObjectNumber({
                            number: '{stockCount}',
                            unit: {
                              parts: [
                                { path: 'uom' },
                                { path: 'uomAbbreviation' },
                                { value: oController }
                              ],
                              formatter: oController.formatUnit
                            },
                            state: {
                              parts: [
                                { path: 'stockCount' },
                                { path: 'reorderThreshold' }
                              ],
                              formatter: oController.formatStockState
                            }
                          }),
                          new ObjectNumber({
                            number: {
                              parts: [{ path: 'price' }, { value: 'USD' }],
                              type: 'sap.ui.model.type.Currency',
                              formatOptions: {
                                showMeasure: false
                              }
                            },
                            numberUnit: 'USD'
                          }),
                          new HorizontalLayout({
                            content: [
                              new Button({
                                icon: 'sap-icon://edit',
                                tooltip: {
                                  parts: [
                                    'i18n>dynamic.button.edit.tooltip',
                                    'i18n>entity.ingredient'
                                  ],
                                  formatter: oController.formatter.formatMessage
                                },
                                press: [oController.onEditBtnPress, oController]
                              }).addStyleClass('sapUiTinyMarginEnd'),
                              new Button({
                                icon: 'sap-icon://delete',
                                press: [
                                  oController.onDeleteBtnPress,
                                  oController
                                ]
                              })
                            ]
                          })
                        ]
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
