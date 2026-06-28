import { db } from '$lib/server/db';
import { courses } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allCourses = await db.select().from(courses).orderBy(courses.startDate);

	return {
		allCourses
	};
};
