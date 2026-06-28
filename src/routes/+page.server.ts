import { db } from '$lib/server/db';
import { courses } from '$lib/server/db/schema';
import { gt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const upcomingCourses = await db
		.select()
		.from(courses)
		.where(gt(courses.startDate, new Date().toISOString()))
		.orderBy(courses.startDate);

	return {
		upcomingCourses
	};
};
