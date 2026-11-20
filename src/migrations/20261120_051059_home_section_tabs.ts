import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Homepage section tabs: removes the unused hero description/button fields
 * and moves the "Industry leaders" (logo showcase) and "Problems we solve"
 * (first feature grid) sections out of the page builder into their own tabs.
 * Idempotent so it also runs on databases created with dev push mode.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_trust_link_type" AS ENUM('page', 'custom');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  CREATE TABLE IF NOT EXISTS "pages_trust_logos" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "logo_id" integer,
    "name" varchar
  );
  CREATE TABLE IF NOT EXISTS "pages_problems_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "text" varchar
  );

  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_hero_primary_button_page_id_pages_id_fk";
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_hero_secondary_button_page_id_pages_id_fk";
  DROP INDEX IF EXISTS "pages_hero_primary_button_hero_primary_button_page_idx";
  DROP INDEX IF EXISTS "pages_hero_secondary_button_hero_secondary_button_page_idx";

  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "trust_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "trust_body" jsonb;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "trust_link_type" "enum_pages_trust_link_type" DEFAULT 'page';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "trust_link_new_tab" boolean;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "trust_link_label" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "trust_link_page_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "trust_link_url" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "problems_heading" varchar;

  DO $$ BEGIN
    ALTER TABLE "pages_trust_logos" ADD CONSTRAINT "pages_trust_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_trust_logos" ADD CONSTRAINT "pages_trust_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "pages_problems_items" ADD CONSTRAINT "pages_problems_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "pages" ADD CONSTRAINT "pages_trust_link_page_id_pages_id_fk" FOREIGN KEY ("trust_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "pages_trust_logos_order_idx" ON "pages_trust_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_trust_logos_parent_id_idx" ON "pages_trust_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_trust_logos_logo_idx" ON "pages_trust_logos" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "pages_problems_items_order_idx" ON "pages_problems_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_problems_items_parent_id_idx" ON "pages_problems_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_trust_link_trust_link_page_idx" ON "pages" USING btree ("trust_link_page_id");

  ALTER TABLE "pages"
    DROP COLUMN IF EXISTS "hero_description",
    DROP COLUMN IF EXISTS "hero_primary_button_type",
    DROP COLUMN IF EXISTS "hero_primary_button_new_tab",
    DROP COLUMN IF EXISTS "hero_primary_button_label",
    DROP COLUMN IF EXISTS "hero_primary_button_page_id",
    DROP COLUMN IF EXISTS "hero_primary_button_url",
    DROP COLUMN IF EXISTS "hero_secondary_button_type",
    DROP COLUMN IF EXISTS "hero_secondary_button_new_tab",
    DROP COLUMN IF EXISTS "hero_secondary_button_label",
    DROP COLUMN IF EXISTS "hero_secondary_button_page_id",
    DROP COLUMN IF EXISTS "hero_secondary_button_url";
  DROP TYPE IF EXISTS "public"."enum_pages_hero_primary_button_type";
  DROP TYPE IF EXISTS "public"."enum_pages_hero_secondary_button_type";

  -- Move the homepage logo showcase block into the "Industry leaders" tab.
  DROP TABLE IF EXISTS _trust; CREATE TEMP TABLE _trust AS
    SELECT DISTINCT ON (b."_parent_id") b.* FROM "pages_blocks_logo_showcase" b
    JOIN "pages" p ON p."id" = b."_parent_id"
    WHERE p."slug" = 'home' AND p."trust_heading" IS NULL
    ORDER BY b."_parent_id", b."_order";
  UPDATE "pages" p SET
    "trust_heading" = t."heading", "trust_body" = t."body",
    "trust_link_type" = t."link_type"::text::"enum_pages_trust_link_type", "trust_link_new_tab" = t."link_new_tab",
    "trust_link_label" = t."link_label", "trust_link_page_id" = t."link_page_id", "trust_link_url" = t."link_url"
  FROM _trust t WHERE p."id" = t."_parent_id";
  INSERT INTO "pages_trust_logos" ("_order", "_parent_id", "id", "logo_id", "name")
    SELECT l."_order", t."_parent_id", l."id", l."logo_id", l."name"
    FROM "pages_blocks_logo_showcase_logos" l JOIN _trust t ON l."_parent_id" = t."id"
  ON CONFLICT ("id") DO NOTHING;
  DELETE FROM "pages_blocks_logo_showcase_logos" WHERE "_parent_id" IN (SELECT "id" FROM _trust);
  DELETE FROM "pages_blocks_logo_showcase" WHERE "id" IN (SELECT "id" FROM _trust);

  -- Move the first homepage feature grid into the "Problems we solve" tab.
  DROP TABLE IF EXISTS _problems; CREATE TEMP TABLE _problems AS
    SELECT DISTINCT ON (b."_parent_id") b.* FROM "pages_blocks_feature_grid" b
    JOIN "pages" p ON p."id" = b."_parent_id"
    WHERE p."slug" = 'home' AND p."problems_heading" IS NULL
      AND NOT EXISTS (SELECT 1 FROM "pages_problems_items" i WHERE i."_parent_id" = p."id")
    ORDER BY b."_parent_id", b."_order";
  UPDATE "pages" p SET "problems_heading" = g."heading" FROM _problems g WHERE p."id" = g."_parent_id";
  INSERT INTO "pages_problems_items" ("_order", "_parent_id", "id", "title", "text")
    SELECT i."_order", g."_parent_id", i."id", i."title", i."text"
    FROM "pages_blocks_feature_grid_items" i JOIN _problems g ON i."_parent_id" = g."id"
  ON CONFLICT ("id") DO NOTHING;
  DELETE FROM "pages_blocks_feature_grid_items" WHERE "_parent_id" IN (SELECT "id" FROM _problems);
  DELETE FROM "pages_blocks_feature_grid" WHERE "id" IN (SELECT "id" FROM _problems);
  DROP TABLE _trust; DROP TABLE _problems;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_primary_button_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_pages_hero_secondary_button_type" AS ENUM('page', 'custom');
  ALTER TABLE "pages_trust_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_problems_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_trust_logos" CASCADE;
  DROP TABLE "pages_problems_items" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_trust_link_page_id_pages_id_fk";
  
  DROP INDEX "pages_trust_link_trust_link_page_idx";
  ALTER TABLE "pages" ADD COLUMN "hero_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_primary_button_type" "enum_pages_hero_primary_button_type" DEFAULT 'page';
  ALTER TABLE "pages" ADD COLUMN "hero_primary_button_new_tab" boolean;
  ALTER TABLE "pages" ADD COLUMN "hero_primary_button_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_primary_button_page_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_primary_button_url" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_secondary_button_type" "enum_pages_hero_secondary_button_type" DEFAULT 'page';
  ALTER TABLE "pages" ADD COLUMN "hero_secondary_button_new_tab" boolean;
  ALTER TABLE "pages" ADD COLUMN "hero_secondary_button_label" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_secondary_button_page_id" integer;
  ALTER TABLE "pages" ADD COLUMN "hero_secondary_button_url" varchar;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_primary_button_page_id_pages_id_fk" FOREIGN KEY ("hero_primary_button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_secondary_button_page_id_pages_id_fk" FOREIGN KEY ("hero_secondary_button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_primary_button_hero_primary_button_page_idx" ON "pages" USING btree ("hero_primary_button_page_id");
  CREATE INDEX "pages_hero_secondary_button_hero_secondary_button_page_idx" ON "pages" USING btree ("hero_secondary_button_page_id");
  ALTER TABLE "pages" DROP COLUMN "trust_heading";
  ALTER TABLE "pages" DROP COLUMN "trust_body";
  ALTER TABLE "pages" DROP COLUMN "trust_link_type";
  ALTER TABLE "pages" DROP COLUMN "trust_link_new_tab";
  ALTER TABLE "pages" DROP COLUMN "trust_link_label";
  ALTER TABLE "pages" DROP COLUMN "trust_link_page_id";
  ALTER TABLE "pages" DROP COLUMN "trust_link_url";
  ALTER TABLE "pages" DROP COLUMN "problems_heading";
  DROP TYPE "public"."enum_pages_trust_link_type";`)
}
