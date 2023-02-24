export class PropertyNotDateException extends Error {
  /**
   * This class extends native class Error and represents a custom exception to property not date
   * @param {string} message
   */
  constructor(message: string) {
    super(`${message}`);

    this.name = "PROPERTY_IS_NOT_INSTANCE_DATE";
  }
}
