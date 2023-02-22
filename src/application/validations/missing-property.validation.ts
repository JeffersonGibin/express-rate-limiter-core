import { MESSAGE_PLEASE_CHECK_CONFIGURATIONS } from "../../constants/message";
import { MissingPropertyException } from "../exceptions/missing-property.exception";
import { IInputValidation } from "../../interfaces/validations";

export class MissingPropertyValidation {
  private input: IInputValidation;

  constructor(input: IInputValidation) {
    this.input = input;
  }

  public execute() {
    if (!this.input.value && this.input.value !== 0) {
      throw new MissingPropertyException(
        `The policy doesn't find property '${this.input.propertyName}'.${MESSAGE_PLEASE_CHECK_CONFIGURATIONS}`
      );
    }
  }
}
