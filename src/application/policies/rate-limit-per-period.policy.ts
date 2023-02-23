import { RATE_LIMIT_ONE_HIT } from "../../constants";
import { IRateLimitCache } from "../../interfaces/cache";
import { IPolicyRequestPerPeriod } from "../../interfaces/policies";
import { ValidationHandler } from "../validations/validation-handler";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";

export class RateLimitPerPeriodPolicy extends RateLimitPolicy {
  protected policySettings: IPolicyRequestPerPeriod;
  protected responseRateLimitCache: IRateLimitCache;

  /**
   * This class represent policies to rate limit per period
   * @param {PolicieRateLimit} policySettings object value of policy settings
   * @param {IRateLimitCache} responseRateLimitCache object value of result cache
   */
  constructor(
    policySettings: IPolicyRequestPerPeriod,
    responseRateLimitCache: IRateLimitCache
  ) {
    super(responseRateLimitCache);

    this.policySettings = policySettings;
    this.responseRateLimitCache = responseRateLimitCache;
  }

  public validateProps(): RateLimitPerPeriodPolicy {
    // Validations properties
    new ValidationHandler([
      {
        propertyName: "periodWindowStart",
        value: this.policySettings?.periodWindowStart,
        validations: ["exists_property", "is_instance_date"],
      },
      {
        propertyName: "periodWindowEnd",
        value: this.policySettings?.periodWindowEnd,
        validations: ["exists_property", "is_instance_date"],
      },
      {
        propertyName: "type",
        value: this.policySettings?.type,
        validations: ["exists_property", "is_string"],
      },
    ]).execute();

    return this;
  }

  /**
   * @override method override
   * @returns {number} timestmap periodWindoEnd
   */
  public calculateRateLimitReset(): number {
    return this.policySettings?.periodWindowEnd.getTime();
  }

  public waitingTimeIsExpired(): boolean {
    const timestampNow = Date.now();
    const periodEnd = this.policySettings?.periodWindowEnd.getTime();

    if (timestampNow >= periodEnd) {
      return true;
    }

    return false;
  }

  /**
   * @override
   */
  public async saveHit(key: string) {
    const timestampNow = Date.now();
    const periodWindowStart = this.policySettings?.periodWindowStart.getTime();
    const timeIsStarted = timestampNow >= periodWindowStart;

    if (timeIsStarted) {
      // If don't exists cache then save with value ONE
      if (!this.responseRateLimitCache?.hits) {
        await this.cacheAdapter?.saveHit(key, RATE_LIMIT_ONE_HIT);
      } else {
        // insert cache
        let totalHitsInCache = this.responseRateLimitCache?.hits;
        if (this.policySettings?.maxRequests >= totalHitsInCache) {
          const newValue = (totalHitsInCache += RATE_LIMIT_ONE_HIT);
          await this.cacheAdapter?.updateHit(key, newValue);
        }
      }

      if (this.waitingTimeIsExpired()) {
        await this.cacheAdapter?.deleteHit(key);
      }
    }
  }
}
