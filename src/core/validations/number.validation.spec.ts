import { IPropertyDefinitionValidation } from "../../interfaces/validations";
import { PropertyNotNumberException } from "../exceptions/property-not-number.exception";
import { NumberValidation } from "./number.validation";

describe("number.validation unit test", () => {
  test("it should throw PropertyNotNumberException if value is not a number", () => {
    const input: IPropertyDefinitionValidation = {
      propertyName: "value",
      value: "1",
    };

    const validation = new NumberValidation(input);

    expect(() => {
      validation.execute();
    }).toThrowError(PropertyNotNumberException);
  });

  test("it should not throw PropertyNotNumberException if value is a number", () => {
    const input: IPropertyDefinitionValidation = {
      propertyName: "date",
      value: 1,
    };

    const validation = new NumberValidation(input);

    expect(() => {
      validation.execute();
    }).not.toThrowError(PropertyNotNumberException);
  });
});
