const PREFIX = "doubleNumber";

class Error {
  constructor(code, message) {
    this.code = `${PREFIX}.${code}`;
    this.message = message;
  }
}

const DecimalNumberMatcherError = Object.freeze({
  NotValid: new Error("e001", "The value is not a valid decimal number."),
  ExceededMaxDigits: new Error("e002", "The value exceeded maximum number of digits."),
  ExceededMaxPlaces: new Error("e003", "The value exceeded maximum number of decimal places.")
});

module.exports = DecimalNumberMatcherError;