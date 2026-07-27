import { z } from 'zod';

export const STORAGE_PROVIDERS = {
  /** AWS S3, and any S3-compatible service driven by the same client. */
  S3: 'S3',
  /** Cloudinary — image-focused, with transformations. */
  CLOUDINARY: 'CLOUDINARY',
  /** Cloudflare R2 / Images. Kept separate from S3 so URLs and the
   *  client can differ per provider. */
  CLOUDFLARE: 'CLOUDFLARE',
} as const;

export const storageProviderSchema = z.enum(STORAGE_PROVIDERS);

export type StorageProvider = z.infer<typeof storageProviderSchema>;
