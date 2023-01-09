sap.ui.define(
  [
    'sap/m/Dialog',
    'sap/m/FlexBox',
    'sap/m/Toolbar',
    'sap/m/ToolbarSpacer',
    'sap/m/SearchField',
    'sap/m/Button',
    'sap/ui/layout/form/SimpleForm',
    'sap/m/Label',
    'sap/m/Input',
    'sap/m/TextArea',
    'sap/m/Select',
    'sap/ui/core/Item',
    'sap/m/Text',
    'sap/m/Title',
    'sap/m/Table',
    'sap/m/Menu',
    'sap/m/MenuItem',
    'sap/m/Column',
    'sap/m/ColumnListItem',
    'sap/m/ObjectNumber',
    'sap/ui/core/dnd/DragInfo',
    'sap/ui/core/dnd/DropInfo',
    'sap/ui/core/dnd/DragDropInfo'
  ],
  function (
    Dialog,
    FlexBox,
    Toolbar,
    ToolbarSpacer,
    SearchField,
    Button,
    SimpleForm,
    Label,
    Input,
    TextArea,
    Select,
    Item,
    Text,
    Title,
    Table,
    Menu,
    MenuItem,
    Column,
    ColumnListItem,
    ObjectNumber,
    DragInfo,
    DropInfo,
    DragDropInfo
  ) {
    return {
      createContent: function (oController) {
        return new Dialog({
          showHeader: false,
          contentHeight: '70%',
          contentWidth: '80%',
          content: [
            new FlexBox({
              width: '100%',
              height: '100%',
              direction: 'Column',
              items: [
                new Label({
                  required: true,
                  text: '{i18n>productWizard.recipeStep.label.stepName}:',
                  labelFor: 'recipeStepNameInput'
                }),
                new Input(this.createId('recipeStepNameInput'), {
                  width: '40%',
                  value: '{/description}'
                }).addStyleClass('sapUiSmallMarginBottom'),

                new Label({
                  required: true,
                  text: '{i18n>productWizard.recipeStep.label.stepTarget}:',
                  labelFor: 'recipeStepTypeInput'
                }),

                new FlexBox({
                  direction: 'Row',
                  width: '20%',
                  justifyContent: 'SpaceBetween',
                  items: [
                    new Input(this.createId('recipeStepTargetInput'), {
                      width: '100%',
                      value: '{/target}'
                    }),

                    new Select(this.createId('recipeStepTargetUomSelect'), {
                      width: '7rem',
                      forceSelection: false,
                      selectedKey: '{/targetUom}',
                      items: {
                        path: 'appSettings>/targetUnits',
                        template: new Item({
                          key: '{appSettings>key}',
                          text: {
                            parts: [
                              { value: oController },
                              { path: 'appSettings>text' }
                            ],
                            formatter: oController.formatter.localizeText
                          }
                        })
                      }
                    })
                  ]
                }).addStyleClass('sapUiSmallMarginBottom'),

                new Label({
                  required: true,
                  text: {
                    path: 'i18n>entity.ingredient.plural',
                    formatter: oController.formatter.toTitleCase
                  },
                  labelFor: 'recipeStepIngredientSelect'
                }),

                new FlexBox(this.createId('recipeStepIngredientSelect'), {
                  width: '100%',
                  direction: 'Row',
                  items: [
                    new Table(this.createId('availableIngredientTable'), {
                      mode: 'SingleSelectMaster',
                      busyIndicatorDelay: 1,
                      growing: true,
                      growingThreshold: 5,
                      growingScrollToLoad: false,
                      contextMenu: new Menu({
                        items: [
                          new MenuItem({
                            text: {
                              parts: [
                                'i18n>productWizard.recipeStep.moveToSelectedEntity',
                                'i18n>entity.ingredient.plural'
                              ],
                              formatter: oController.formatter.formatMessage
                            },
                            press: [
                              oController.moveToSelectedIngredientsTable,
                              oController
                            ]
                          })
                        ]
                      }),
                      headerToolbar: new Toolbar({
                        content: [
                          new Title({
                            text: {
                              parts: [
                                'i18n>dynamic.available.entity',
                                'i18n>entity.ingredient.plural'
                              ],
                              formatter: oController.formatter.formatMessage
                            }
                          }),
                          new ToolbarSpacer(),
                          new SearchField(this.createId('filterIngredient'), {
                            width: '40%',
                            search: [
                              oController.onFilterIngredients,
                              oController
                            ],
                            liveChange: [
                              oController.onFilterIngredients,
                              oController
                            ]
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
                              unit: '{uomAbbreviation}'
                            })
                          ]
                        })
                      },
                      dragDropConfig: [
                        new DragInfo({
                          groupName: 'available2selected',
                          sourceAggregation: 'items'
                        }),
                        new DropInfo({
                          groupName: 'selected2available',
                          drop: [
                            oController.onAvailableIngredientsTableDrop,
                            oController
                          ]
                        })
                      ]
                    }),

                    new FlexBox({
                      direction: 'Column',
                      justifyContent: 'Center',
                      items: [
                        new Button({
                          icon: 'sap-icon://navigation-right-arrow',
                          tooltip: 'Move to selected',
                          press: [
                            oController.moveToSelectedIngredientsTable,
                            oController
                          ]
                        }).addStyleClass('sapUiTinyMarginBottom'),
                        new Button({
                          icon: 'sap-icon://navigation-left-arrow',
                          tooltip: 'Move to available',
                          press: [
                            oController.moveToAvailableProductsTable,
                            oController
                          ]
                        })
                      ]
                    }),

                    new Table(this.createId('selectedIngredientTable'), {
                      noDataText: {
                        parts: [
                          'i18n>dynamic.dragAndDrop.noDataText',
                          'i18n>entity.ingredient.plural',
                          'i18n>entity.ingredient'
                        ],
                        formatter: oController.formatter.formatMessage
                      },
                      mode: 'SingleSelectMaster',
                      contextMenu: new Menu({
                        items: [
                          new MenuItem({
                            text: {
                              parts: [
                                'i18n>productWizard.recipeStep.removeFromSelectedEntity',
                                'i18n>entity.ingredient.plural'
                              ],
                              formatter: oController.formatter.formatMessage
                            },
                            press: [
                              oController.moveToSelectedIngredientsTable,
                              oController
                            ]
                          })
                        ]
                      }),
                      headerToolbar: new Toolbar({
                        content: [
                          new Title({
                            text: {
                              parts: [
                                'i18n>dynamic.selected.entity',
                                'i18n>entity.ingredient.plural'
                              ],
                              formatter: oController.formatter.formatMessage
                            }
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
                            text: '{i18n>productWizard.recipeStep.columnHeading.amount}'
                          })
                        }),
                        new Column({
                          header: new Text({
                            text: '{i18n>generic.label.uom}'
                          })
                        })
                      ],
                      items: {
                        path: '/ingredients/',
                        sorter: {
                          path: 'name',
                          descending: true
                        },
                        template: new ColumnListItem({
                          vAlign: 'Middle',
                          cells: [
                            new Text({ text: '{name}' }),
                            new Input({
                              type: 'Number',
                              value: {
                                path: 'amount',
                                type: 'sap.ui.model.type.Float'
                              },
                              liveChange: [
                                oController.validateSelectedIngredientsAmount,
                                oController
                              ]
                            }),
                            new Text({
                              text: '{uomAbbreviation}'
                            })
                          ]
                        })
                      },
                      dragDropConfig: [
                        new DragInfo({
                          groupName: 'selected2available',
                          sourceAggregation: 'items'
                        }),
                        new DropInfo({
                          groupName: 'available2selected',
                          targetAggregation: 'items',
                          dropPosition: 'Between',
                          drop: [
                            oController.onSelectedIngredientsTableDrop,
                            oController
                          ]
                        }),
                        new DragDropInfo({
                          sourceAggregation: 'items',
                          targetAggregation: 'items',
                          dropPosition: 'Between',
                          drop: [
                            oController.onSelectedIngredientsTableDrop,
                            oController
                          ]
                        })
                      ]
                    })
                  ]
                }).addStyleClass('sapUiSmallMarginBottom'),

                new Label({
                  required: true,
                  text: '{i18n>productWizard.recipeStep.label.intructions}:',
                  labelFor: 'recipeStepNameInput'
                }),

                new SimpleForm(this.createId('instructionForm'), {
                  width: '90%',
                  layout: 'ResponsiveGridLayout',
                  content: [
                    new Label({
                      required: true,
                      text: '1'
                    }),
                    new TextArea({
                      value: '{/instructions/0/}'
                    })
                  ]
                }),

                new FlexBox({
                  width: '100%',
                  direction: 'Row',
                  justifyContent: 'SpaceBetween',
                  items: [
                    new Button({
                      icon: 'sap-icon://add',
                      type: 'Accept',
                      press: [
                        oController.onAddInstructionBtnPress,
                        oController
                      ],
                      tooltip:
                        '{i18n>productWizard.recipeStep.button.addInstruction.tooltip}'
                    }).addStyleClass('sapUiSmallMarginRight'),
                    new Button({
                      icon: 'sap-icon://less',
                      type: 'Reject',
                      press: [
                        oController.onRemoveLastInstructionBtnPress,
                        oController
                      ],
                      tooltip:
                        '{i18n>productWizard.recipeStep.button.removeInstruction.tooltip}'
                    })
                  ]
                })
              ]
            })
          ],
          buttons: [
            new Button({
              text: '{i18n>Submit}',
              enabled: false,
              type: 'Emphasized',
              press: [oController.onNewRecipeStepSubmitBtnPress, oController]
            }),
            new Button({
              text: '{i18n>Cancel}',
              press: [oController.onDialogCloseBtnPress, oController]
            })
          ]
        }).addStyleClass('sapUiResponsiveContentPadding');
      }
    };
  }
);
