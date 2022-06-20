// noinspection JSUnusedGlobalSymbols
const { Matcher } = require("uu_appg01_server").Validation;
const { ValidationResult } = require("uu_appg01_server").Validation;
const Decimal = require("decimal.js");
const DecimalNumberMatcherError = require("./decimal-number-matcher-error");

const DEFAULT_MAX_DIGIT_COUNT = 11;
const MAX_DIGITAL_COUNT_INDEX = 0;
const MAX_DECIMAL_PLACE_COUNT_INDEX = 1;

/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * @param params - Matcher can take 0 to 2 parameters with following rules:
 * - no parameters: validates that number of digits does not exceed the maximum value of 11.
 * - one parameter: the parameter specifies maximum length of number for the above rule (parameter replaces the default value of 11)
 * - two parameters:
 *   -- first parameter represents the total maximum number of digits,
 *   -- the second parameter represents the maximum number of decimal places.
 *   -- both conditions must be met in this case.
 * Implemented according to https://uuapp.plus4u.net/uu-bookkit-maing01/2590bf997d264d959b9d6a88ee1d0ff5/book/page?code=validationsReferenceDocumentation_00
 */
class DecimalNumberMatcher extends Matcher {
  constructor(...params) {
    super("doubleNumberMatcher", ...params);
  }

  processParams(...params) {
    this.maxDigitCount = params?.[MAX_DIGITAL_COUNT_INDEX] ?? DEFAULT_MAX_DIGIT_COUNT;
    this.maxDecimalPlaceCount = params?.[MAX_DECIMAL_PLACE_COUNT_INDEX];
  }

  match(value) {
    const validationResult = new ValidationResult();

    if (value == null) {
      return validationResult;
    }

    const decimal = tryToParseDecimal(value, validationResult);
    if (decimal) {
      this._validateDecimal(decimal, validationResult);
    }
    return validationResult;
  }

  _validateDecimal(number, result) {
    this._checkDigitCount(number, result);
    if (this.maxDecimalPlaceCount) {
      this._checkDecimalPlaceCount(number, result);
    }
  }

  _checkDigitCount(number, validationResult) {
    if (number.precision(true) > this.maxDigitCount) {
      addInvalidTypeError(DecimalNumberMatcherError.ExceededMaxDigits, validationResult);
    }
  }

  _checkDecimalPlaceCount(number, validationResult) {
    if (number.decimalPlaces() > this.maxDecimalPlaceCount) {
      addInvalidTypeError(DecimalNumberMatcherError.ExceededMaxPlaces, validationResult);
    }
  }
}

function tryToParseDecimal(value, validationResult) {
  try {
    return new Decimal(value);
  } catch (e) {
    addInvalidTypeError(DecimalNumberMatcherError.NotValid, validationResult);
  }
}

function addInvalidTypeError(error, validationResult) {
  validationResult.addInvalidTypeError(error.code, error.message);
}

module.exports = DecimalNumberMatcher;
