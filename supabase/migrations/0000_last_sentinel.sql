CREATE TABLE "studios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"studio_name" text NOT NULL,
	"photos" jsonb DEFAULT '[{"url":"https://picsum.photos/seed/picsum/200/300","title":"やま","description":"やま","display_order":1}]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "studios_studio_name_unique" UNIQUE("studio_name")
);
--> statement-breakpoint
ALTER TABLE "studios" ADD CONSTRAINT "studios_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;