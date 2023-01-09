sap.ui.define(
  [
    './BaseController',
    '../model/Formatter',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox'
  ],
  function (BaseController, Formatter, JSONModel, MessageBox) {
    return BaseController.extend('bakeryApp.controller.App', {
      formatter: Formatter,

      urlUserSelect: 'https://fakerapi.it/api/v1/users',

      onInit: function () {
        this.getRouter().attachRoutePatternMatched(
          this.onRoutePatternMatched,
          this
        );

        this.getUserDetails();
        this.setAppTheme(null);
      },

      onExit: function () {
        this.getRouter().detachRoutePatternMatched(
          this.onRoutePatternMatched,
          this
        );
      },

      onNavigate: function (oEvent) {
        oEvent.getSource().setBusy(true);
        this.byId('headerBackBtn').setVisible(
          oEvent.getParameters().toId.split('---')[1] !== 'homeView'
        );
      },

      onAfterNavigate: function (oEvent) {
        // const sTitle = oEvent.getParameter('to');
        // this.byId('appHeaderTitle').setText(sTitle);
        oEvent.getSource().setBusy(false);
      },

      onNavHomeBtnPress: function () {
        this.getRouter().navTo('home');
        this.byId('navSwitcher').setSelectedItem(null);
      },

      setAppTheme: function (oEvent) {
        const sKey = oEvent ? oEvent.getSource().getKey() : 'auto',
          sLightTheme = 'sap_horizon',
          sDarkTheme = 'sap_horizon_dark';

        let sTheme;

        switch (sKey) {
          case 'auto':
            if (
              window.matchMedia &&
              window.matchMedia('(prefers-color-scheme: dark)').matches
            ) {
              sTheme = sDarkTheme;
            } else {
              sTheme = sLightTheme;
            }
            break;
          case 'light':
            sTheme = sLightTheme;
            break;
          case 'dark':
          default:
            sTheme = sDarkTheme;
            break;
        }

        this.byId('appearanceSubMenu')
          .getItems()
          .forEach((oMenuItem) =>
            oMenuItem.setIcon(
              oMenuItem.getKey() === sKey ? 'sap-icon://accept' : ''
            )
          );

        sap.ui.getCore().applyTheme(sTheme);
      },

      getUserDetails: function () {
        const oModel = new JSONModel(),
          oUserMenuBtn = this.byId('userMenuBtn');

        oUserMenuBtn.setBusy(true);

        oModel
          .loadData(this.urlUserSelect, { _quantity: 1 })
          .catch((oError) =>
            MessageBox.error(oError.statusText, {
              title: 'User Error'
            })
          )
          .then(() => {
            let data = oModel.getProperty('/data/0');
            if (data) {
              this.setModel(new JSONModel(data), 'userModel');
              oUserMenuBtn
                .setText(`${data.firstname} ${data.lastname}`)
                .setIcon(data.image);
            } else {
              MessageBox.error('Invalid User Data');
            }
          })
          .finally(() => {
            oUserMenuBtn.setBusy(false);
          });
      },

      onAboutMenuItemPress: function () {
        const oDialog = this.byId('aboutDialog'),
          oForm = oDialog.getContent()[1];

        this.getView().addDependent(oDialog);

        oForm.setModel(
          new JSONModel(
            bakeryApp.Component.getMetadata().getManifest()['sap.app']
          )
        );

        oDialog.open();
      },

      onLogoutBtnPress: function (oEvent) {
        const oDialog = this.byId('logoutDialog');
        this.getView().addDependent(oDialog);
        oDialog.open();
      },

      onLogoutConfirmBtnPress: function (oEvent) {
        window.location.reload();
      },

      onShowNavListPress: function (oEvent) {
        const oPopover = this.byId('navPopover');
        this.getView().addDependent(oPopover);
        oPopover.openBy(oEvent.getSource());
      },

      onNavItemSelect: function (oEvent) {
        this.getRouter().navTo(
          oEvent.getParameters().itemPressed.getTargetSrc()
        );
        oEvent.getSource().setSelectedItem(null);
      }
    });
  }
);
