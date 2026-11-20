import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Location page: highlights, scrolling banner and slider; slider images and icons on each location. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN CREATE TYPE "public"."enum_pages_locations_marquee_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_locations_slide_icon_animation" AS ENUM('hang', 'pulse', 'spin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE TABLE IF NOT EXISTS "pages_locations_points_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  ALTER TABLE "pages" ALTER COLUMN "locations_header_title" SET DEFAULT 'Locations We Serve';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "locations_marquee_text" varchar DEFAULT 'Let''s Start';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "locations_marquee_link_type" "enum_pages_locations_marquee_link_type" DEFAULT 'page';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "locations_marquee_link_new_tab" boolean;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "locations_marquee_link_page_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "locations_marquee_link_url" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "locations_slider_show" boolean DEFAULT true;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "locations_slider_interval" numeric DEFAULT 5;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "slide_image_id" integer;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "slide_icon_id" integer;
  ALTER TABLE "locations" ADD COLUMN IF NOT EXISTS "slide_icon_animation" "enum_locations_slide_icon_animation" DEFAULT 'hang';
  DO $$ BEGIN ALTER TABLE "pages_locations_points_items" ADD CONSTRAINT "pages_locations_points_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "pages_locations_points_items_order_idx" ON "pages_locations_points_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_locations_points_items_parent_id_idx" ON "pages_locations_points_items" USING btree ("_parent_id");
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_locations_marquee_link_page_id_pages_id_fk" FOREIGN KEY ("locations_marquee_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations" ADD CONSTRAINT "locations_slide_image_id_media_id_fk" FOREIGN KEY ("slide_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "locations" ADD CONSTRAINT "locations_slide_icon_id_media_id_fk" FOREIGN KEY ("slide_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "pages_locations_marquee_link_locations_marquee_link_page_idx" ON "pages" USING btree ("locations_marquee_link_page_id");
  CREATE INDEX IF NOT EXISTS "locations_slide_image_idx" ON "locations" USING btree ("slide_image_id");
  CREATE INDEX IF NOT EXISTS "locations_slide_icon_idx" ON "locations" USING btree ("slide_icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_locations_points_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_locations_points_items" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_locations_marquee_link_page_id_pages_id_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_slide_image_id_media_id_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_slide_icon_id_media_id_fk";
  
  DROP INDEX "pages_locations_marquee_link_locations_marquee_link_page_idx";
  DROP INDEX "locations_slide_image_idx";
  DROP INDEX "locations_slide_icon_idx";
  ALTER TABLE "pages" ALTER COLUMN "locations_header_title" SET DEFAULT 'Location';
  ALTER TABLE "pages" DROP COLUMN "locations_marquee_text";
  ALTER TABLE "pages" DROP COLUMN "locations_marquee_link_type";
  ALTER TABLE "pages" DROP COLUMN "locations_marquee_link_new_tab";
  ALTER TABLE "pages" DROP COLUMN "locations_marquee_link_page_id";
  ALTER TABLE "pages" DROP COLUMN "locations_marquee_link_url";
  ALTER TABLE "pages" DROP COLUMN "locations_slider_show";
  ALTER TABLE "pages" DROP COLUMN "locations_slider_interval";
  ALTER TABLE "locations" DROP COLUMN "slide_image_id";
  ALTER TABLE "locations" DROP COLUMN "slide_icon_id";
  ALTER TABLE "locations" DROP COLUMN "slide_icon_animation";
  DROP TYPE "public"."enum_pages_locations_marquee_link_type";
  DROP TYPE "public"."enum_locations_slide_icon_animation";`)
}
