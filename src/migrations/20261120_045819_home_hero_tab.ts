import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds the homepage "Hero section" tab (pages.hero_*) and moves the current
 * homepage hero block into it. Written to be safe on databases that were
 * created with dev push mode, so every statement is idempotent.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_hero_primary_button_type" AS ENUM('page', 'custom');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_hero_secondary_button_type" AS ENUM('page', 'custom');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_subtitle" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_headline" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_description" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_left_highlight" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_right_highlight" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_primary_button_type" "enum_pages_hero_primary_button_type" DEFAULT 'page';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_primary_button_new_tab" boolean;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_primary_button_label" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_primary_button_page_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_primary_button_url" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_secondary_button_type" "enum_pages_hero_secondary_button_type" DEFAULT 'page';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_secondary_button_new_tab" boolean;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_secondary_button_label" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_secondary_button_page_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "hero_secondary_button_url" varchar;

  DO $$ BEGIN
    ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_primary_button_page_id_pages_id_fk" FOREIGN KEY ("hero_primary_button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_secondary_button_page_id_pages_id_fk" FOREIGN KEY ("hero_secondary_button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;

  CREATE INDEX IF NOT EXISTS "pages_hero_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "pages_hero_primary_button_hero_primary_button_page_idx" ON "pages" USING btree ("hero_primary_button_page_id");
  CREATE INDEX IF NOT EXISTS "pages_hero_secondary_button_hero_secondary_button_page_idx" ON "pages" USING btree ("hero_secondary_button_page_id");

  -- Copy the current homepage hero block into the new Hero section tab.
  UPDATE "pages" p SET
    "hero_headline" = h."title",
    "hero_subtitle" = h."subtitle",
    "hero_left_highlight" = h."left_highlight",
    "hero_right_highlight" = h."right_highlight",
    "hero_image_id" = h."image_id"
  FROM (
    SELECT DISTINCT ON ("_parent_id") * FROM "pages_blocks_hero" ORDER BY "_parent_id", "_order"
  ) h
  WHERE h."_parent_id" = p."id" AND p."slug" = 'home' AND p."hero_headline" IS NULL;

  -- The tab now owns the homepage hero, so drop the duplicate block.
  DELETE FROM "pages_blocks_hero" h USING "pages" p
  WHERE h."_parent_id" = p."id" AND p."slug" = 'home' AND p."hero_headline" IS NOT NULL;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_hero_image_id_media_id_fk";
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_hero_primary_button_page_id_pages_id_fk";
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_hero_secondary_button_page_id_pages_id_fk";
  DROP INDEX IF EXISTS "pages_hero_hero_image_idx";
  DROP INDEX IF EXISTS "pages_hero_primary_button_hero_primary_button_page_idx";
  DROP INDEX IF EXISTS "pages_hero_secondary_button_hero_secondary_button_page_idx";
  ALTER TABLE "pages"
    DROP COLUMN IF EXISTS "hero_subtitle",
    DROP COLUMN IF EXISTS "hero_headline",
    DROP COLUMN IF EXISTS "hero_description",
    DROP COLUMN IF EXISTS "hero_left_highlight",
    DROP COLUMN IF EXISTS "hero_right_highlight",
    DROP COLUMN IF EXISTS "hero_image_id",
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
  DROP TYPE IF EXISTS "public"."enum_pages_hero_secondary_button_type";`)
}
