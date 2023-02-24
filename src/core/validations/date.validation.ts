import { MESSAGE_PLEASE_CHECK_CONFIGURATIONS } from "../constants/message";
import { PropertyNotDateException } from "../exceptions/property-not-date.exception";
import { IPropertyDefinitionValidation } from "../interfaces/validations";

export class DateValidation {
  private input: IPropertyDefinitionValidation;

  /**
   * It Represent Class validation to Date
   * @param {IPropertyDefinitionValidation} input
   */
  constructor(input: IPropertyDefinitionValidation) {
    this.input = input;
  }

  /**
   * Check this value is instance of Date
   * @returns {boolean}
   */
  private isInstanceOfDate(): boolean {
    return this.input.value instanceof Date;
  }

  /**
   * Execute validation
   * @exception {PropertyNotDateException}
   */
  public execute() {
    if (this.input.value && !this.isInstanceOfDate()) {
      throw new PropertyNotDateException(
        `The property '${this.input.propertyName}' must to be a instance Date.${MESSAGE_PLEASE_CHECK_CONFIGURATIONS}`
      );
    }
  }
}
