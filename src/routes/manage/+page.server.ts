import { getDb } from '$lib/server/db';
import { courses } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform);
	const allCourses = await db.select().from(courses).orderBy(courses.startDate);

	return {
		allCourses
	};
};
