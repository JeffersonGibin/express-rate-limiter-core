import { IPropertyDefinitionValidation } from "../../interfaces/validations";
import { PropertyNotDateException } from "../exceptions/property-not-date.exception";
import { DateValidation } from "./date.validation";

describe("date.validation unit test", () => {
  it("it should throw PropertyNotDateException if value is not a date", () => {
    const input: IPropertyDefinitionValidation = {
      propertyName: "date",
      value: "not a date",
    };

    const validation = new DateValidation(input);

    expect(() => {
      validation.execute();
    }).toThrowError(PropertyNotDateException);
  });

  it("it should not throw PropertyNotDateException if value is a date", () => {
    const input: IPropertyDefinitionValidation = {
      propertyName: "date",
      value: new Date(),
    };

    const validation = new DateValidation(input);

    expect(() => {
      validation.execute();
    }).not.toThrowError(PropertyNotDateException);
  });
});
