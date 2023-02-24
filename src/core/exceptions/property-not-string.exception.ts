export class PropertyNotStringException extends Error {
  /**
   * This class extends native class Error and represents a custom exception to property not string
   * @param {string} message
   */
  constructor(message: string) {
    super(`${message}`);

    this.name = "PROPERTY_IS_NOT_STRING";
  }
}
