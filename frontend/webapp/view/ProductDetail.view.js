sap.ui.define(
  [
    'sap/ui/core/mvc/View',
    'sap/f/DynamicPage',
    'sap/f/DynamicPageHeader',
    'sap/f/DynamicPageTitle',
    'sap/m/MessageBox',
    'sap/m/Title',
    'sap/m/Text',
    'sap/m/Label',
    'sap/m/Button',
    'sap/m/Image',
    'sap/m/FlexBox',
    'sap/m/VBox',
    'sap/m/ObjectStatus',
    'sap/ui/layout/form/SimpleForm',
    'sap/m/MultiInput',
    'sap/m/Token',
    'sap/ui/layout/form/Form',
    'sap/ui/layout/form/FormContainer',
    'sap/ui/layout/form/FormElement',
    'sap/m/Panel',
    'sap/m/Toolbar',
    'sap/m/ToolbarSpacer',
    'sap/ui/layout/form/ColumnLayout'
  ],
  function (
    View,
    DynamicPage,
    DynamicPageHeader,
    DynamicPageTitle,
    MessageBox,
    Title,
    Text,
    Label,
    Button,
    Image,
    FlexBox,
    VBox,
    ObjectStatus,
    SimpleForm,
    MultiInput,
    Token,
    Form,
    FormContainer,
    FormElement,
    Panel,
    Toolbar,
    ToolbarSpacer,
    ColumnLayout
  ) {
    'use strict';
    return View.extend('bakeryApp.view.ProductDetail', {
      async: true,

      getAutoPrefixId: function () {
        return true;
      },
      getControllerName: function () {
        return 'bakeryApp.controller.ProductDetail';
      },
      createContent: async function (oController) {
        try {
          return await new Promise(function (res, rej) {
            res(
              new DynamicPage('productDetailPage', {
                busyIndicatorDelay: 1,
                title: new DynamicPageTitle({
                  heading: new Title({ text: '{/name}' }),
                  actions: [
                    new Button({
                      icon: 'sap-icon://edit',
                      tooltip: '{i18n>Edit}',
                      press: [oController.onEditProductPress, oController]
                    }),
                    new Button({
                      icon: 'sap-icon://delete',
                      tooltip: '{i18n>Delete}',
                      press: [oController.onDeleteProductPress, oController]
                    })
                  ]
                }),
                header: new DynamicPageHeader({
                  content: new FlexBox({
                    wrap: 'Wrap',
                    fitContainer: true,
                    items: [
                      new Image({ src: '{/image}', height: '10rem' }),
                      new VBox({
                        width: '30%',
                        items: [
                          new SimpleForm({
                            editable: false,
                            layout: 'ResponsiveGridLayout',
                            content: [
                              new Label({
                                text: '{i18n>product.form.category}'
                              }),
                              new Text({ text: '{/category}' }),
                              new Label({
                                text: '{i18n>product.form.tags}'
                              }),
                              new MultiInput({
                                enabled: false,
                                showClearIcon: false,
                                showValueHelp: false,
                                tokens: {
                                  path: '/tags',
                                  template: new Token({
                                    editable: false,
                                    text: '{tag}',
                                    key: '{tag}'
                                  })
                                }
                              }).addStyleClass('removeInputBorder')
                            ]
                          })
                        ]
                      }),
                      new VBox({
                        width: '30%',
                        items: [
                          new SimpleForm({
                            editable: false,
                            layout: 'ResponsiveGridLayout',
                            content: [
                              new Label({
                                text: '{i18n>product.form.description}'
                              }),
                              new Text({ text: '{/description}' })
                            ]
                          })
                        ]
                      }),
                      new VBox({
                        width: '15%',
                        alignItems: 'End',
                        items: [
                          new ObjectStatus({
                            inverted: true,
                            state: {
                              path: '/enabled',
                              formatter:
                                oController.formatObjectStatusActiveState
                            },
                            icon: {
                              path: '/enabled',
                              formatter:
                                oController.formatObjectStatusActiveIcon
                            },
                            text: {
                              parts: [
                                '/enabled',
                                'i18n>productList.status.enabled',
                                'i18n>productList.status.disabled'
                              ],
                              formatter:
                                oController.formatObjectStatusActiveText
                            }
                          })
                        ]
                      })
                    ]
                  })
                }),
                content: [
                  new VBox({
                    width: '100%',
                    items: [
                      new Label({
                        text: '{i18n>product.title.recipeDetails}',
                        required: false,
                        showColon: false
                      }).addStyleClass('titleLbl'),
                      new VBox({
                        width: '100%',
                        items: {
                          path: '/recipe',
                          template: new Panel({
                            expandable: true,
                            expanded: true,
                            headerText: {
                              path: 'description',
                              formatter: oController.formatter.toTitleCase
                            },
                            content: [
                              new Form({
                                layout: new ColumnLayout(),
                                formContainers: [
                                  new FormContainer({
                                    title:
                                      '{i18n>product.form.title.ingredients}',
                                    formElements: {
                                      path: 'ingredients',
                                      templateShareable: false,
                                      template: new FormElement({
                                        label: '{name}',
                                        fields: new Text({
                                          text: '{amount} ({uomAbbreviation})'
                                        })
                                      })
                                    }
                                  }),
                                  new FormContainer({
                                    title:
                                      '{i18n>product.form.title.intructions}',
                                    formElements: {
                                      path: 'instructions',
                                      templateShareable: false,
                                      template: new FormElement({
                                        label: new Label({ text: '{order}' }),
                                        fields: new Text({
                                          text: '{instruction}'
                                        })
                                      })
                                    }
                                  })
                                ]
                              })
                            ]
                          }).addStyleClass('sapUiSmallMarginTop')
                        }
                      })
                    ]
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
