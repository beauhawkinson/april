import { createEnv } from "@t3-oss/env-core";
import { minLength, optional, pipe, string, url } from "valibot";

const requiredString = () => pipe(string(), minLength(1));
const requiredUrl = () => pipe(string(), url());
const optionalString = () => optional(pipe(string(), minLength(1)));

export const env = createEnv({
  server: {
    // database
    DATABASE_URL: requiredUrl(),

    // auth
    BETTER_AUTH_SECRET: requiredString(),
    BETTER_AUTH_URL: requiredUrl(),

    // oauth providers
    GOOGLE_CLIENT_ID: requiredString(),
    GOOGLE_CLIENT_SECRET: requiredString(),
    GITHUB_CLIENT_ID: requiredString(),
    GITHUB_CLIENT_SECRET: requiredString(),

    // Cloudflare R2 storage
    R2_ACCOUNT_ID: requiredString(),
    R2_ACCESS_KEY_ID: requiredString(),
    R2_SECRET_ACCESS_KEY: requiredString(),
    R2_BUCKET_NAME: requiredString(),
    R2_PUBLIC_URL: requiredUrl(),

    // stripe
    STRIPE_SECRET_KEY: requiredString(),
    STRIPE_WEBHOOK_SECRET: requiredString(),

    // upstash redis (page views)
    UPSTASH_REDIS_REST_URL: requiredUrl(),
    UPSTASH_REDIS_REST_TOKEN: requiredString(),
    BLOCKED_IPS: optionalString(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
