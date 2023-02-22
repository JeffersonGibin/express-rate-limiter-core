export interface IInputValidation {
  propertyName: string;
  value: string | number | Date;
}

type Validations =
  | "exists_property"
  | "is_number"
  | "is_string"
  | "is_instance_date";

export interface IValidationHandler extends IInputValidation {
  validations: Validations[];
}
