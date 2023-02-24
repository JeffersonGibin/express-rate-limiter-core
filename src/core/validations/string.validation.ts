import { MESSAGE_PLEASE_CHECK_CONFIGURATIONS } from "../constants/message";
import { PropertyNotStringException } from "../exceptions/property-not-string.exception";
import { IPropertyDefinitionValidation } from "../../interfaces/validations";

export class StringValidation {
  private input: IPropertyDefinitionValidation;

  /**
   * It Represent Class validation to String
   * @param {IPropertyDefinitionValidation} input
   */
  constructor(input: IPropertyDefinitionValidation) {
    this.input = input;
  }

  public execute() {
    if (this.input.value && typeof this.input.value !== "string") {
      throw new PropertyNotStringException(
        `The property '${this.input.propertyName}' must to be string.${MESSAGE_PLEASE_CHECK_CONFIGURATIONS}`
      );
    }
  }
}
