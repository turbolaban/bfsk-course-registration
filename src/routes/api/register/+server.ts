import Stripe from 'stripe';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getDb } from '$lib/server/db';
import { courses, registrations } from '$lib/server/db/schema';
import type { RegistrationData } from '$lib/types';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST({ request, platform }: RequestEvent) {
	const db = getDb(platform);
	try {
		const data: RegistrationData = await request.json();

		// Validate required fields
		if (!data.givenName || !data.familyName || !data.email || !data.phone || !data.courseId) {
			return json(
				{
					error:
						'Missing required fields: givenName, firstName, email, and phone, courseId are all required.'
				},
				{ status: 400 }
			);
		}

		const [course] = await db.select().from(courses).where(eq(courses.id, data.courseId)).limit(1);

		const coursePrice = data.isStudent ? course.price - 500 : course.price;

		// Define the items and checkout parameters
		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
			{
				price_data: {
					currency: 'nok',
					product_data: {
						name: 'Depositum fallskjermkurs',
						description: 'Refunderes ikke'
					},
					unit_amount: course.deposit * 100
				},
				quantity: 1
			}
		];

		if (data.paymentType === 'full') {
			lineItems.push({
				price_data: {
					currency: 'nok',
					product_data: {
						name: 'Resterende kursavgift fallskjermkurs'
					},
					unit_amount: (coursePrice - course.deposit) * 100
				},
				quantity: 1
			});
		}

		const session = await stripe.checkout.sessions.create({
			line_items: lineItems,
			mode: 'payment',
			customer_email: data.email,
			success_url: `${request.headers.get('origin')}/success?ssid={CHECKOUT_SESSION_ID}`,
			cancel_url: `${request.headers.get('origin')}/cancel?ssid={CHECKOUT_SESSION_ID}`
		});

		await db.insert(registrations).values({
			courseId: data.courseId,
			givenName: data.givenName,
			familyName: data.familyName,
			email: data.email,
			phone: data.phone,
			isStudent: data.isStudent || false,
			stripePaymentDeposit: session.id
		});

		// Send the unique session URL or ID back to the Svelte frontend
		return json({ url: session.url });

		//return json({ success: true });
	} catch (err: unknown) {
		return json({ error: (err as Error).message }, { status: 500 });
	}
}
