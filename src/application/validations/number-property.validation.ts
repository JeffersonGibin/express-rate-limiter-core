import { MESSAGE_PLEASE_CHECK_CONFIGURATIONS } from "../../constants/message";
import { PropertyNotNumberException } from "../exceptions/property-not-number.exception";
import { IInputValidation } from "../../interfaces/validations";

export class NumberPropertyValidation {
  private input: IInputValidation;

  constructor(input: IInputValidation) {
    this.input = input;
  }

  public execute() {
    if (this.input.value && typeof this.input.value !== "number") {
      throw new PropertyNotNumberException(
        `The property '${this.input.propertyName}' must to be number.${MESSAGE_PLEASE_CHECK_CONFIGURATIONS}`
      );
    }
  }
}
