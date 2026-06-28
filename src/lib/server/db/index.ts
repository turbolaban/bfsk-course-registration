import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function getDb(platform: App.Platform | undefined) {
	if (!platform?.env?.DB) {
		throw new Error('Database binding (DB) is missing from Cloudflare platform context');
	}
	return drizzle(platform.env.DB, { schema });
}
