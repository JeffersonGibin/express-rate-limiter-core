import { MESSAGE_MISSING_PROPERTY_SETTINGS } from "../../constants/message-error";
import { PropertyNotNumberException } from "../exceptions/property-not-number.exception";

interface InputNumberPropertyValidation {
  propertyName: string;
  value: string | number | Date;
}

export class NumberPropertyValidation {
  private input: InputNumberPropertyValidation;

  constructor(input: InputNumberPropertyValidation) {
    this.input = input;
  }

  public execute() {
    if (this.input.value && typeof this.input.value !== "number") {
      throw new PropertyNotNumberException(
        `The property '${this.input.propertyName}' must to be number.${MESSAGE_MISSING_PROPERTY_SETTINGS}`
      );
    }
  }
}
