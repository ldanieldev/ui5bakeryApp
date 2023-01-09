sap.ui.define(
  [
    'sap/ui/core/mvc/View',
    'sap/m/MessageBox',
    'sap/m/Page',
    'sap/m/Button',
    'sap/m/Title',
    'sap/m/Text',
    'sap/m/Toolbar',
    'sap/m/ToolbarSpacer',
    'sap/m/Label',
    'sap/m/Panel',
    'sap/m/FlexBox',
    'sap/m/FlexItemData',
    'sap/m/Select',
    'sap/ui/core/Item',
    'sap/m/DateRangeSelection',
    'sap/m/GenericTile',
    'sap/m/TileContent',
    'sap/m/NumericContent'
  ],
  function (
    View,
    MessageBox,
    Page,
    Button,
    Title,
    Text,
    Toolbar,
    ToolbarSpacer,
    Label,
    Panel,
    FlexBox,
    FlexItemData,
    Select,
    Item,
    DateRangeSelection,
    GenericTile,
    TileContent,
    NumericContent
  ) {
    'use strict';
    return View.extend('bakeryApp.view.Home', {
      async: true,

      getAutoPrefixId: function () {
        return true;
      },

      getControllerName: function () {
        return 'bakeryApp.controller.Home';
      },

      createContent: async function (oController) {
        try {
          return await new Promise(function (res, rej) {
            res(
              new Page('homePage', {
                busyIndicatorDelay: 1,
                showFooter: false,
                showHeader: true,
                customHeader: new Toolbar('homepageHeaderBar', {
                  design: 'Transparent',
                  content: [
                    new Label({ text: 'Filter Applied:' }),
                    new Select({
                      selectedKey: 'TDY',
                      items: [
                        new Item({ text: 'Shift', key: 'SHFT' }),
                        new Item({ text: 'Today', key: 'TDY' }),
                        new Item({ text: 'Week', key: 'WK' }),
                        new Item({ text: 'Month', key: 'MTH' }),
                        new Item({ text: 'Custom', key: 'CUS' })
                      ],
                      change: [oController.onOverviewFilterChange, oController]
                    }).addStyleClass('noBorderSelect'),

                    new DateRangeSelection('overviewDtRangeSelect', {
                      visible: false,
                      width: '12%'
                    }).addStyleClass('noBorderSelect'),

                    new ToolbarSpacer(),

                    new Label({ text: 'Last Updated:' }),
                    new Text('pageLastUpdatedText', { text: '' }),
                    new Button({
                      icon: 'sap-icon://synchronize',
                      press: [oController.loadDashboardData, oController]
                    })
                  ]
                }).addStyleClass('removeBorder'),
                content: [
                  new Panel('plantPerformancePanel', {
                    expand: [oController.onPanelExpand, oController],
                    expanded: true,
                    expandable: true,
                    //height: '25%',
                    width: '100%',
                    headerText: 'Performance Overview',
                    content: [
                      new FlexBox('oeeRadialsContainer', {
                        direction: 'Row',
                        height: '100%',
                        width: '100%',
                        items: [
                          new FlexBox({
                            fitContainer: true,
                            direction: 'Column',
                            justifyContent: 'Center',
                            alignItems: 'Center',
                            items: [
                              new Title({
                                text: 'Availablility',
                                level: 'H1'
                              })
                            ],
                            layoutData: new FlexItemData({
                              growFactor: 1
                            })
                          }),
                          new FlexBox({
                            fitContainer: true,
                            direction: 'Column',
                            justifyContent: 'Center',
                            alignItems: 'Center',
                            items: [
                              new Title({
                                text: 'Performance',
                                level: 'H1'
                              })
                            ],
                            layoutData: new FlexItemData({
                              growFactor: 1
                            })
                          }),
                          new FlexBox({
                            fitContainer: true,
                            direction: 'Column',
                            justifyContent: 'Center',
                            alignItems: 'Center',
                            items: [
                              new Title({ text: 'Quality', level: 'H1' }),
                              new RadialMicroChart({
                                busyIndicatorDelay: 1,
                                height: '100%',
                                percentage: 99,
                                alignContent: 'Center',
                                valueColor: 'Good',
                                layoutData: new FlexItemData({
                                  growFactor: 2
                                })
                              })
                            ],
                            layoutData: new FlexItemData({
                              growFactor: 1
                            })
                          }),
                          new FlexBox({
                            fitContainer: true,
                            direction: 'Column',
                            justifyContent: 'Center',
                            alignItems: 'Center',
                            items: [
                              new Title({
                                text: 'OEE',
                                level: 'H1',
                                layoutData: new FlexItemData({
                                  growFactor: 1
                                })
                              }),
                              new RadialMicroChart({
                                busyIndicatorDelay: 1,
                                height: '100%',
                                percentage: 85,
                                alignContent: 'Center',
                                valueColor: 'Good',
                                layoutData: new FlexItemData({
                                  growFactor: 2
                                })
                              })
                            ],
                            layoutData: new FlexItemData({
                              growFactor: 1
                            })
                          })
                        ]
                      })
                    ]
                  }),
                  new Panel('orderOverviewPanel', {
                    //height: '30%',
                    expand: [oController.onPanelExpand, oController],
                    width: '100%',
                    expandable: true,
                    expanded: true,
                    headerToolbar: new Toolbar({
                      content: [
                        new Title({ text: 'Order Overview' }),
                        new ToolbarSpacer(),
                        new Button({
                          text: 'View Orders',
                          type: 'Transparent',
                          press: [oController.onViewOrdersBtnPress, oController]
                        })
                      ]
                    }),
                    content: [
                      new FlexBox('overviewTileContainer', {
                        width: '100%',
                        height: '100%',
                        direction: 'Row',
                        wrap: 'Wrap',
                        justifyContent: 'SpaceAround',
                        items: {
                          path: '/',
                          template: new GenericTile({
                            header: '{header}',
                            subheader: '{subHeader}',
                            busyIndicatorDelay: 1,
                            tileContent: new TileContent({
                              unit: '{unit}',
                              footer: '{footer}',
                              content: new NumericContent({
                                scale: '{scale}',
                                value: '{value}',
                                icon: '{icon}',
                                withMargin: true
                              })
                            })
                          })
                        }
                      })
                    ]
                  }),
                  new Panel('vizViewPanel', {
                    expand: [oController.onPanelExpand, oController],
                    width: '100%',
                    expandable: true,
                    expanded: true,
                    headerText: 'Viz Overview',
                    content: [
                      new FlexBox({
                        width: '100%',
                        height: '100%',
                        direction: 'Row',
                        wrap: 'Wrap',
                        justifyContent: 'SpaceAround',
                        items: []
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
