import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Services and Locations collections, plus banners for the Our Services and Location pages. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_locations_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE TABLE IF NOT EXISTS "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"banner_eyebrow" varchar,
  	"banner_title" varchar,
  	"banner_intro" varchar,
  	"summary" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_no_index" boolean,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"status" "enum_services_status" DEFAULT 'draft' NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"banner_eyebrow" varchar,
  	"banner_title" varchar,
  	"banner_intro" varchar,
  	"summary" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_no_index" boolean,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"status" "enum_locations_status" DEFAULT 'draft' NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_header_eyebrow" varchar DEFAULT 'Adeptimize';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_header_title" varchar DEFAULT 'Our Services';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_header_intro" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "locations_header_eyebrow" varchar DEFAULT 'Adeptimize';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "locations_header_title" varchar DEFAULT 'Location';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "locations_header_intro" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "locations_id" integer;
  CREATE UNIQUE INDEX IF NOT EXISTS "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "locations_slug_idx" ON "locations" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "locations_created_at_idx" ON "locations" USING btree ("created_at");
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services" CASCADE;
  DROP TABLE "locations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_locations_fk";
  
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_locations_id_idx";
  ALTER TABLE "pages" DROP COLUMN "services_header_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "services_header_title";
  ALTER TABLE "pages" DROP COLUMN "services_header_intro";
  ALTER TABLE "pages" DROP COLUMN "locations_header_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "locations_header_title";
  ALTER TABLE "pages" DROP COLUMN "locations_header_intro";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "locations_id";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum_locations_status";`)
}
