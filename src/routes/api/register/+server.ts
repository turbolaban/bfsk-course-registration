import Stripe from 'stripe';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { registrations } from '$lib/server/db/schema';
import type { RegistrationData } from '$lib/types';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST({ request }: RequestEvent) {
	try {
		const data: RegistrationData = await request.json();

		console.log('data', data);

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

		// TODO: save data using drizzle
		await db.insert(registrations).values({
			courseId: data.courseId,
			givenName: data.givenName,
			familyName: data.familyName,
			email: data.email,
			phone: data.phone,
			isStudent: data.isStudent || false
		});

		// Define the items and checkout parameters
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price_data: {
						currency: 'nok',
						product_data: {
							name: 'Depositum fallskjermkurs',
							description: 'Refunderes ikke'
						},
						unit_amount: 2000
					},
					quantity: 1
				},
				{
					price_data: {
						currency: 'nok',
						product_data: {
							name: 'Kursavgift fallskjermkurs'
						},
						unit_amount: 8000
					},
					quantity: 1
				}
			],
			mode: 'payment',
			customer_email: data.email,
			success_url: `${request.headers.get('origin')}/success?ssid={CHECKOUT_SESSION_ID}`,
			cancel_url: `${request.headers.get('origin')}/cancel?ssid={CHECKOUT_SESSION_ID}`
		});

		console.log(session);
		// Send the unique session URL or ID back to the Svelte frontend
		return json({ url: session.url });

		//return json({ success: true });
	} catch (err: unknown) {
		return json({ error: (err as Error).message }, { status: 500 });
	}
}
