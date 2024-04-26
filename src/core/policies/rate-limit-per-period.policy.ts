import { RATE_LIMIT_ONE_HIT } from "../constants";
import { IRateLimitCache, ICache } from "../../shared/interfaces/cache";
import { IPolicyRequestPerPeriod } from "../interfaces/policies";

import { ValidationHandler } from "../validations/validation-handler";
import { RateLimitPolicy } from "./abstract/rate-limit.policy";

export class RateLimitPerPeriodPolicy extends RateLimitPolicy {
  protected policySettings: IPolicyRequestPerPeriod;
  protected responseRateLimitCache: IRateLimitCache;
  protected repositoryCache: ICache;

  /**
   * This class represent policies to rate-limit per period
   * @param {PolicieRateLimit} policySettings object value of policy settings
   * @param {IRateLimitCache} responseRateLimitCache object value of result cache
   * @param {ICache} repositoryCache repository cache
   */
  constructor(
    policySettings: IPolicyRequestPerPeriod,
    responseRateLimitCache: IRateLimitCache,
    repositoryCache: ICache
  ) {
    super(policySettings, responseRateLimitCache, repositoryCache);
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
   * Get rate-limit reset  value
   * @override method override
   * @returns {number} time in milliseconds
   */
  public whenTimeRateLimitReset(): number {
    return this.policySettings?.periodWindowEnd.getTime();
  }

  /**
   * Check if waiting time is expired
   * @returns {boolean}
   */
  public waitingTimeIsExpired(): boolean {
    const timestampNow = Date.now();
    const periodEnd = this.policySettings?.periodWindowEnd.getTime();

    /**
     * If timestamp current is more or equal to the timestamp to period end than return 'true'.
     * This represent that waiting time is expired
     */
    if (timestampNow >= periodEnd) {
      return true;
    }

    return false;
  }

  /**
   * @override
   */
  public async saveHit(key: string): Promise<void> {
    const timestampNow = Date.now();
    const periodWindowStart = this.policySettings?.periodWindowStart.getTime();
    const periodWindowStarted = timestampNow >= periodWindowStart;
    // If the period window will be started then save or update hit
    if (periodWindowStarted) {
      // If don't exists cache then save with value hit as ONE
      if (!this.responseRateLimitCache?.hits) {
        await this.repositoryCache?.saveHit(key, RATE_LIMIT_ONE_HIT);
      } else {
        // if the number max requests is more or equal to the number of hits registered in the cache then update 'hit'.
        let totalHitsInCache = this.responseRateLimitCache?.hits;
        if (this.policySettings?.maxRequests >= totalHitsInCache) {
          const newValue = (totalHitsInCache += RATE_LIMIT_ONE_HIT);
          await this.repositoryCache?.updateHit(key, newValue);
        }
      }

      // if time wait is expired then delete hit cache
      if (this.waitingTimeIsExpired()) {
        await this.repositoryCache?.deleteHit(key);
      }
    }
  }
}
