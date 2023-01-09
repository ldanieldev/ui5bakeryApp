sap.ui.define(
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
  ],
  function (
    BaseController,
    JSONModel,
    MessageBox,
    MessageToast,
    Filter,
    FilterOperator
  ) {
    'use strict';

    return BaseController.extend('bakeryApp.controller.Ingredients', {
      onInit: function () {
        this.sIngredientUrl = this.getDataSources().ingredients.uri;
        this.oTable = this.byId('ingredientTable');
        this.oFormDialog = this.byId('ingredientFormDialog');
        this.oForm = this.byId('ingredientForm');
        this.oSettingsDialog = this.byId('tableSettingsDialog');

        this.getView().addEventDelegate(
          { onBeforeShow: this.onBeforeShow },
          this
        );
      },

      onBeforeShow: function () {
        this.loadListData();
      },

      loadListData: function () {
        const oModel = new JSONModel(),
          oComponent = this.oTable;

        oComponent.setBusy(true);

        this.getData(oModel, {
          url: this.sIngredientUrl,
          then: () => oComponent.setModel(oModel),
          finally: () => oComponent.setBusy(false)
        });
      },

      onSearch: function (oEvent) {
        const sQuery =
          oEvent.getParameter('query') || oEvent.getParameter('newValue');
        let aFilters = [];

        if (sQuery) {
          aFilters = [
            new Filter({
              filters: [
                new Filter('name', FilterOperator.Contains, sQuery),
                new Filter('stockCount', FilterOperator.EQ, sQuery),
                new Filter('price', FilterOperator.EQ, sQuery)
              ],
              and: false
            })
          ];
        }

        this._applySearchFilter(
          this.oTable,
          aFilters,
          'entity.ingredient.plural'
        );
      },

      showSettingDialog: function (oEvent) {
        this.oSettingsDialog.open(
          oEvent.getSource().getIcon() === 'sap-icon://filter'
            ? 'filter'
            : 'group'
        );
      },

      formatStockState: function (iStockCount, iReorderThreshold) {
        if (iStockCount <= iReorderThreshold) return 'Error';
        else if (iStockCount <= iReorderThreshold * 1.75) return 'Warning';
        else return 'Success';
      },

      formatUnit: function (sUOM, sAbbreviation, oController) {
        return sUOM && sAbbreviation
          ? `${oController.localizeText(`uom.${sUOM}`)} (${sAbbreviation})`
          : null;
      },

      formatIngredientText: function (sText, oController) {
        return oController.localizeText('uom.' + sText);
      },

      onFormBeforeOpen: function (oEvent) {
        const oDialog = oEvent.getSource(),
          sTitle =
            'dynamic.form.title.' +
            (this.formAction === 'edit' ? 'edit' : 'add');

        this.oForm
          .getContent()
          .forEach((oItem) =>
            !oItem.isA('sap.m.Label') ? oItem.setValueState('None') : null
          );

        oDialog
          .setTitle(
            this.formatter.toTitleCase(
              this.localizeText(sTitle, this.localizeText('entity.ingredient'))
            )
          )
          .getBeginButton()
          .setEnabled(false);
      },

      validateForm: function () {
        const oFormContent = this.oForm.getContent(),
          oName = oFormContent[1],
          oUom = oFormContent[7],
          oPrice = oFormContent[9],
          oSubmitBtn = this.oFormDialog.getBeginButton();

        let sName = oFormContent[1].getValue(),
          sUom = oFormContent[7].getSelectedKey(),
          fPrice = parseFloat(oFormContent[9].getValue());

        if (!sName || sName.trim().length === 0) {
          oName.setValueState('Error');
          oSubmitBtn.setEnabled(false);
          return false;
        } else {
          oName.setValueState('Success');
        }

        if (!sUom || sUom.length === 0) {
          oUom.setValueState('Error');
          oSubmitBtn.setEnabled(false);
          return false;
        } else {
          oUom.setValueState('Success');
        }

        if (isNaN(fPrice) || fPrice === Infinity || fPrice < 0) {
          oPrice.setValueState('Error');
          oSubmitBtn.setEnabled(false);
          return false;
        } else {
          oPrice.setValueState('Success');
        }

        oSubmitBtn.setEnabled(true);
        return true;
      },

      onEditBtnPress: function (oEvent) {
        const rowData = oEvent.getSource().getBindingContext().getObject();
        this.formAction = 'edit';

        this.oForm.setModel(new JSONModel({ ...rowData }));
        this.oFormDialog.open();
      },

      onAddBtnPress: function () {
        this.formAction = 'add';
        this.oForm.setModel(new JSONModel());
        this.oFormDialog.open();
      },

      onUomChange: function (oEvent) {
        this.oForm
          .getModel()
          .setProperty('/uom', oEvent.getParameters().selectedItem.data().uom);

        this.validateForm();
      },

      onFormSubmit: function (oEvent) {
        if (this.validateForm) {
          const that = this,
            oModel = new JSONModel(),
            oComponent = this.oFormDialog,
            oData = this.oForm.getModel().getProperty('/'),
            sType = this.formAction === 'edit' ? 'PUT' : 'POST',
            sUrl = `${this.sIngredientUrl}${
              this.formAction === 'edit' ? oData.id : ''
            }`;

          oComponent.setBusy(true);

          this.getData(oModel, {
            url: sUrl,
            params: {
              name: oData.name,
              stockCount: oData.stockCount,
              reorderThreshold: oData.reorderThreshold,
              uom: oData.uom,
              uomAbbreviation: oData.uomAbbreviation,
              price: oData.price
            },
            type: sType,
            then: () => {
              if (oModel.getProperty('/id')) {
                oComponent.close();
                that.loadListData();
                MessageToast.show(
                  that.localizeText(
                    'dynamic.toast.' +
                      (this.formAction === 'edit' ? 'update' : 'insert'),
                    oData.name
                  ),
                  { at: 'center center' }
                );
              }
            },
            finally: () => oComponent.setBusy(false)
          });
        }
      },

      onDeleteBtnPress: function (oEvent) {
        const that = this,
          oModel = new JSONModel(),
          oTable = this.oTable,
          oRowData = oEvent.getSource().getBindingContext().getObject();

        MessageBox.warning(
          this.localizeText(
            'dynamic.confirmDelete.text',
            this.localizeText('entity.ingredient')
          ),
          {
            title: this.localizeText(
              'dynamic.confirmDelete.title',
              oRowData.name
            ),
            actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
            onClose: (sAction) => {
              if (sAction === MessageBox.Action.YES) {
                this.getData(oModel, {
                  url: this.sIngredientUrl + oRowData.id,
                  type: 'DELETE',
                  then: () => {
                    if (oModel.getProperty('/id')) {
                      that.loadListData();
                      MessageToast.show(
                        that.localizeText(
                          'dynamic.toast.delete',
                          oRowData.name
                        ),
                        { at: 'center center' }
                      );
                    }
                  },
                  finally: () => oTable.setBusy(false)
                });
              }
            }
          }
        );
      }
    });
  }
);
