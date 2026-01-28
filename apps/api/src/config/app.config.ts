import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'staging', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRATION: z.coerce.number().default(604800),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(32),
  JWT_ACCESS_TOKEN_EXPIRATION: z.coerce.number().default(259200),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(32),
  JWT_REFRESH_TOKEN_EXPIRATION: z.coerce.number().default(604800),
  REDIS_URL: z.url(),
  RESEND_API_KEY: z.string().min(1),
  DEFAULT_LABELS: z
    .string()
    .default('Feature Request,Bug,Improvement')
    .transform((val) => val.split(',').map((v) => v.trim())),
});

export type Env = z.infer<typeof envSchema>;

const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(`Environment validation failed:\n${missingVars}`);
    }
    throw error;
  }
};

export const env = validateEnv();

export default () => ({
  app: {
    port: env.PORT,
    env: env.NODE_ENV,
  },
  database: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiryTime: env.JWT_EXPIRATION,
    accessToken: {
      secret: env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION,
    },
    refreshToken: {
      secret: env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION,
    },
  },
  redis: {
    url: env.REDIS_URL,
  },
  resend: {
    apiKey: env.RESEND_API_KEY,
  },
  labels: {
    defaults: env.DEFAULT_LABELS,
  },
});
