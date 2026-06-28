import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { registrations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ params }) {
	const courseId = Number(params.courseId);

	const participants = await db
		.select()
		.from(registrations)
		.where(eq(registrations.courseId, courseId))
		.orderBy(registrations.id);

	return json(participants);
}
