import { DatePropertyValidation } from "./date-property.validation";
import { MissingPropertyValidation } from "./missing-property.validation";
import { NumberPropertyValidation } from "./number-property.validation";
import { StringPropertyValidation } from "./string-property.validation";

type Validations =
  | "exists_property"
  | "is_number"
  | "is_string"
  | "is_instance_date";

interface InputValidationHandler {
  propertyName: string;
  value: string | number | Date;
  validations: Validations[];
}

export class ValidationHandler {
  private inputArgs: InputValidationHandler[];

  constructor(input: InputValidationHandler[]) {
    this.inputArgs = input;
  }

  public execute() {
    for (let i = 0; i < this.inputArgs.length; i++) {
      const argument = this.inputArgs[i];

      for (let j = 0; j < argument.validations.length; j++) {
        const validationType = argument.validations[j];

        // if validationType is is_instance_date then instance MissingPropertyValidation and execute
        if (validationType === "exists_property") {
          new MissingPropertyValidation({
            propertyName: argument.propertyName,
            value: argument.value,
          }).execute();
        }

        // if validationType is is_instance_date then instance StringPropertyValidation and execute
        if (validationType === "is_string") {
          new StringPropertyValidation({
            propertyName: argument.propertyName,
            value: argument.value,
          }).execute();
        }

        // if validationType is is_instance_date then instance NumberPropertyValidation and execute
        if (validationType === "is_number") {
          new NumberPropertyValidation({
            propertyName: argument.propertyName,
            value: argument.value,
          }).execute();
        }

        // if validationType is is_instance_date then instance DatePropertyValidation and execute
        if (validationType === "is_instance_date") {
          new DatePropertyValidation({
            propertyName: argument.propertyName,
            value: argument.value,
          }).execute();
        }
      }
    }
  }
}
