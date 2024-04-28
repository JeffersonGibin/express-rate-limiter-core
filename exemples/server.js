/* eslint-disable no-console */
import express from "express";
import { RateLimitExpress, Redis } from "express-rate-limiter-core";

// Redis Connection
const redisClient = Redis.createClient({
  url: "redis://redis:6379",
});

redisClient.connect();

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());
app.set("trust proxy", true);

/***
 * =========================================
 *  type: REQUEST_PER_SECONDS
 * =========================================
 */
const rateLimitRequestPerSeconds = RateLimitExpress({
  redis: redisClient,
  strategyCache: "REDIS",
  policy: {
    type: "REQUEST_PER_SECONDS",
    periodWindow: 60,
    maxRequests: 10,
  },
});

app.get("/rate-limiter", rateLimitRequestPerSeconds.apply, (req, res) => {
  const response = {
    ip: req.ip,
    type: "REQUEST_PER_SECONDS",
    trustProxy: req.app.get("trust proxy"),
    headers: req.headers,
  };
  res.status(200).json(response);
});

app.listen(3000, () => {
  console.log(`Server is ready in port: ${PORT}`);
});
