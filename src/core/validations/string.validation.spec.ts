import { IPropertyDefinitionValidation } from "../../interfaces/validations";
import { PropertyNotStringException } from "../exceptions/property-not-string.exception";
import { StringValidation } from "./string.validation";

describe("string.validation unit test", () => {
  test("it should throw PropertyNotStringException if value is not a string", () => {
    const input: IPropertyDefinitionValidation = {
      propertyName: "value",
      value: 1,
    };

    const validation = new StringValidation(input);

    expect(() => {
      validation.execute();
    }).toThrowError(PropertyNotStringException);
  });

  test("it should not throw PropertyNotStringException if value is a string", () => {
    const input: IPropertyDefinitionValidation = {
      propertyName: "value",
      value: "1",
    };

    const validation = new StringValidation(input);

    expect(() => {
      validation.execute();
    }).not.toThrowError(PropertyNotStringException);
  });
});
