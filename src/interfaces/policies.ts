export type Policy =
  | "REQUEST_PER_SECONDS"
  | "REQUEST_PER_MINUTES"
  | "REQUEST_PER_PERIOD";

export interface IPolicyDefault {
  type: Policy;
  maxRequests: number;
}

export interface IPolicyRequestPerSeconds extends IPolicyDefault {
  type: "REQUEST_PER_SECONDS";
  periodWindow: number;
}

export interface IPolicyRequestPerMinutes extends IPolicyDefault {
  type: "REQUEST_PER_MINUTES";
  periodWindow: number;
}

export interface IPolicyRequestPerPeriod extends IPolicyDefault {
  type: "REQUEST_PER_PERIOD";
  periodWindowStart: Date;
  periodWindowEnd: Date;
}

export type IPolicieRateLimit =
  | IPolicyRequestPerSeconds
  | IPolicyRequestPerMinutes
  | IPolicyRequestPerPeriod;
