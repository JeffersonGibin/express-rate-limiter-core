import { MESSAGE_MISSING_PROPERTY_SETTINGS } from "../../constants/message-error";
import { MissingPropertyException } from "../exceptions/missing-property.exception";

interface InputMissingPropertyValidation {
  propertyName: string;
  value: string | number | Date;
}

export class MissingPropertyValidation {
  private input: InputMissingPropertyValidation;

  constructor(input: InputMissingPropertyValidation) {
    this.input = input;
  }

  public execute() {
    if (!this.input.value && this.input.value !== 0) {
      throw new MissingPropertyException(
        `The policy doesn't find property '${this.input.propertyName}'.${MESSAGE_MISSING_PROPERTY_SETTINGS}`
      );
    }
  }
}
