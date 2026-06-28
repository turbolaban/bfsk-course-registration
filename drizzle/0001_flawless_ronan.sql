ALTER TABLE "courses" ADD COLUMN "deposit" integer DEFAULT 3000 NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "price" integer DEFAULT 9000 NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "stripe_payment_deposit" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "stripe_payment_remainder" text;