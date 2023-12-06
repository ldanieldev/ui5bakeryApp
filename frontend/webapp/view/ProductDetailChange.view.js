sap.ui.define(
  [
    'sap/ui/core/mvc/View',
    'sap/f/DynamicPage',
    'sap/f/DynamicPageHeader',
    'sap/f/DynamicPageTitle',
    'sap/m/MessageBox',
    'sap/m/Title',
    'sap/m/Input',
    'sap/m/Select',
    'sap/ui/core/Item',
    'sap/m/TextArea',
    'sap/m/Label',
    'sap/m/Text',
    'sap/m/Button',
    'sap/m/Image',
    'sap/m/FlexBox',
    'sap/m/VBox',
    'sap/m/Switch',
    'sap/ui/layout/form/SimpleForm',
    'sap/m/MultiInput',
    'sap/m/Token',
    'sap/ui/layout/form/Form',
    'sap/ui/layout/form/FormContainer',
    'sap/ui/layout/form/FormElement',
    'sap/m/Panel',
    'sap/m/Toolbar',
    'sap/m/ToolbarSpacer',
    'sap/ui/layout/form/ResponsiveGridLayout',
    'sap/ui/unified/FileUploader',
    'sap/ui/core/Icon'
  ],
  function (
    View,
    DynamicPage,
    DynamicPageHeader,
    DynamicPageTitle,
    MessageBox,
    Title,
    Input,
    Select,
    Item,
    TextArea,
    Label,
    Text,
    Button,
    Image,
    FlexBox,
    VBox,
    Switch,
    SimpleForm,
    MultiInput,
    Token,
    Form,
    FormContainer,
    FormElement,
    Panel,
    Toolbar,
    ToolbarSpacer,
    ResponsiveGridLayout,
    FileUploader,
    Icon
  ) {
    'use strict';
    return View.extend('bakeryApp.view.ProductDetailChange', {
      async: true,

      getAutoPrefixId: function () {
        return true;
      },
      getControllerName: function () {
        return 'bakeryApp.controller.ProductDetailChange';
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
                    new Button('saveBtn', {
                      text: '{i18n>Save}',
                      icon: 'sap-icon://save',
                      enabled: false,
                      type: 'Accept',
                      press: [oController.onSaveBtnPress, oController]
                    }),
                    new Button({
                      text: '{i18n>Cancel}',
                      icon: 'sap-icon://cancel',
                      type: 'Emphasized',
                      press: [oController.onEditCancelBtnPress, oController]
                    })
                  ]
                }),
                header: new DynamicPageHeader({
                  content: new FlexBox({
                    wrap: 'Wrap',
                    fitContainer: true,
                    items: [
                      new VBox({
                        width: '20%',
                        items: [
                          new Image('imageComponent', {
                            visible: {
                              path: '/image',
                              formatter: oController.formatImageVisible
                            },
                            src: '{/image}',
                            height: '8rem'
                          }),
                          new Icon('imageIcon', {
                            visible: {
                              path: '/image',
                              formatter: oController.formatIconVisible
                            },
                            src: 'sap-icon://add-photo',
                            size: '5rem'
                          }).addStyleClass(
                            'sapUiSmallMarginBottom sapUiTinyMarginBegin'
                          ),
                          new FileUploader('imageInput', {
                            buttonOnly: true,
                            maximumFileSize: 0.5,
                            icon: 'sap-icon://add-photo',
                            fileType: 'jpg,png',
                            style: 'Emphasized',
                            value: '{/image}',
                            fileSizeExceed: [
                              oController.onImageFileSizeExceeded,
                              oController
                            ],
                            change: [oController.onImageChange, oController]
                          })
                        ]
                      }),
                      new VBox({
                        width: '35%',
                        items: [
                          new SimpleForm({
                            editable: false,
                            layout: 'ResponsiveGridLayout',
                            content: [
                              new Label({
                                text: '{i18n>product.form.name}',
                                required: true
                              }),
                              new Input('nameInput', {
                                value: {
                                  path: '/name',
                                  type: 'sap.ui.model.type.String'
                                },
                                liveChange: [
                                  oController.validateProductForm,
                                  oController
                                ]
                              }),
                              new Label({
                                text: '{i18n>product.form.category}',
                                labelFor: 'categoryInput',
                                required: true
                              }),
                              new Select('categoryInput', {
                                forceSelection: false,
                                selectedKey: '{/category}',
                                items: {
                                  path: 'appSettings>/productCategories',
                                  template: new Item({
                                    key: '{appSettings>key}',
                                    text: {
                                      parts: [
                                        { value: oController },
                                        { path: 'appSettings>text' }
                                      ],
                                      formatter:
                                        oController.formatter.localizeText
                                    }
                                  })
                                },
                                change: [
                                  oController.validateProductForm,
                                  oController
                                ]
                              }),
                              new Label({
                                text: '{i18n>product.form.tags}',
                                labelFor: 'tagInput'
                              }),
                              new MultiInput('tagInput', {
                                busyIndicatorDelay: 1,
                                showClearIcon: true,
                                maxTokens: 5,
                                showValueHelp: false,
                                tokens: {
                                  path: '/tags',
                                  template: new Token({
                                    key: '{tag}',
                                    text: '{tag}'
                                  })
                                },
                                change: [
                                  oController.onTagInputChange,
                                  oController
                                ],
                                tokenUpdate: [
                                  oController.onTagInputTokenUpdate,
                                  oController
                                ]
                              })
                            ]
                          })
                        ]
                      }),
                      new VBox({
                        width: '35%',
                        items: [
                          new SimpleForm({
                            editable: false,
                            layout: 'ResponsiveGridLayout',
                            content: [
                              new Label({
                                text: '{i18n>product.form.description}',
                                labelFor: 'descriptionInput'
                              }),
                              new TextArea('descriptionInput', {
                                rows: 5,
                                value: {
                                  path: '/description',
                                  type: 'sap.ui.model.type.String'
                                },
                                liveChange: [
                                  oController.validateProductForm,
                                  oController
                                ]
                              })
                            ]
                          })
                        ]
                      }),
                      new VBox({
                        width: '10%',
                        alignItems: 'End',
                        items: [
                          new Label({
                            text: '{i18n>product.form.active}',
                            labelFor: 'activeSwitch'
                          }),
                          new Switch('activeSwitch', {
                            state: {
                              path: '/enabled',
                              type: 'sap.ui.model.type.Boolean'
                            },
                            type: 'AcceptReject',
                            change: [
                              oController.validateProductForm,
                              oController
                            ]
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
                        required: true,
                        showColon: false
                      }).addStyleClass('titleLbl'),
                      new VBox('recipeStepsContainer', {
                        width: '100%',
                        items: {
                          path: '/recipe',
                          template: new Panel({
                            expandable: true,
                            expanded: true,
                            headerToolbar: new Toolbar({
                              content: [
                                new Title({
                                  text: {
                                    path: 'description',
                                    formatter: oController.formatter.toTitleCase
                                  }
                                }),
                                new ToolbarSpacer(),
                                new Button({
                                  tooltip: '{i18n>Edit}',
                                  icon: 'sap-icon://edit',
                                  type: 'Emphasized',
                                  press: [
                                    oController.onEditRecipeStepBtnPress,
                                    oController
                                  ]
                                }),
                                new Button({
                                  tooltip: '{i18n>Delete}',
                                  icon: 'sap-icon://delete',
                                  press: [
                                    oController.onDeleteRecipeStepBtnPress,
                                    oController
                                  ]
                                })
                              ]
                            }),
                            content: [
                              new Form({
                                layout: new ResponsiveGridLayout({
                                  columnsM: 2
                                }),
                                formContainers: [
                                  new FormContainer({
                                    title:
                                      '{i18n>product.form.title.ingredients}',
                                    visible: '{= ${ingredients}.length > 0}',
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
                      }),
                      new Button({
                        icon: 'sap-icon://add-activity',
                        type: 'Emphasized',
                        text: '{i18n>product.form.button.addRecipeStep.tooltip}',
                        press: [
                          oController.onAddRecipeStepBtnPress,
                          oController
                        ]
                      }).addStyleClass('sapUiTinyMarginTop')
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
