import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "pages_locations_points_items" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_locations_marquee_link_page_id_pages_id_fk";
  
  DROP INDEX IF EXISTS "pages_locations_marquee_link_locations_marquee_link_page_idx";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "locations_header_eyebrow";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "locations_header_intro";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "locations_marquee_text";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "locations_marquee_link_type";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "locations_marquee_link_new_tab";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "locations_marquee_link_page_id";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "locations_marquee_link_url";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "locations_slider_show";
  DROP TYPE IF EXISTS "public"."enum_pages_locations_marquee_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_locations_marquee_link_type" AS ENUM('page', 'custom');
  CREATE TABLE "pages_locations_points_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  ALTER TABLE "pages" ADD COLUMN "locations_header_eyebrow" varchar DEFAULT 'Adeptimize';
  ALTER TABLE "pages" ADD COLUMN "locations_header_intro" varchar;
  ALTER TABLE "pages" ADD COLUMN "locations_marquee_text" varchar DEFAULT 'Let''s Start';
  ALTER TABLE "pages" ADD COLUMN "locations_marquee_link_type" "enum_pages_locations_marquee_link_type" DEFAULT 'page';
  ALTER TABLE "pages" ADD COLUMN "locations_marquee_link_new_tab" boolean;
  ALTER TABLE "pages" ADD COLUMN "locations_marquee_link_page_id" integer;
  ALTER TABLE "pages" ADD COLUMN "locations_marquee_link_url" varchar;
  ALTER TABLE "pages" ADD COLUMN "locations_slider_show" boolean DEFAULT true;
  ALTER TABLE "pages_locations_points_items" ADD CONSTRAINT "pages_locations_points_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_locations_points_items_order_idx" ON "pages_locations_points_items" USING btree ("_order");
  CREATE INDEX "pages_locations_points_items_parent_id_idx" ON "pages_locations_points_items" USING btree ("_parent_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_locations_marquee_link_page_id_pages_id_fk" FOREIGN KEY ("locations_marquee_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_locations_marquee_link_locations_marquee_link_page_idx" ON "pages" USING btree ("locations_marquee_link_page_id");`)
}
