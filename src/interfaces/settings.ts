import { ICache } from "./cache";

export interface ISettings {
    /**
     * Maximum number of requests allowed
     */
     maxRequest: number;

    /**
     * 
    Period window that the request limit is allowed
     */
    rateLimitWindow: number;

    /**
     * This atributte Cache needs to receive an adapter.
     * You can implement a custom adapter if you want as long as the interface is respected
     */
    cache: ICache
}