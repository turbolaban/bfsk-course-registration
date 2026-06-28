CREATE TABLE `courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`max_participants` integer DEFAULT 6,
	`deposit` integer DEFAULT 3000 NOT NULL,
	`price` integer DEFAULT 9000 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer,
	`given_name` text NOT NULL,
	`family_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`is_student` integer DEFAULT 0,
	`stripe_payment_deposit` text,
	`stripe_payment_remainder` text,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `registrations_email_unique` ON `registrations` (`email`);