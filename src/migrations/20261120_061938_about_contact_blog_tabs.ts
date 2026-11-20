import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Section tabs for About Us, Contact Us and Blog; removes the legacy imported-markup fields. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN CREATE TYPE "public"."enum_pages_about_founder_social_platform" AS ENUM('linkedin', 'facebook', 'instagram', 'x', 'youtube', 'behance'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_about_intro_button_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE TABLE IF NOT EXISTS "pages_about_intro_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"image_id" integer,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages_about_values_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages_about_founder_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_pages_about_founder_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages_about_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_about_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"company" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_about_testimonials_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_contact_expect_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
    DROP TABLE IF EXISTS "pages_sections" CASCADE;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_header_eyebrow" varchar DEFAULT 'Adeptimize';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_header_title" varchar DEFAULT 'About Us';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_intro_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_intro_text" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_intro_button_type" "enum_pages_about_intro_button_type" DEFAULT 'page';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_intro_button_new_tab" boolean;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_intro_button_label" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_intro_button_page_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_intro_button_url" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_intro_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_founder_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_founder_role" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_founder_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_highlights_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_testimonials_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "about_testimonials_badge_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_header_eyebrow" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_header_title" varchar DEFAULT 'Contact Us';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_intro_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_intro_subheading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_intro_text" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_intro_form_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_details_heading" varchar DEFAULT 'Contact Information';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_details_address" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_details_email" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_details_phone" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_details_hours_heading" varchar DEFAULT 'Business Hours';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_details_hours" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_details_note" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_expect_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_cta_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_cta_text" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_cta_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "blog_header_eyebrow" varchar DEFAULT 'Insights';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "blog_header_title" varchar DEFAULT 'Blogs';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "blog_header_intro" varchar;
  DO $$ BEGIN ALTER TABLE "pages_about_intro_stats" ADD CONSTRAINT "pages_about_intro_stats_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_about_intro_stats" ADD CONSTRAINT "pages_about_intro_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_about_values_items" ADD CONSTRAINT "pages_about_values_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_about_founder_social" ADD CONSTRAINT "pages_about_founder_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_about_highlights_items" ADD CONSTRAINT "pages_about_highlights_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_about_highlights_items" ADD CONSTRAINT "pages_about_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_about_testimonials_items" ADD CONSTRAINT "pages_about_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_about_testimonials_logos" ADD CONSTRAINT "pages_about_testimonials_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_about_testimonials_logos" ADD CONSTRAINT "pages_about_testimonials_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_contact_expect_items" ADD CONSTRAINT "pages_contact_expect_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "pages_about_intro_stats_order_idx" ON "pages_about_intro_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_about_intro_stats_parent_id_idx" ON "pages_about_intro_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_about_intro_stats_image_idx" ON "pages_about_intro_stats" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_about_values_items_order_idx" ON "pages_about_values_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_about_values_items_parent_id_idx" ON "pages_about_values_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_about_founder_social_order_idx" ON "pages_about_founder_social" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_about_founder_social_parent_id_idx" ON "pages_about_founder_social" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_about_highlights_items_order_idx" ON "pages_about_highlights_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_about_highlights_items_parent_id_idx" ON "pages_about_highlights_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_about_highlights_items_icon_idx" ON "pages_about_highlights_items" USING btree ("icon_id");
  CREATE INDEX IF NOT EXISTS "pages_about_testimonials_items_order_idx" ON "pages_about_testimonials_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_about_testimonials_items_parent_id_idx" ON "pages_about_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_about_testimonials_logos_order_idx" ON "pages_about_testimonials_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_about_testimonials_logos_parent_id_idx" ON "pages_about_testimonials_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_about_testimonials_logos_logo_idx" ON "pages_about_testimonials_logos" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "pages_contact_expect_items_order_idx" ON "pages_contact_expect_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_contact_expect_items_parent_id_idx" ON "pages_contact_expect_items" USING btree ("_parent_id");
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_about_intro_button_page_id_pages_id_fk" FOREIGN KEY ("about_intro_button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_about_intro_image_id_media_id_fk" FOREIGN KEY ("about_intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_about_founder_image_id_media_id_fk" FOREIGN KEY ("about_founder_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_about_testimonials_image_id_media_id_fk" FOREIGN KEY ("about_testimonials_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_about_testimonials_badge_id_media_id_fk" FOREIGN KEY ("about_testimonials_badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_contact_intro_form_id_forms_id_fk" FOREIGN KEY ("contact_intro_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_contact_cta_image_id_media_id_fk" FOREIGN KEY ("contact_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "pages_about_intro_button_about_intro_button_page_idx" ON "pages" USING btree ("about_intro_button_page_id");
  CREATE INDEX IF NOT EXISTS "pages_about_intro_about_intro_image_idx" ON "pages" USING btree ("about_intro_image_id");
  CREATE INDEX IF NOT EXISTS "pages_about_founder_about_founder_image_idx" ON "pages" USING btree ("about_founder_image_id");
  CREATE INDEX IF NOT EXISTS "pages_about_testimonials_about_testimonials_image_idx" ON "pages" USING btree ("about_testimonials_image_id");
  CREATE INDEX IF NOT EXISTS "pages_about_testimonials_about_testimonials_badge_idx" ON "pages" USING btree ("about_testimonials_badge_id");
  CREATE INDEX IF NOT EXISTS "pages_contact_intro_contact_intro_form_idx" ON "pages" USING btree ("contact_intro_form_id");
  CREATE INDEX IF NOT EXISTS "pages_contact_cta_contact_cta_image_idx" ON "pages" USING btree ("contact_cta_image_id");
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_title";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "hero_text";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "source_html";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  ALTER TABLE "pages_about_intro_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_about_values_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_about_founder_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_about_highlights_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_about_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_about_testimonials_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_contact_expect_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_about_intro_stats" CASCADE;
  DROP TABLE "pages_about_values_items" CASCADE;
  DROP TABLE "pages_about_founder_social" CASCADE;
  DROP TABLE "pages_about_highlights_items" CASCADE;
  DROP TABLE "pages_about_testimonials_items" CASCADE;
  DROP TABLE "pages_about_testimonials_logos" CASCADE;
  DROP TABLE "pages_contact_expect_items" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_about_intro_button_page_id_pages_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_about_intro_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_about_founder_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_about_testimonials_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_about_testimonials_badge_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_contact_intro_form_id_forms_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_contact_cta_image_id_media_id_fk";
  
  DROP INDEX "pages_about_intro_button_about_intro_button_page_idx";
  DROP INDEX "pages_about_intro_about_intro_image_idx";
  DROP INDEX "pages_about_founder_about_founder_image_idx";
  DROP INDEX "pages_about_testimonials_about_testimonials_image_idx";
  DROP INDEX "pages_about_testimonials_about_testimonials_badge_idx";
  DROP INDEX "pages_contact_intro_contact_intro_form_idx";
  DROP INDEX "pages_contact_cta_contact_cta_image_idx";
  ALTER TABLE "pages" ADD COLUMN "hero_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_text" varchar;
  ALTER TABLE "pages" ADD COLUMN "source_html" varchar;
  ALTER TABLE "pages_sections" ADD CONSTRAINT "pages_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_sections_order_idx" ON "pages_sections" USING btree ("_order");
  CREATE INDEX "pages_sections_parent_id_idx" ON "pages_sections" USING btree ("_parent_id");
  ALTER TABLE "pages" DROP COLUMN "about_header_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "about_header_title";
  ALTER TABLE "pages" DROP COLUMN "about_intro_heading";
  ALTER TABLE "pages" DROP COLUMN "about_intro_text";
  ALTER TABLE "pages" DROP COLUMN "about_intro_button_type";
  ALTER TABLE "pages" DROP COLUMN "about_intro_button_new_tab";
  ALTER TABLE "pages" DROP COLUMN "about_intro_button_label";
  ALTER TABLE "pages" DROP COLUMN "about_intro_button_page_id";
  ALTER TABLE "pages" DROP COLUMN "about_intro_button_url";
  ALTER TABLE "pages" DROP COLUMN "about_intro_image_id";
  ALTER TABLE "pages" DROP COLUMN "about_founder_heading";
  ALTER TABLE "pages" DROP COLUMN "about_founder_role";
  ALTER TABLE "pages" DROP COLUMN "about_founder_image_id";
  ALTER TABLE "pages" DROP COLUMN "about_highlights_heading";
  ALTER TABLE "pages" DROP COLUMN "about_testimonials_image_id";
  ALTER TABLE "pages" DROP COLUMN "about_testimonials_badge_id";
  ALTER TABLE "pages" DROP COLUMN "contact_header_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "contact_header_title";
  ALTER TABLE "pages" DROP COLUMN "contact_intro_heading";
  ALTER TABLE "pages" DROP COLUMN "contact_intro_subheading";
  ALTER TABLE "pages" DROP COLUMN "contact_intro_text";
  ALTER TABLE "pages" DROP COLUMN "contact_intro_form_id";
  ALTER TABLE "pages" DROP COLUMN "contact_details_heading";
  ALTER TABLE "pages" DROP COLUMN "contact_details_address";
  ALTER TABLE "pages" DROP COLUMN "contact_details_email";
  ALTER TABLE "pages" DROP COLUMN "contact_details_phone";
  ALTER TABLE "pages" DROP COLUMN "contact_details_hours_heading";
  ALTER TABLE "pages" DROP COLUMN "contact_details_hours";
  ALTER TABLE "pages" DROP COLUMN "contact_details_note";
  ALTER TABLE "pages" DROP COLUMN "contact_expect_heading";
  ALTER TABLE "pages" DROP COLUMN "contact_cta_heading";
  ALTER TABLE "pages" DROP COLUMN "contact_cta_text";
  ALTER TABLE "pages" DROP COLUMN "contact_cta_image_id";
  ALTER TABLE "pages" DROP COLUMN "blog_header_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "blog_header_title";
  ALTER TABLE "pages" DROP COLUMN "blog_header_intro";
  DROP TYPE "public"."enum_pages_about_founder_social_platform";
  DROP TYPE "public"."enum_pages_about_intro_button_type";`)
}
