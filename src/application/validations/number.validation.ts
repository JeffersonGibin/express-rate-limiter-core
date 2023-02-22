import { MESSAGE_PLEASE_CHECK_CONFIGURATIONS } from "../../constants/message";
import { PropertyNotNumberException } from "../exceptions/property-not-number.exception";
import { IPropertyDefinitionValidation } from "../../interfaces/validations";

export class NumberValidation {
  private input: IPropertyDefinitionValidation;

  /**
   * It Represent Class validation to Number
   * @param {IPropertyDefinitionValidation} input
   */
  constructor(input: IPropertyDefinitionValidation) {
    this.input = input;
  }

  /**
   * Execute validation
   * @exception {PropertyNotNumberException}
   */
  public execute() {
    if (this.input.value && typeof this.input.value !== "number") {
      throw new PropertyNotNumberException(
        `The property '${this.input.propertyName}' must to be number.${MESSAGE_PLEASE_CHECK_CONFIGURATIONS}`
      );
    }
  }
}
