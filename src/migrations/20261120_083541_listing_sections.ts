import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Page sections for services and locations, plus a card image for the services slider. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN CREATE TYPE "public"."enum_services_intro_button_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_services_benefits_button_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_locations_intro_button_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE TABLE IF NOT EXISTS "services_intro_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "services_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "services_spotlight_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"company" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "services_benefits_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "services_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "services_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "locations_intro_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "locations_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "locations_offerings_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "locations_results_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "locations_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"company" varchar,
  	"rating" numeric DEFAULT 5
  );
  
  CREATE TABLE IF NOT EXISTS "locations_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "banner_image_id" integer;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "intro_heading" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "intro_quote" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "intro_text" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "intro_button_type" "enum_services_intro_button_type" DEFAULT 'page';
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "intro_button_new_tab" boolean;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "intro_button_label" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "intro_button_page_id" integer;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "intro_button_url" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "highlights_heading" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "spotlight_image_id" integer;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "spotlight_badge_id" integer;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "benefits_heading" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "benefits_button_type" "enum_services_benefits_button_type" DEFAULT 'page';
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "benefits_button_new_tab" boolean;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "benefits_button_label" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "benefits_button_page_id" integer;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "benefits_button_url" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "process_heading" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "process_image_id" integer;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "process_accent_image_id" integer;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "faq_heading" varchar DEFAULT 'Frequently Asked Questions';
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "more_services_show" boolean DEFAULT true;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "more_services_heading" varchar DEFAULT 'Explore *More Services*';
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "strategy_show" boolean DEFAULT true;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "strategy_heading" varchar DEFAULT 'Build Your Market *Strategy*';
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "strategy_text" varchar;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "strategy_image_id" integer;
  ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "card_image_id" integer;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "banner_image_id" integer;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "intro_heading" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "intro_quote" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "intro_text" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "intro_button_type" "enum_locations_intro_button_type" DEFAULT 'page';
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "intro_button_new_tab" boolean;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "intro_button_label" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "intro_button_page_id" integer;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "intro_button_url" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "highlights_heading" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "offerings_heading" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "results_heading" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "results_text" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "more_services_show" boolean DEFAULT true;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "more_services_heading" varchar DEFAULT 'Explore *More Services*';
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "testimonials_eyebrow" varchar DEFAULT 'Success';
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "testimonials_title" varchar DEFAULT 'Stories';
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "testimonials_aside" varchar DEFAULT 'Clients Say!';
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "faq_heading" varchar DEFAULT 'Frequently Asked Questions';
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "strategy_show" boolean DEFAULT true;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "strategy_heading" varchar DEFAULT 'Build Your Market *Strategy*';
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "strategy_text" varchar;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "strategy_image_id" integer;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "card_image_id" integer;
  DO $$ BEGIN ALTER TABLE "services_intro_images" ADD CONSTRAINT "services_intro_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services_intro_images" ADD CONSTRAINT "services_intro_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services_highlights_items" ADD CONSTRAINT "services_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services_spotlight_items" ADD CONSTRAINT "services_spotlight_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services_benefits_items" ADD CONSTRAINT "services_benefits_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services_benefits_items" ADD CONSTRAINT "services_benefits_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services_process_steps" ADD CONSTRAINT "services_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services_faq_items" ADD CONSTRAINT "services_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations_intro_images" ADD CONSTRAINT "locations_intro_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations_intro_images" ADD CONSTRAINT "locations_intro_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations_highlights_items" ADD CONSTRAINT "locations_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations_offerings_items" ADD CONSTRAINT "locations_offerings_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations_offerings_items" ADD CONSTRAINT "locations_offerings_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations_results_stats" ADD CONSTRAINT "locations_results_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations_testimonials_items" ADD CONSTRAINT "locations_testimonials_items_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations_testimonials_items" ADD CONSTRAINT "locations_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations_faq_items" ADD CONSTRAINT "locations_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "services_intro_images_order_idx" ON "services_intro_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_intro_images_parent_id_idx" ON "services_intro_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_intro_images_image_idx" ON "services_intro_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "services_highlights_items_order_idx" ON "services_highlights_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_highlights_items_parent_id_idx" ON "services_highlights_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_spotlight_items_order_idx" ON "services_spotlight_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_spotlight_items_parent_id_idx" ON "services_spotlight_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_benefits_items_order_idx" ON "services_benefits_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_benefits_items_parent_id_idx" ON "services_benefits_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_benefits_items_image_idx" ON "services_benefits_items" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "services_process_steps_order_idx" ON "services_process_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_process_steps_parent_id_idx" ON "services_process_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "services_faq_items_order_idx" ON "services_faq_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "services_faq_items_parent_id_idx" ON "services_faq_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "locations_intro_images_order_idx" ON "locations_intro_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "locations_intro_images_parent_id_idx" ON "locations_intro_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "locations_intro_images_image_idx" ON "locations_intro_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "locations_highlights_items_order_idx" ON "locations_highlights_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "locations_highlights_items_parent_id_idx" ON "locations_highlights_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "locations_offerings_items_order_idx" ON "locations_offerings_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "locations_offerings_items_parent_id_idx" ON "locations_offerings_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "locations_offerings_items_image_idx" ON "locations_offerings_items" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "locations_results_stats_order_idx" ON "locations_results_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "locations_results_stats_parent_id_idx" ON "locations_results_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "locations_testimonials_items_order_idx" ON "locations_testimonials_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "locations_testimonials_items_parent_id_idx" ON "locations_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "locations_testimonials_items_photo_idx" ON "locations_testimonials_items" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "locations_faq_items_order_idx" ON "locations_faq_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "locations_faq_items_parent_id_idx" ON "locations_faq_items" USING btree ("_parent_id");
  DO $$ BEGIN ALTER TABLE "services" ADD CONSTRAINT "services_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services" ADD CONSTRAINT "services_intro_button_page_id_pages_id_fk" FOREIGN KEY ("intro_button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services" ADD CONSTRAINT "services_spotlight_image_id_media_id_fk" FOREIGN KEY ("spotlight_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services" ADD CONSTRAINT "services_spotlight_badge_id_media_id_fk" FOREIGN KEY ("spotlight_badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services" ADD CONSTRAINT "services_benefits_button_page_id_pages_id_fk" FOREIGN KEY ("benefits_button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services" ADD CONSTRAINT "services_process_image_id_media_id_fk" FOREIGN KEY ("process_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services" ADD CONSTRAINT "services_process_accent_image_id_media_id_fk" FOREIGN KEY ("process_accent_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services" ADD CONSTRAINT "services_strategy_image_id_media_id_fk" FOREIGN KEY ("strategy_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "services" ADD CONSTRAINT "services_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations" ADD CONSTRAINT "locations_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations" ADD CONSTRAINT "locations_intro_button_page_id_pages_id_fk" FOREIGN KEY ("intro_button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations" ADD CONSTRAINT "locations_strategy_image_id_media_id_fk" FOREIGN KEY ("strategy_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations" ADD CONSTRAINT "locations_card_image_id_media_id_fk" FOREIGN KEY ("card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "services_banner_banner_image_idx" ON "services" USING btree ("banner_image_id");
  CREATE INDEX IF NOT EXISTS "services_intro_button_intro_button_page_idx" ON "services" USING btree ("intro_button_page_id");
  CREATE INDEX IF NOT EXISTS "services_spotlight_spotlight_image_idx" ON "services" USING btree ("spotlight_image_id");
  CREATE INDEX IF NOT EXISTS "services_spotlight_spotlight_badge_idx" ON "services" USING btree ("spotlight_badge_id");
  CREATE INDEX IF NOT EXISTS "services_benefits_button_benefits_button_page_idx" ON "services" USING btree ("benefits_button_page_id");
  CREATE INDEX IF NOT EXISTS "services_process_process_image_idx" ON "services" USING btree ("process_image_id");
  CREATE INDEX IF NOT EXISTS "services_process_process_accent_image_idx" ON "services" USING btree ("process_accent_image_id");
  CREATE INDEX IF NOT EXISTS "services_strategy_strategy_image_idx" ON "services" USING btree ("strategy_image_id");
  CREATE INDEX IF NOT EXISTS "services_card_image_idx" ON "services" USING btree ("card_image_id");
  CREATE INDEX IF NOT EXISTS "locations_banner_banner_image_idx" ON "locations" USING btree ("banner_image_id");
  CREATE INDEX IF NOT EXISTS "locations_intro_button_intro_button_page_idx" ON "locations" USING btree ("intro_button_page_id");
  CREATE INDEX IF NOT EXISTS "locations_strategy_strategy_image_idx" ON "locations" USING btree ("strategy_image_id");
  CREATE INDEX IF NOT EXISTS "locations_card_image_idx" ON "locations" USING btree ("card_image_id");
  ALTER TABLE "services" DROP COLUMN IF EXISTS "banner_eyebrow";
  ALTER TABLE "locations" DROP COLUMN IF EXISTS "banner_eyebrow";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_intro_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_highlights_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_spotlight_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_benefits_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_intro_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_highlights_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_offerings_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_results_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_faq_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_intro_images" CASCADE;
  DROP TABLE "services_highlights_items" CASCADE;
  DROP TABLE "services_spotlight_items" CASCADE;
  DROP TABLE "services_benefits_items" CASCADE;
  DROP TABLE "services_process_steps" CASCADE;
  DROP TABLE "services_faq_items" CASCADE;
  DROP TABLE "locations_intro_images" CASCADE;
  DROP TABLE "locations_highlights_items" CASCADE;
  DROP TABLE "locations_offerings_items" CASCADE;
  DROP TABLE "locations_results_stats" CASCADE;
  DROP TABLE "locations_testimonials_items" CASCADE;
  DROP TABLE "locations_faq_items" CASCADE;
  ALTER TABLE "services" DROP CONSTRAINT "services_banner_image_id_media_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT "services_intro_button_page_id_pages_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT "services_spotlight_image_id_media_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT "services_spotlight_badge_id_media_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT "services_benefits_button_page_id_pages_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT "services_process_image_id_media_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT "services_process_accent_image_id_media_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT "services_strategy_image_id_media_id_fk";
  
  ALTER TABLE "services" DROP CONSTRAINT "services_card_image_id_media_id_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_banner_image_id_media_id_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_intro_button_page_id_pages_id_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_strategy_image_id_media_id_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_card_image_id_media_id_fk";
  
  DROP INDEX "services_banner_banner_image_idx";
  DROP INDEX "services_intro_button_intro_button_page_idx";
  DROP INDEX "services_spotlight_spotlight_image_idx";
  DROP INDEX "services_spotlight_spotlight_badge_idx";
  DROP INDEX "services_benefits_button_benefits_button_page_idx";
  DROP INDEX "services_process_process_image_idx";
  DROP INDEX "services_process_process_accent_image_idx";
  DROP INDEX "services_strategy_strategy_image_idx";
  DROP INDEX "services_card_image_idx";
  DROP INDEX "locations_banner_banner_image_idx";
  DROP INDEX "locations_intro_button_intro_button_page_idx";
  DROP INDEX "locations_strategy_strategy_image_idx";
  DROP INDEX "locations_card_image_idx";
  ALTER TABLE "services" ADD COLUMN "banner_eyebrow" varchar;
  ALTER TABLE "locations" ADD COLUMN "banner_eyebrow" varchar;
  ALTER TABLE "services" DROP COLUMN "banner_image_id";
  ALTER TABLE "services" DROP COLUMN "intro_heading";
  ALTER TABLE "services" DROP COLUMN "intro_quote";
  ALTER TABLE "services" DROP COLUMN "intro_text";
  ALTER TABLE "services" DROP COLUMN "intro_button_type";
  ALTER TABLE "services" DROP COLUMN "intro_button_new_tab";
  ALTER TABLE "services" DROP COLUMN "intro_button_label";
  ALTER TABLE "services" DROP COLUMN "intro_button_page_id";
  ALTER TABLE "services" DROP COLUMN "intro_button_url";
  ALTER TABLE "services" DROP COLUMN "highlights_heading";
  ALTER TABLE "services" DROP COLUMN "spotlight_image_id";
  ALTER TABLE "services" DROP COLUMN "spotlight_badge_id";
  ALTER TABLE "services" DROP COLUMN "benefits_heading";
  ALTER TABLE "services" DROP COLUMN "benefits_button_type";
  ALTER TABLE "services" DROP COLUMN "benefits_button_new_tab";
  ALTER TABLE "services" DROP COLUMN "benefits_button_label";
  ALTER TABLE "services" DROP COLUMN "benefits_button_page_id";
  ALTER TABLE "services" DROP COLUMN "benefits_button_url";
  ALTER TABLE "services" DROP COLUMN "process_heading";
  ALTER TABLE "services" DROP COLUMN "process_image_id";
  ALTER TABLE "services" DROP COLUMN "process_accent_image_id";
  ALTER TABLE "services" DROP COLUMN "faq_heading";
  ALTER TABLE "services" DROP COLUMN "more_services_show";
  ALTER TABLE "services" DROP COLUMN "more_services_heading";
  ALTER TABLE "services" DROP COLUMN "strategy_show";
  ALTER TABLE "services" DROP COLUMN "strategy_heading";
  ALTER TABLE "services" DROP COLUMN "strategy_text";
  ALTER TABLE "services" DROP COLUMN "strategy_image_id";
  ALTER TABLE "services" DROP COLUMN "card_image_id";
  ALTER TABLE "locations" DROP COLUMN "banner_image_id";
  ALTER TABLE "locations" DROP COLUMN "intro_heading";
  ALTER TABLE "locations" DROP COLUMN "intro_quote";
  ALTER TABLE "locations" DROP COLUMN "intro_text";
  ALTER TABLE "locations" DROP COLUMN "intro_button_type";
  ALTER TABLE "locations" DROP COLUMN "intro_button_new_tab";
  ALTER TABLE "locations" DROP COLUMN "intro_button_label";
  ALTER TABLE "locations" DROP COLUMN "intro_button_page_id";
  ALTER TABLE "locations" DROP COLUMN "intro_button_url";
  ALTER TABLE "locations" DROP COLUMN "highlights_heading";
  ALTER TABLE "locations" DROP COLUMN "offerings_heading";
  ALTER TABLE "locations" DROP COLUMN "results_heading";
  ALTER TABLE "locations" DROP COLUMN "results_text";
  ALTER TABLE "locations" DROP COLUMN "more_services_show";
  ALTER TABLE "locations" DROP COLUMN "more_services_heading";
  ALTER TABLE "locations" DROP COLUMN "testimonials_eyebrow";
  ALTER TABLE "locations" DROP COLUMN "testimonials_title";
  ALTER TABLE "locations" DROP COLUMN "testimonials_aside";
  ALTER TABLE "locations" DROP COLUMN "faq_heading";
  ALTER TABLE "locations" DROP COLUMN "strategy_show";
  ALTER TABLE "locations" DROP COLUMN "strategy_heading";
  ALTER TABLE "locations" DROP COLUMN "strategy_text";
  ALTER TABLE "locations" DROP COLUMN "strategy_image_id";
  ALTER TABLE "locations" DROP COLUMN "card_image_id";
  DROP TYPE "public"."enum_services_intro_button_type";
  DROP TYPE "public"."enum_services_benefits_button_type";
  DROP TYPE "public"."enum_locations_intro_button_type";`)
}
