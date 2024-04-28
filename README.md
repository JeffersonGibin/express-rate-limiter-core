# <div align="center"> Express Rate Limit Core</div>

<div align="center">

[![Build Status](https://github.com/JeffersonGibin/express-rate-limiter-core/actions/workflows/pipeline.yml/badge.svg)](https://github.com/JeffersonGibin/express-rate-limiter-core/actions/workflows/pipeline.yml)
[![npm](https://img.shields.io/npm/v/express-rate-limiter-core.svg)](https://www.npmjs.com/package/express-rate-limiter-core 'View this project on NPM')
[![npm download count](https://img.shields.io/npm/dm/express-rate-limiter-core)](https://www.npmjs.com/package/express-rate-limiter-core)
[![MIT License](https://img.shields.io/npm/l/express-rate-limiter-core.svg)](#license)

</div>



A library to that disponibility is an easy middleware to limit request rate in the server express.

## Install

To install `express-rate-limiter-core`, just run the following command:

```shell
npm install express-rate-limiter-core
```

## Features

- Rate-limit per second
- Rate-limit per minutes
- Rate-limit per period
- Block system to requets
- Storage in Memory or Redis
- Support for Storage Customization

## Cache

- **Redis Cache:** Use Redis to manage your cache. Ideal for environments that require scalability.
- **Cache in Memory:** it does not have support to scale this is only a simple cache that will be in your server.
- **Custom Cache:** the library available an interface `CustomCache` with this interface you can implement your owner cache manager.

### Note
- If your storage needs are in a different location, then you need to implement a class with the Custom interface and pass the instance of this class to the `cache` attribute. When doing this, the `strategyCache` property must be set to `CUSTOM`.


## TypeScript Support

This library provides interfaces that can be used with TypeScript.

|    Interface    |                                                                   Description                                                                   |
|:---------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------:|
|     Redis:      | You do not need to install the Redis library in your project. Simply obtain the Redis object through the import from express-rate-limiter-core. |
|  CustomCache:   |                                       the interface provides a model for the implementation custom cache.                                       |
| RateLimitCache: |                                         interface provides a model for the response of the CustomCache.                                         |
|    Settings:    |                                   interface provides a model for the construction parameters of the library.                                    |

## Exemples

### Importing

```javascript
import { RateLimitExpress, Redis } from "express-rate-limiter-core";
```

### Request per Seconds or Minutes

```javascript

// Exemple RateLimitExpress with cache in Memory
const app = express();

const rateLimit = RateLimitExpress({
  // This field is optional; when not defined, it defaults to IN_MEMORY.
  strategyCache: 'IN_MEMORY',

  policy: {
    type: "REQUEST_PER_SECONDS", // REQUEST_PER_SECONDS, REQUEST_PER_MINUTES

    periodWindow: 10,

    maxRequests: 10,
  },
});

// Exemple RateLimitExpress with cache in Redis
const redisClient = Redis.createClient({
    url: 'redis://localhost:6379'
});

const rateLimit = RateLimitExpress({
  // This field is optional and support IN_MEMORY, REDIS and CUSTOM
  strategyCache: 'REDIS',
  
  redis: redisClient,

  policy: {
    type: "REQUEST_PER_SECONDS", // REQUEST_PER_SECONDS, REQUEST_PER_MINUTES

    periodWindow: 10,

    maxRequests: 10,
  },
});

// The implementation can be done in any storage you need. The only requirement is to respect the interface contracts; if you wish, you can draw inspiration from already implemented repositories.

class CustomCacheExemple implements CustomCache {}

// Exemple RateLimitExpress with custom cache
const rateLimit = RateLimitExpress({
  // This field is optional and support IN_MEMORY, REDIS and CUSTOM
  strategyCache: 'CUSTOM',

  cache: new CustomCacheExemple(),

  policy: {
    type: "REQUEST_PER_SECONDS", // REQUEST_PER_SECONDS, REQUEST_PER_MINUTES

    periodWindow: 10,

    maxRequests: 10,
  },
});
```

### Request per Period

```javascript

// Exemple RateLimitExpress with cache in Memory
const rateLimit = RateLimitExpress({

  policy: {
    type: "REQUEST_PER_PERIOD",

    // date representing when rate-limit will be start
    periodWindowStart: new Date("2023-02-22T19:02:57.087Z"),

    //date representing when rate-limit will be end
    periodWindowEnd: new Date("2023-02-22T19:06:57.087Z"),

    // max requests allowed in the interval start and end
    maxRequests: 10,
  },
});
```

### Block Request Rule

```javascript
// exemple cache in memory

import express from "express";
import { RateLimitExpress } from "express-rate-limiter-core";

const app = express();

const rateLimit = RateLimitExpress({
  policy: {
    type: "REQUEST_PER_PERIOD",

    // date representing when rate-limit will be start
    periodWindowStart: new Date("2023-02-22T19:02:57.087Z"),

    //date representing when rate-limit will be end
    periodWindowEnd: new Date("2023-02-22T19:06:57.087Z"),

    // max requests allowed in the interval start and end
    maxRequests: 10,
  },

  /**
   * In this  Method, you can implement block request rules.
   * The method to have request express object available to use
   */
  blockRequestRule: (requestExpress) => {
    // this is only an example. You can implement of more forms
    const blackList = ["192.168.1.10", "192.168.1.11", "192.168.1.12"];
    if (blackList.includes(requestExpress.ip)) {
      return true;
    }

    return false;
  },
});
```

### How use ?

```javascript
/**
 * Apply rate-limit in the express.
 */
app.use(rateLimit.apply);
```

## Constructor Parameters

|     Parameter      | Required | Description                                                                                                                                                                                                     |
|--------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  `redis`           | No       | This property should be the instance of your Redis. If you wish, you can import the `Redis` library with `import { Redis } from "express-rate-limiter-core";`.                                                   |
|  `cache`           | No       | Accepts a custom cache instance to store rate-limiting information. This property should be used in conjunction with `strategyCache` set to `CUSTOM`. |
|  `policy`          | Yes      | A object with policy to service.                                                                                                                                                                                |
|  `strategyCache`   | No       | This property is used as a cache strategy, allowing you to set the values `IN_MEMORY`, `REDIS`, or `CUSTOM`.                                                                                                     |
| `blockRequestRule` | No       | Function optional to implement the rule of locking in your service. The function receives the property 'request' of the object express.                                                                          |


### Policy to Request per Seconds

Object Specification `policy`:

|       Parameter       |         Type          | Require | Description                                                                                                                                                                      |
|:---------------------:|:---------------------:|:-------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     `policy.type`     | `REQUEST_PER_SECONDS` |  true   | type policy                                                                                                                                                                      |
| `policy.periodWindow` |        number         |  true   | period window in seconds is utilized to calculate the time wait. Exemple: if defined `maxRequest: 100` and `periodWindow:60` the user needs to wait 60 seconds after 100 requets |
| `policy.maxRequests`  |        number         |  true   | is the number request that the client 'ip' to can receive                                                                                                                        |

### Policy to Request per Minutes

Object Specification `policy`:

|       Parameter       |         Type          | Require | Description                                                                                                                                                                      |
|:---------------------:|:---------------------:|:-------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     `policy.type`     | `REQUEST_PER_MINUTES` |  true   | type policy                                                                                                                                                                      |
| `policy.periodWindow` |        number         |  true   | period window in minutes is utilized to calculate the time wait. Exemple: if defined `maxRequest: 100` and `periodWindow:60` the user needs to wait 60 minutos after 100 requets |
| `policy.maxRequests`  |        number         |  true   | is the number request that the client 'ip' to can receive                                                                                                                        |

### Policy to Request per Period

Object Specification `policy`:

|         Parameter          |         Type         | Require | Description                                               |
|:--------------------------:|:--------------------:|:-------:|-----------------------------------------------------------|
|       `policy.type`        | `REQUEST_PER_PERIOD` |  true   | type policy                                               |
|    `policy.maxRequests`    |        number        |  true   | is the number request that the client 'ip' to can receive |
| `policy.periodWindowStart` |         Date         |  true   | date representing when rate-limit will be start           |
|  `policy.periodWindowEnd`  |         Date         |  true   | date representing when rate-limit will be end             |


## Response

| Status code |                            message                             |                                                                                                               description                                                                                                               |
|:-----------:|:--------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|     429     | Too many requests. You've exceeded the rate-limit for requests |                                                                          This message is returned to all types of policies when the request limit is exceeded.                                                                          |
|     403     |                     Unauthorized Request!                      |                                                     This message is returned only when the property `blockRequestRule` is passed in the instance of the library and returns `True`.                                                     |
|     500     |                          Other errors                          | This message is returned ever that a property doesn't is passed correctly in the instance of the library. Possible scenaries: `MISSING_PROPERTY`,`PROPERTY_IS_NOT_INSTANCE_DATE`,`PROPERTY_IS_NOT_NUMBER` and `PROPERTY_IS_NOT_STRING`, |

## Headers

|         Header          | Always Returned |                                                                                                                                                          Description                                                                                                                                                           |
|:-----------------------:|:---------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|   `X-RateLimit-Limit`   |       Yes       |                                                                                                                                               used to identify max request limit                                                                                                                                               |
| `X-RateLimit-Remaining` |       No        |                                                                                                used to identify the quantity remaining max request limit. This header is returned only if the quantity is less than max limit.                                                                                                 |
|   `X-RateLimit-Reset`   |       No        | This header is used to identify when the limiter is reset and only is returned when the request limit hit. The value é represented in as ISO string. The header only is returned when the rate-limit was hit. When the policy is `REQUEST_PER_PERIOD` the header returns the value of property `periodWindowEnd` as ISO string |
|      `Retry-After`      |       No        |                           used to tells the client how long in seconds to wait before making another request. The header only is returned when the rate-limit was hit. When the policy is `REQUEST_PER_PERIOD` the header returns difference between timestamp now and `periodWindowEnd` in seconds.                           |

## Issues and Contributing

- *Issues:* If you encounter a bug or wish to see something added/changed, please [open an issue](https://github.com/JeffersonGibin/express-rate-limiter-core/issues/new)!

- *Discussion:* If you need assistance with anything related to the project, whether it's understanding how to use a particular feature, troubleshooting an issue, or anything [start a discussion here](https://github.com/JeffersonGibin/express-rate-limiter-core/discussions/new)!
- *Contributing*: To contributing please read [the guide](contributing.md).

## License

[MIT](https://choosealicense.com/licenses/mit/)
