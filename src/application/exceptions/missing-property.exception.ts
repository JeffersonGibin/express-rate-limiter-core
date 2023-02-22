export class MissingPropertyException extends Error {
  constructor(message: string) {
    super(`${message}`);

    this.name = "MISSING_PROPERTY_ERROR";
  }
}
