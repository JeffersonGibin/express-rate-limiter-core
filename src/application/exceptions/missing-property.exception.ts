export class MissingPropertyException extends Error {
  /**
   * This class extends native class Error and represent custom exception to missing property
   * @param {string} message
   */
  constructor(message: string) {
    super(`${message}`);

    this.name = "MISSING_PROPERTY";
  }
}
