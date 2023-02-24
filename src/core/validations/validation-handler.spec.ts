import { IValidationHandler } from "../interfaces/validations";
import { DateValidation } from "./date.validation";
import { MissingValidation } from "./missing.validation";
import { NumberValidation } from "./number.validation";
import { StringValidation } from "./string.validation";
import { ValidationHandler } from "./validation-handler";

jest.mock("./date.validation");
jest.mock("./missing.validation");
jest.mock("./number.validation");
jest.mock("./string.validation");

describe("validation-handler unit test", () => {
  test("should execute all validations for all arguments", () => {
    const inputArgs: IValidationHandler[] = [
      {
        propertyName: "name",
        value: "John",
        validations: ["exists_property", "is_string"],
      },
      {
        propertyName: "age",
        value: 30,
        validations: ["exists_property", "is_number"],
      },
      {
        propertyName: "birthday",
        value: new Date("1990-01-01"),
        validations: ["exists_property", "is_instance_date"],
      },
    ];

    const missingValidationExecuteSpy = jest.spyOn(
      MissingValidation.prototype,
      "execute"
    );
    const stringValidationExecuteSpy = jest.spyOn(
      StringValidation.prototype,
      "execute"
    );
    const numberValidationExecuteSpy = jest.spyOn(
      NumberValidation.prototype,
      "execute"
    );
    const dateValidationExecuteSpy = jest.spyOn(
      DateValidation.prototype,
      "execute"
    );

    new ValidationHandler(inputArgs).execute();

    expect(missingValidationExecuteSpy).toHaveBeenCalledTimes(3);
    expect(stringValidationExecuteSpy).toHaveBeenCalledTimes(1);
    expect(numberValidationExecuteSpy).toHaveBeenCalledTimes(1);
    expect(dateValidationExecuteSpy).toHaveBeenCalledTimes(1);

    missingValidationExecuteSpy.mockRestore();
    stringValidationExecuteSpy.mockRestore();
    numberValidationExecuteSpy.mockRestore();
    dateValidationExecuteSpy.mockRestore();
  });
});
