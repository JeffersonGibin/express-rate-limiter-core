import { IPropertyDefinitionValidation } from "../../interfaces/validations";
import { MissingPropertyException } from "../exceptions/missing-property.exception";
import { MissingValidation } from "./missing.validation";

describe("missing.validation unit test", () => {
  test("it should throw MissingPropertyException if value is missing", () => {
    const input = {
      propertyName: "date",
      value: undefined,
    };

    const validation = new MissingValidation(
      input as unknown as IPropertyDefinitionValidation
    );

    expect(() => {
      validation.execute();
    }).toThrowError(MissingPropertyException);
  });

  test("it should not throw MissingPropertyException if value exists", () => {
    const input: IPropertyDefinitionValidation = {
      propertyName: "date",
      value: 1,
    };

    const validation = new MissingValidation(input);

    expect(() => {
      validation.execute();
    }).not.toThrowError(MissingPropertyException);
  });
});
