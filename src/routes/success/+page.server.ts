import { getDb } from '$lib/server/db';
import { registrations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const load: PageServerLoad = async ({ platform, url }) => {
	const db = getDb(platform);
	const stripeSessionId = url.searchParams.get('ssid');

	let stripePaymentIntentId = 'unknown';

	if (stripeSessionId) {
		const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
		console.log(session.payment_intent);
		if (session.payment_intent) {
			stripePaymentIntentId =
				typeof session.payment_intent === 'string'
					? session.payment_intent
					: session.payment_intent.id;
		}
	}

	// store payment intent in db
	await db
		.update(registrations)
		.set({ stripePaymentDeposit: stripePaymentIntentId })
		.where(eq(registrations.stripePaymentDeposit, stripeSessionId ?? ''));
};
