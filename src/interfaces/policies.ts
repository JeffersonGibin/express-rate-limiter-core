export type Policy =
  | "REQUET_PER_SECONDS"
  | "REQUET_PER_MINUTES"
  | "REQUET_PER_PERIOD";

export interface IPolicyDefault {
  type: Policy;
  maxRequests: number;
}

export interface IPolicyRequestPerSeconds extends IPolicyDefault {
  type: "REQUET_PER_SECONDS";
  periodWindow: number;
}

export interface IPolicyRequestPerMinutes extends IPolicyDefault {
  type: "REQUET_PER_MINUTES";
  periodWindow: number;
}

export interface IPolicyRequestPerPeriod extends IPolicyDefault {
  type: "REQUET_PER_PERIOD";
  periodWindowStart: Date;
  periodWindowEnd: Date;
}

export type IPolicieRateLimit =
  | IPolicyRequestPerSeconds
  | IPolicyRequestPerMinutes
  | IPolicyRequestPerPeriod;
