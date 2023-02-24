/**
 * Definition of property to validation
 */
export interface IPropertyDefinitionValidation {
  propertyName: string;
  value: string | number | Date;
}

/**
 * Types Validations to using with system validation
 */
export type TypeValidations =
  | "exists_property"
  | "is_number"
  | "is_string"
  | "is_instance_date";

export interface IValidationHandler extends IPropertyDefinitionValidation {
  validations: TypeValidations[];
}
