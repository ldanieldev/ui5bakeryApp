sap.ui.define(
  [
    'sap/ui/core/mvc/View',
    'sap/m/Shell',
    'sap/m/App',
    'sap/tnt/ToolPage',
    'sap/tnt/ToolHeader',
    'sap/m/NavContainer',
    'sap/m/ToolbarSpacer',
    'sap/f/ProductSwitch',
    'sap/f/ProductSwitchItem',
    'sap/m/Dialog',
    'sap/m/Button',
    'sap/m/MenuButton',
    'sap/m/Menu',
    'sap/m/MenuItem',
    'sap/m/Text',
    'sap/m/Label',
    'sap/m/Title',
    'sap/m/Image',
    'sap/m/MessageBox',
    'sap/m/ResponsivePopover',
    'sap/ui/layout/form/SimpleForm'
  ],
  function (
    View,
    Shell,
    App,
    ToolPage,
    ToolHeader,
    NavContainer,
    ToolbarSpacer,
    ProductSwitch,
    ProductSwitchItem,
    Dialog,
    Button,
    MenuButton,
    Menu,
    MenuItem,
    Text,
    Label,
    Title,
    Image,
    MessageBox,
    ResponsivePopover,
    SimpleForm
  ) {
    return View.extend('bakeryApp.view.App', {
      async: true,

      getControllerName: function () {
        return 'bakeryApp.controller.App';
      },

      getAutoPrefixId: function () {
        return true;
      },

      createContent: async function (oController) {
        new Dialog('aboutDialog', {
          icon: 'sap-icon://hint',
          title: '{i18n>About}',
          contentWidth: '10%',
          content: [
            new Image({
              src: 'images/logo.png',
              height: '8rem',
              lazyLoading: true
            }).addStyleClass('alignCenter uiDisplayBlock'),
            new SimpleForm({
              editable: false,
              content: [
                new Label({
                  required: false,
                  text: '{i18n>aboutDialog.name}'
                }),
                new Text({
                  text: '{/title}'
                }),
                new Label({
                  required: false,
                  text: '{i18n>aboutDialog.description}'
                }),

                new Text({
                  text: '{/description}'
                }),
                new Label({
                  required: false,
                  text: '{i18n>aboutDialog.author}'
                }),
                new Text({
                  text: '{/authors}'
                }),
                new Label({
                  required: false,
                  text: '{i18n>aboutDialog.version}'
                }),
                new Text({
                  text: '{/applicationVersion/version}'
                }),
                new Label({
                  required: false,
                  text: '{i18n>aboutDialog.SAPUI5}'
                }),
                new Text({
                  text: `${sap.ui.getVersionInfo().version} (${
                    sap.ui.getVersionInfo().buildTimestamp
                  })`
                }),
                new Label({
                  required: false,
                  text: '{i18n>aboutDialog.userAgent}'
                }),
                new Text({
                  text: navigator.userAgent
                })
              ]
            })
          ],
          beginButton: new Button({
            text: '{i18n>OK}',
            press: oController.onDialogCloseBtnPress
          })
        });

        new Dialog('logoutDialog', {
          icon: 'sap-icon://message-warning',
          title: '{i18n>logoutDialog.title}',
          type: 'Message',
          state: 'Warning',
          content: new Text({
            text: '{i18n>logoutDialog.text}'
          }),
          beginButton: new Button({
            type: 'Accept',
            icon: 'sap-icon://accept',
            text: '{i18n>Yes}',
            press: [oController.onLogoutConfirmBtnPress, oController]
          }),
          endButton: new Button({
            type: 'Reject',
            icon: 'sap-icon://decline',
            text: '{i18n>No}',
            press: [oController.onDialogCloseBtnPress, oController]
          })
        });

        new ResponsivePopover('navPopover', {
          placement: 'Bottom',
          title: '{i18n>app.header.navPopup.title}',
          titleAlignment: 'Center',
          content: [
            new ProductSwitch('navSwitcher', {
              change: [oController.onNavItemSelect, oController],
              items: [
                new ProductSwitchItem({
                  src: 'sap-icon://lab',
                  title: '{i18n>nav.products.title}',
                  subTitle: '{i18n>nav.products.subTitle}',
                  targetSrc: 'products'
                }),
                new ProductSwitchItem({
                  src: 'sap-icon://nutrition-activity',
                  title: '{i18n>nav.ingredients.title}',
                  subTitle: '{i18n>nav.ingredients.subTitle}',
                  targetSrc: 'ingredients'
                })
              ]
            })
          ]
        });

        try {
          return await new Promise(function (res, rej) {
            res(
              new Shell({
                appWidthLimited: false,
                app: new App('app', {
                  busyIndicatorDelay: 0,
                  pages: [
                    new ToolPage('rootPage', {
                      header: [
                        new ToolHeader({
                          busyIndicatorDelay: 1,
                          content: [
                            new Button({
                              text: '',
                              icon: 'sap-icon://grid',
                              press: [
                                oController.onShowNavListPress,
                                oController
                              ]
                            }),
                            new Button('headerBackBtn', {
                              text: '',
                              visible: false,
                              icon: 'sap-icon://nav-back',
                              press: [
                                oController.onNavBackBtnPress,
                                oController
                              ]
                            }),
                            new Button({
                              text: '',
                              icon: 'sap-icon://home',
                              press: [
                                oController.onNavHomeBtnPress,
                                oController
                              ]
                            }),
                            new ToolbarSpacer(),
                            new Title('appHeaderTitle', {
                              text: '{i18n>app.header.title}'
                            }),
                            new ToolbarSpacer(),

                            new MenuButton('userMenuBtn', {
                              busyIndicatorDelay: 1,
                              icon: 'sap-icon://employee',
                              menu: new Menu({
                                items: [
                                  new MenuItem({
                                    text: 'My Profile',
                                    icon: 'sap-icon://employee'
                                  }),
                                  new MenuItem({
                                    text: 'Logout',
                                    icon: 'sap-icon://log',
                                    press: [
                                      oController.onLogoutBtnPress,
                                      oController
                                    ]
                                  })
                                ]
                              })
                            }),
                            new MenuButton('appSettingsMenuBtn', {
                              busyIndicatorDelay: 1,
                              icon: 'sap-icon://action-settings',
                              menu: new Menu({
                                items: [
                                  new MenuItem({
                                    text: '{i18n>app.header.settings.about}',
                                    icon: 'sap-icon://information',
                                    press: [
                                      oController.onAboutMenuItemPress,
                                      oController
                                    ]
                                  }),
                                  new MenuItem('appearanceSubMenu', {
                                    text: '{i18n>app.header.settings.appearance.title}',
                                    icon: 'sap-icon://palette',
                                    items: [
                                      new MenuItem({
                                        text: '{i18n>app.header.settings.appearance.auto}',
                                        key: 'auto',
                                        icon: 'sap-icon://accept',
                                        press: [
                                          oController.setAppTheme,
                                          oController
                                        ]
                                      }),
                                      new MenuItem({
                                        text: '{i18n>app.header.settings.appearance.dark}',
                                        key: 'dark',
                                        press: [
                                          oController.setAppTheme,
                                          oController
                                        ]
                                      }),
                                      new MenuItem({
                                        text: '{i18n>app.header.settings.appearance.light}',
                                        key: 'light',
                                        press: [
                                          oController.setAppTheme,
                                          oController
                                        ]
                                      })
                                    ]
                                  })
                                ]
                              })
                            })
                          ]
                        })
                      ],
                      mainContents: [
                        new NavContainer('rootNavContainer', {
                          busyIndicatorDelay: 1,
                          navigate: [oController.onNavigate, oController],
                          afterNavigate: [
                            oController.onAfterNavigate,
                            oController
                          ]
                        })
                      ]
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
