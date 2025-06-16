import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createDatabaseService } from './database';
export async function getDB() {
  const { env } = await getCloudflareContext();
  if (!env || !env.DB) {
    throw new Error('D1 database not found in Cloudflare environment');
  }
  return createDatabaseService(env.DB);
}