export class PropertyNotDateException extends Error {
  constructor(message: string) {
    super(`${message}`);

    this.name = "PROPERTY_NOT_IS_INSTANCE_OF_DATE";
  }
}
