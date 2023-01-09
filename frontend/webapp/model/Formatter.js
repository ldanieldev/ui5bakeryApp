sap.ui.define(
  ['sap/base/strings/formatMessage', 'sap/ui/core/format/NumberFormat'],
  function (formatMessage, NumberFormat) {
    'use strict';
    return {
      formatMessage: formatMessage,

      toUpperCase: function (sString) {
        return sString && typeof sString === 'string'
          ? sString.toUpperCase()
          : sString;
      },

      toLowerCase: function (sString) {
        return sString && typeof sString === 'string'
          ? sString.toLowerCase()
          : sString;
      },

      toTitleCase: function (sString) {
        return sString && typeof sString === 'string'
          ? sString
              .toLowerCase()
              .split(' ')
              .map((word) => word.replace(word[0], word[0].toUpperCase()))
              .join(' ')
          : sString;
      },

      localizeText: (oController, sKey) => oController.localizeText(sKey)
    };
  }
);
