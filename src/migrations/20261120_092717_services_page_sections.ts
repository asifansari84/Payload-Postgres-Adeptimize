import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Our Services page: image banner, intro with counters, services slider and call to action. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN CREATE TYPE "public"."enum_pages_services_cta_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE TABLE IF NOT EXISTS "pages_services_intro_counters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"suffix" varchar,
  	"label" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_header_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_intro_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_intro_text" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_slider_heading" varchar DEFAULT 'Explore *More Services*';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_cta_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_cta_badge_text" varchar DEFAULT 'Get Started Now';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_cta_link_type" "enum_pages_services_cta_link_type" DEFAULT 'page';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_cta_link_new_tab" boolean;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_cta_link_page_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_cta_link_url" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_cta_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_cta_background_id" integer;
  DO $$ BEGIN ALTER TABLE "pages_services_intro_counters" ADD CONSTRAINT "pages_services_intro_counters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "pages_services_intro_counters_order_idx" ON "pages_services_intro_counters" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_services_intro_counters_parent_id_idx" ON "pages_services_intro_counters" USING btree ("_parent_id");
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_services_header_image_id_media_id_fk" FOREIGN KEY ("services_header_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_services_cta_link_page_id_pages_id_fk" FOREIGN KEY ("services_cta_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_services_cta_image_id_media_id_fk" FOREIGN KEY ("services_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_services_cta_background_id_media_id_fk" FOREIGN KEY ("services_cta_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "pages_services_header_services_header_image_idx" ON "pages" USING btree ("services_header_image_id");
  CREATE INDEX IF NOT EXISTS "pages_services_cta_link_services_cta_link_page_idx" ON "pages" USING btree ("services_cta_link_page_id");
  CREATE INDEX IF NOT EXISTS "pages_services_cta_services_cta_image_idx" ON "pages" USING btree ("services_cta_image_id");
  CREATE INDEX IF NOT EXISTS "pages_services_cta_services_cta_background_idx" ON "pages" USING btree ("services_cta_background_id");
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "services_header_eyebrow";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_services_intro_counters" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_services_intro_counters" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_services_header_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_services_cta_link_page_id_pages_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_services_cta_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_services_cta_background_id_media_id_fk";
  
  DROP INDEX "pages_services_header_services_header_image_idx";
  DROP INDEX "pages_services_cta_link_services_cta_link_page_idx";
  DROP INDEX "pages_services_cta_services_cta_image_idx";
  DROP INDEX "pages_services_cta_services_cta_background_idx";
  ALTER TABLE "pages" ADD COLUMN "services_header_eyebrow" varchar DEFAULT 'Adeptimize';
  ALTER TABLE "pages" DROP COLUMN "services_header_image_id";
  ALTER TABLE "pages" DROP COLUMN "services_intro_heading";
  ALTER TABLE "pages" DROP COLUMN "services_intro_text";
  ALTER TABLE "pages" DROP COLUMN "services_slider_heading";
  ALTER TABLE "pages" DROP COLUMN "services_cta_heading";
  ALTER TABLE "pages" DROP COLUMN "services_cta_badge_text";
  ALTER TABLE "pages" DROP COLUMN "services_cta_link_type";
  ALTER TABLE "pages" DROP COLUMN "services_cta_link_new_tab";
  ALTER TABLE "pages" DROP COLUMN "services_cta_link_page_id";
  ALTER TABLE "pages" DROP COLUMN "services_cta_link_url";
  ALTER TABLE "pages" DROP COLUMN "services_cta_image_id";
  ALTER TABLE "pages" DROP COLUMN "services_cta_background_id";
  DROP TYPE "public"."enum_pages_services_cta_link_type";`)
}
