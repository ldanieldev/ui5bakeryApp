sap.ui.define(
  [
    'sap/m/Dialog',
    'sap/m/FlexBox',
    'sap/m/Toolbar',
    'sap/m/ToolbarSpacer',
    'sap/m/SearchField',
    'sap/m/Button',
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
    'sap/ui/core/dnd/DragDropInfo',
    'sap/m/List',
    'sap/m/CustomListItem',
    'sap/m/FlexItemData'
  ],
  function (
    Dialog,
    FlexBox,
    Toolbar,
    ToolbarSpacer,
    SearchField,
    Button,
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
    DragDropInfo,
    List,
    CustomListItem,
    FlexItemData
  ) {
    return {
      createContent: function (oController) {
        return new Dialog({
          showHeader: true,
          contentWidth: '60%',
          content: [
            new FlexBox({
              width: '100%',
              height: '100%',
              direction: 'Column',
              items: [
                new Label({
                  required: true,
                  text: '{i18n>recipeStepDialog.label.stepName}:',
                  labelFor: 'recipeStepNameInput'
                }),
                new Input(this.createId('nameInput'), {
                  width: '40%',

                  value: '{/description}',
                  liveChange: [oController.validateRecipeStepForm, oController]
                }).addStyleClass('sapUiSmallMarginBottom'),

                new Label({
                  required: false,
                  text: {
                    path: 'i18n>entity.ingredient.plural',
                    formatter: oController.formatter.toTitleCase
                  },
                  labelFor: 'selectedIngredientTable'
                }),

                new FlexBox(this.createId('ingredientSelectContainer'), {
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
                                'i18n>recipeStepDialog.moveToSelectedEntity',
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
                                'i18n>recipeStepDialog.removeFromSelectedEntity',
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
                            text: '{i18n>recipeStepDialog.columnHeading.amount}'
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
                                oController.validateRecipeStepForm,
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
                  text: '{i18n>recipeStepDialog.label.intructions}:',
                  labelFor: 'instructionList'
                }).addStyleClass('sapUiSmallMarginBottom'),

                new List(this.createId('instructionList'), {
                  busyIndicatorDelay: 1,
                  items: {
                    path: '/instructions',
                    template: new CustomListItem({
                      content: [
                        new FlexBox({
                          direction: 'Row',
                          justifyContent: 'SpaceBetween',
                          alignItems: 'Center',
                          width: '100%',
                          items: [
                            new Label({ text: '{order}:' }),
                            new TextArea({
                              width: '100%',
                              layoutData: new FlexItemData({ minWidth: '90%' }),
                              value: '{instruction}',
                              liveChange: [
                                oController.validateRecipeStepForm,
                                oController
                              ]
                            }),
                            new Button({
                              icon: 'sap-icon://decline',
                              type: 'Transparent',
                              enabled: {
                                path: 'order',
                                formatter:
                                  oController.formatRemoveInstructionEnabled
                              },
                              press: [
                                oController.onRemoveInstructionBtnPress,
                                oController
                              ],
                              tooltip:
                                '{i18n>recipeStepDialog.button.removeInstruction.tooltip}'
                            })
                          ]
                        })
                      ]
                    }).addStyleClass('sapUiSmallMarginBottom')
                  }
                }),

                new Button({
                  icon: 'sap-icon://add',
                  type: 'Emphasized',
                  press: [oController.onAddInstructionBtnPress, oController],
                  tooltip:
                    '{i18n>recipeStepDialog.button.addInstruction.tooltip}'
                })
              ]
            })
          ],
          buttons: [
            new Button(this.createId('submitBtn'), {
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
