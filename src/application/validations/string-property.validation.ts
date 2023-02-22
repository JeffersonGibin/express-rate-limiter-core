import { MESSAGE_MISSING_PROPERTY_SETTINGS } from "../../constants/message-error";
import { PropertyNotStringException } from "../exceptions/property-not-string.exception";

interface InputStringPropertyValidation {
  propertyName: string;
  value: string | number | Date;
}

export class StringPropertyValidation {
  private input: InputStringPropertyValidation;

  constructor(input: InputStringPropertyValidation) {
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
