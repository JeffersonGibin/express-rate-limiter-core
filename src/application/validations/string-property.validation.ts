import { MESSAGE_MISSING_PROPERTY_SETTINGS } from "../../constants/message-error";
import { PropertyNotStringException } from "../exceptions/property-not-string.exception";
import { IInputValidation } from "../../interfaces/validations";

export class StringPropertyValidation {
  private input: IInputValidation;

  constructor(input: IInputValidation) {
    this.input = input;
  }

  public execute() {
    if (this.input.value && typeof this.input.value !== "string") {
      throw new PropertyNotStringException(
        `The property '${this.input.propertyName}' must to be string.${MESSAGE_MISSING_PROPERTY_SETTINGS}`
      );
    }
  }
}
