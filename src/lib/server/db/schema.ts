import { pgTable, serial, text, boolean, date, integer } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
	id: serial('id').primaryKey(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	maxParticipants: integer('max_participants').default(6),
	deposit: integer('deposit').notNull().default(3000),
	price: integer('price').notNull().default(9000)
});

export const registrations = pgTable('registrations', {
	id: serial('id').primaryKey(),
	courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
	givenName: text('given_name').notNull(),
	familyName: text('family_name').notNull(),
	email: text('email').notNull().unique(),
	phone: text('phone').notNull(),
	isStudent: boolean('is_student').default(false),
	stripePaymentDeposit: text('stripe_payment_deposit'),
	stripePaymentRemainder: text('stripe_payment_remainder')
});
