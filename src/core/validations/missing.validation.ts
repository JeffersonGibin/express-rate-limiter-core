import { MESSAGE_PLEASE_CHECK_CONFIGURATIONS } from "../../constants/message";
import { MissingPropertyException } from "../../application/exceptions/missing-property.exception";
import { IPropertyDefinitionValidation } from "../../interfaces/validations";

export class MissingValidation {
  private input: IPropertyDefinitionValidation;

  /**
   * It Represent Class validation to missing value
   * @param {IPropertyDefinitionValidation} input
   */
  constructor(input: IPropertyDefinitionValidation) {
    this.input = input;
  }

  /**
   * Execute validation
   * @exception {MissingPropertyException}
   */
  public execute() {
    if (!this.input.value && this.input.value !== 0) {
      throw new MissingPropertyException(
        `The policy doesn't find property '${this.input.propertyName}'.${MESSAGE_PLEASE_CHECK_CONFIGURATIONS}`
      );
    }
  }
}
