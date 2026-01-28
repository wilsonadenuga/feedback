import { z } from "zod";

const serverEnvSchema = z.object({
  environment: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const serverEnv = {
  environment: process.env.ENVIRONMENT,
};

const parsed = serverEnvSchema.safeParse(serverEnv);

if (!parsed.success) {
  console.error(
    "Invalid server environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid server environment variables");
}

export const serverEnvConfig = parsed.data;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
