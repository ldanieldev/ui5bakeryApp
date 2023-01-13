sap.ui.define(
  [
    'sap/ui/core/mvc/View',
    'sap/m/Page',
    'sap/f/GridList',
    'sap/f/GridListItem',
    'sap/ui/layout/cssgrid/GridBasicLayout',
    'sap/m/FlexBox',
    'sap/m/FlexItemData',
    'sap/m/Title',
    'sap/m/ExpandableText',
    'sap/m/Image',
    'sap/m/Toolbar',
    'sap/m/ToolbarSpacer',
    'sap/m/SearchField',
    'sap/m/Button',
    'sap/m/MessageBox',
    'sap/m/Dialog',
    'sap/m/Wizard',
    'sap/m/WizardStep',
    'sap/ui/layout/form/SimpleForm',
    'sap/m/Label',
    'sap/m/Input',
    'sap/m/TextArea',
    'sap/m/Select',
    'sap/ui/core/Item',
    'sap/m/Switch',
    'sap/ui/unified/FileUploader',
    'sap/m/MultiInput',
    'sap/m/Token'
  ],
  function (
    View,
    Page,
    GridList,
    GridListItem,
    GridBasicLayout,
    FlexBox,
    FlexItemData,
    Title,
    ExpandableText,
    Image,
    Toolbar,
    ToolbarSpacer,
    SearchField,
    Button,
    MessageBox,
    Dialog,
    Wizard,
    WizardStep,
    SimpleForm,
    Label,
    Input,
    TextArea,
    Select,
    Item,
    Switch,
    FileUploader,
    MultiInput,
    Token
  ) {
    'use strict';
    return View.extend('bakeryApp.view.Productss', {
      async: true,

      getAutoPrefixId: function () {
        return true;
      },

      getControllerName: function () {
        return 'bakeryApp.controller.Productss';
      },

      createContent: async function (oController) {
        try {
          return await new Promise(function (res, rej) {
            res(
              new Page({
                showHeader: false,
                content: [
                  new Dialog('productDialog', {
                    showHeader: false,
                    verticalScrolling: false,
                    contentHeight: '70%',
                    contentWidth: '95%',
                    content: [
                      new Wizard('productWizard', {
                        width: '100%',
                        height: '100%',
                        showNextButton: false,
                        renderMode: 'Page',
                        navigationChange: [
                          oController.onWizardNavigationChange,
                          oController
                        ],
                        steps: [
                          new WizardStep('productDetailStep', {
                            icon: 'sap-icon://product',
                            title:
                              '{i18n>productWizard.stepTitle.productDetails}',
                            content: [
                              new SimpleForm({
                                width: '100%',
                                layout: 'ColumnLayout',
                                content: [
                                  new Label({
                                    text: '{i18n>productWizard.form.active}',
                                    labelFor: 'activeSwitch'
                                  }),
                                  new Switch('activeSwitch', {
                                    state: {
                                      path: '/enabled',
                                      type: 'sap.ui.model.type.Boolean'
                                    },
                                    type: 'AcceptReject'
                                  }),
                                  new Label({
                                    required: true,
                                    text: '{i18n>productWizard.form.name}',
                                    labelFor: 'nameInput'
                                  }),
                                  new Input('nameInput', {
                                    value: {
                                      path: '/name',
                                      type: 'sap.ui.model.type.String'
                                    },
                                    liveChange: [
                                      oController.validateProductDetailForm,
                                      oController
                                    ]
                                  }),
                                  new Label({
                                    text: '{i18n>productWizard.form.description}',
                                    labelFor: 'descriptionInput'
                                  }),
                                  new TextArea('descriptionInput', {
                                    rows: 5,
                                    value: {
                                      path: '/description',
                                      type: 'sap.ui.model.type.String'
                                    }
                                  }),
                                  new Label({
                                    required: true,
                                    text: '{i18n>productWizard.form.category}',
                                    labelFor: 'categoryInput'
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
                                    }
                                  }),
                                  new Label({
                                    text: '{i18n>productWizard.form.image}',
                                    labelFor: 'imageInput'
                                  }),
                                  new FileUploader('imageInput', {
                                    width: '60%',
                                    fileType: 'jpg,png',
                                    style: 'Emphasized',
                                    value: {
                                      path: '/imagePath',
                                      type: 'sap.ui.model.type.String'
                                    },
                                    change: [
                                      oController.onImageChange,
                                      oController
                                    ]
                                  }),
                                  new Label({
                                    text: '{i18n>productWizard.form.tags}',
                                    labelFor: 'tagInput'
                                  }),
                                  new MultiInput('tagInput', {
                                    busyIndicatorDelay: 1,
                                    showClearIcon: true,
                                    showValueHelp: false,
                                    tokens: {
                                      path: '/tags/',
                                      template: new Token({
                                        key: '{key}',
                                        text: '{text}'
                                      })
                                    },
                                    tokenUpdate: [
                                      oController.onTagInputTokenUpdate,
                                      oController
                                    ]
                                  })
                                ]
                              })
                            ]
                          }),
                          new WizardStep('recipeDetailStep', {
                            icon: 'sap-icon://form',
                            title:
                              '{i18n>productWizard.stepTitle.recipeDetails}',
                            content: [
                              new FlexBox({
                                width: '100%',
                                height: '100%',
                                direction: 'Row',
                                alignItems: 'Center',
                                justifyContent: 'Start',
                                items: [
                                  new FlexBox({
                                    width: '100%',
                                    height: '100%',
                                    direction: 'Column',
                                    items: [
                                      new Button({
                                        width: '2%',
                                        type: 'Emphasized',
                                        icon: 'sap-icon://create-form',
                                        press: [
                                          oController.onAddRecipeStepBtnPress,
                                          oController
                                        ],
                                        tooltip:
                                          '{i18n>productWizard.button.addRecipeStep.tooltip}'
                                      }).addStyleClass('tallBtn')
                                    ]
                                  })
                                ]
                              })
                            ]
                          }),
                          new WizardStep('reviewPage', {
                            icon: 'sap-icon://detail-view',
                            title: '{i18n>generic.wizard.stepTitle.reviewPage}',
                            content: []
                          })
                        ]
                      })
                    ],
                    buttons: [
                      new Button({
                        text: '{i18n>Previous}',
                        visible: false,
                        press: [
                          oController.onWizardBackButtonPress,
                          oController
                        ]
                      }),
                      new Button({
                        text: '{i18n>NextStep}',
                        type: 'Emphasized',
                        visible: false,
                        press: [
                          oController.onWizardNextButtonPress,
                          oController
                        ]
                      }),
                      new Button({
                        text: '{i18n>Review}',
                        type: 'Emphasized',
                        visible: false,
                        press: [
                          oController.onWizardNextButtonPress,
                          oController
                        ]
                      }),
                      new Button({
                        text: '{i18n>Finish}',
                        type: 'Emphasized',
                        visible: false,
                        press: [oController.onWizardSubmitPress, oController]
                      }),
                      new Button({
                        text: '{i18n>Cancel}',
                        type: 'Transparent',
                        press: [oController.onWizardCancelPress, oController]
                      })
                    ]
                  }),

                  new GridList('productList', {
                    headerToolbar: new Toolbar({
                      content: [
                        new SearchField('searchField', {
                          showRefreshButton: false,
                          width: '15%',
                          search: [oController.onFilterProducts, oController],
                          liveChange: [
                            oController.onFilterProducts,
                            oController
                          ]
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
                    }).addStyleClass('bgTransparent'),
                    busyIndicatorDelay: 0,
                    noDataText: {
                      parts: [
                        'i18n>dynamic.noDataText',
                        'i18n>entity.product.plural'
                      ],
                      formatter: oController.formatter.formatMessage
                    },
                    width: '98%',
                    mode: 'None',
                    customLayout: new GridBasicLayout({
                      gridAutoFlow: 'Row',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(35rem, 1fr))',
                      gridRowGap: '0',
                      gridColumnGap: '1%'
                    }),
                    items: {
                      path: '/',
                      template: new GridListItem({
                        content: [
                          new FlexBox({
                            direction: 'Column',
                            justifyContent: 'SpaceBetween',
                            items: [
                              new FlexBox({
                                direction: 'Row',
                                height: '100%',
                                width: '100%',
                                items: [
                                  new Image({
                                    src: '{image}',
                                    height: '6rem'
                                  }).addStyleClass('sapUiTinyMargin'),
                                  new FlexBox({
                                    direction: 'Column',
                                    height: '100%',
                                    width: '100%',
                                    alignItems: 'Center',
                                    items: [
                                      new Title({
                                        text: '{name}',
                                        wrapping: true
                                      }).addStyleClass(
                                        'sapUiTinyMarginTopBottom'
                                      ),
                                      new ExpandableText({
                                        text: '{description}',
                                        maxCharacters: 225,
                                        overflowMode: 'Popover',
                                        layoutData: new FlexItemData({
                                          minWidth: '100%'
                                        })
                                      }).addStyleClass('sapUiSmallMarginBottom')
                                    ]
                                  })
                                ]
                              }),
                              new Toolbar({
                                design: 'Solid',
                                content: [
                                  new ToolbarSpacer(),
                                  new Button({
                                    icon: 'sap-icon://edit',
                                    type: 'Transparent',
                                    tooltip: {
                                      parts: [
                                        'i18n>dynamic.button.edit.tooltip',
                                        'i18n>entity.product'
                                      ],
                                      formatter:
                                        oController.formatter.formatMessage
                                    },
                                    press: [
                                      oController.onEditBtnPress,
                                      oController
                                    ]
                                  }),
                                  new Button({
                                    icon: 'sap-icon://delete',
                                    type: 'Transparent',
                                    press: [
                                      oController.onDeleteBtnPress,
                                      oController
                                    ]
                                  })
                                ]
                              })
                            ]
                          })
                        ]
                      }).addStyleClass('sapUiSmallMarginTop')
                    }
                  }).addStyleClass('alignCenter')
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
