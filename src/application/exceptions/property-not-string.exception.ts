export class PropertyNotStringException extends Error {
  constructor(message: string) {
    super(`${message}`);

    this.name = "PROPERTY_NOT_IS_STRING";
  }
}
