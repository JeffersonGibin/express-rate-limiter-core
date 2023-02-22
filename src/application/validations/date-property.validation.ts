import { MESSAGE_PLEASE_CHECK_CONFIGURATIONS } from "../../constants/message";
import { PropertyNotDateException } from "../exceptions/property-not-date.exception";
import { IPropertyDefinitionValidation } from "../../interfaces/validations";

export class DatePropertyValidation {
  private input: IPropertyDefinitionValidation;

  constructor(input: IPropertyDefinitionValidation) {
    this.input = input;
  }

  private isInstanceOfDate() {
    return this.input.value instanceof Date;
  }

  public execute() {
    if (this.input.value && !this.isInstanceOfDate()) {
      throw new PropertyNotDateException(
        `The property '${this.input.propertyName}' must to be a instance Date.${MESSAGE_PLEASE_CHECK_CONFIGURATIONS}`
      );
    }
  }
}
