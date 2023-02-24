import { IValidationHandler } from "../interfaces/validations";
import { DateValidation } from "./date.validation";
import { MissingValidation } from "./missing.validation";
import { NumberValidation } from "./number.validation";
import { StringValidation } from "./string.validation";

export class ValidationHandler {
  private inputArgs: IValidationHandler[];

  /**
   * It Represent Class validation handler. This class is a handler the use of class validations
   * @param {IPropertyDefinitionValidation} input
   */
  constructor(input: IValidationHandler[]) {
    this.inputArgs = input;
  }

  /**
   * Execute Handler
   * @param {IPropertyDefinitionValidation} input
   */
  public execute() {
    for (let i = 0; i < this.inputArgs.length; i++) {
      const argument = this.inputArgs[i];

      for (let j = 0; j < argument.validations.length; j++) {
        const validationType = argument.validations[j];

        // if validationType is is_instance_date then instance MissingValidation and execute
        if (validationType === "exists_property") {
          new MissingValidation({
            propertyName: argument.propertyName,
            value: argument.value,
          }).execute();
        }

        // if validationType is is_instance_date then instance StringValidation and execute
        if (validationType === "is_string") {
          new StringValidation({
            propertyName: argument.propertyName,
            value: argument.value,
          }).execute();
        }

        // if validationType is is_instance_date then instance NumberValidation and execute
        if (validationType === "is_number") {
          new NumberValidation({
            propertyName: argument.propertyName,
            value: argument.value,
          }).execute();
        }

        // if validationType is is_instance_date then instance DateValidation and execute
        if (validationType === "is_instance_date") {
          new DateValidation({
            propertyName: argument.propertyName,
            value: argument.value,
          }).execute();
        }
      }
    }
  }
}
