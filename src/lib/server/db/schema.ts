import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const courses = sqliteTable('courses', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	startDate: text('start_date').notNull(),
	endDate: text('end_date').notNull(),
	maxParticipants: integer('max_participants').default(6),
	deposit: integer('deposit').notNull().default(3000),
	price: integer('price').notNull().default(9000)
});

export const registrations = sqliteTable('registrations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
	givenName: text('given_name').notNull(),
	familyName: text('family_name').notNull(),
	email: text('email').notNull().unique(),
	phone: text('phone').notNull(),
	isStudent: integer('is_student').default(0),
	stripePaymentDeposit: text('stripe_payment_deposit'),
	stripePaymentRemainder: text('stripe_payment_remainder')
});
