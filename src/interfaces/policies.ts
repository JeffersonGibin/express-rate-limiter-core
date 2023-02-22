/**
 * Type  of policies supported
 * @exemple REQUEST_PER_SECONDS
 * @exemple REQUEST_PER_MINUTES
 * @exemple REQUEST_PER_PERIOD
 */
export type Policy =
  | "REQUEST_PER_SECONDS"
  | "REQUEST_PER_MINUTES"
  | "REQUEST_PER_PERIOD";

/**
 * Model Default ot Policy
 */
export interface IPolicyDefault {
  /**
   * Represent the type Policy
   */
  type: Policy;

  /**
   * Represent the total amount of requests that the client to can do
   */
  maxRequests: number;
}

export interface IPolicyRequestPerSeconds extends IPolicyDefault {
  /**
   * Represent the type REQUEST_PER_SECONDS
   */
  type: "REQUEST_PER_SECONDS";

  /**
   * Represent the time utilized to calculate the wait window
   */
  periodWindow: number;
}

export interface IPolicyRequestPerMinutes extends IPolicyDefault {
  /**
   * Represent the type REQUEST_PER_MINUTES
   */
  type: "REQUEST_PER_MINUTES";

  /**
   * Represent the time utilized to calculate the wait window
   */
  periodWindow: number;
}

export interface IPolicyRequestPerPeriod extends IPolicyDefault {
  /**
   * Represent the type REQUEST_PER_PERIOD
   */
  type: "REQUEST_PER_PERIOD";

  /**
   * Represent when the rate limit  will be start
   */
  periodWindowStart: Date;

  /**
   * Represent when the rate limit  will be end
   */
  periodWindowEnd: Date;
}

export type PolicieRateLimit =
  | IPolicyRequestPerSeconds
  | IPolicyRequestPerMinutes
  | IPolicyRequestPerPeriod;
