const getDecimal = (value) =>
  typeof value !== 'undefined' ? parseFloat(value.toString()) : value;

const setDecimal = (value) => {
  if (typeof value !== 'undefined') {
    let convertedValue = parseFloat(value.toString());

    return isNaN(convertedValue) ? value : convertedValue;
  } else {
    return value;
  }
};

export default {
  getDecimal,
  setDecimal
};
