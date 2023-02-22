import { MESSAGE_MISSING_PROPERTY_SETTINGS } from "../../constants/message-error";
import { PropertyNotDateException } from "../exceptions/property-not-date.exception";
import { IInputValidation } from "../../interfaces/validations";

export class DatePropertyValidation {
  private input: IInputValidation;

  constructor(input: IInputValidation) {
    this.input = input;
  }

  private isInstanceOfDate() {
    return this.input.value instanceof Date;
  }

  public execute() {
    if (this.input.value && !this.isInstanceOfDate()) {
      throw new PropertyNotDateException(
        `The property '${this.input.propertyName}' must to be a instance Date.${MESSAGE_MISSING_PROPERTY_SETTINGS}`
      );
    }
  }
}
