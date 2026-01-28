import { z } from "zod";

const clientEnvSchema = z.object({
  API_BASE_URL: z.url(),
});

const clientEnv = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL,
};

const parsed = clientEnvSchema.safeParse(clientEnv);

if (!parsed.success) {
  console.error(
    "Invalid client environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid client environment variables");
}

export const clientEnvConfig = parsed.data;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
