# express-rate-limiter-core

A library to that disponibility is an easy middleware to limit request rate in the server express.

## Install

To install `express-rate-limiter-core`, just run the following command:

```shell
npm install express-rate-limiter-core
```

## Exemple

```javascript
import express from "express";
import { MemoryDBAdapter, RateLimitExpress } from "express-rate-limiter-core";

const app = express();

// Configure rate limiting settings
const rateLimit = RateLimitExpress({
  maxRequest: 20,
  rateLimitWindow: 20,
  cache: new MemoryDBAdapter(),
});

/**
 * This is apply rate limit in the express.
 */
app.use(rateLimit.apply);

// Rote exemple
app.get("/user", (req, res) => {
  res.status(200).json({
    name: "Person",
  });
});

// Server
app.listen(8080, () => {
  console.log("Server is ready!");
});
```

## Constructor Parameters

|     Parameter     | Require |                                                                   Description                                                                   |
| :---------------: | :-----: | :---------------------------------------------------------------------------------------------------------------------------------------------: |
|   `maxRequest`    |   Yes   |                                   The maximum number of allowed requests within the rate limiting time window                                   |
| `rateLimitWindow` |   Yes   |                                         Time window in milliseconds during which requests are throttled                                         |
|      `cache`      |   Yes   | A custom cache instance used to store rate limiting information. For example, the `MemoryDBAdapter` stores rate limiting information in memory. |

## TypeScript Support

This library provides interfaces that can be used with TypeScript.

|   Interface   |                                       Description                                       |
| :-----------: | :-------------------------------------------------------------------------------------: |
|    ICache:    | interface provides a model for adapters. Any new adapter must implement this interface. |
| IResponseHit: |           interface provides a model for the response of the ICache adapter.            |
|  ISettings:   |       interface provides a model for the construction parameters of the library.        |

## Response

When the request max number is hit the response return is.

- HTTP Status Code 429
- Message: `{ message: "Too many requests" }`

## Headers

|       Header        | Always Returned |                                                                                              Description                                                                                               |
| :-----------------: | :-------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `X-RateLimit-Limit` |       Yes       |                                                                                   used to identify max request limit                                                                                   |
| `X-RateLimit-Reset` |       No        | This header is used to identify when the limiter is reset and only is returned when the request limit hit. The value é represented in seconds.The header only is returned when the rate limit was hit. |
|    `Retry-After`    |       No        |                              used to tells the client how long in seconds to wait before making another request. The header only is returned when the rate limit was hit.                              |
