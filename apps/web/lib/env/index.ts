import { clientEnvConfig, type ClientEnv } from "./client";
import { serverEnvConfig, type ServerEnv } from "./server";

export const env: ClientEnv & ServerEnv = {
  ...clientEnvConfig,
  ...serverEnvConfig,
};

export type { ClientEnv, ServerEnv };
