import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Full-screen menu: sub-menu links, contact panel, images and social links in the Header global. */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN CREATE TYPE "public"."enum_header_menu_children_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_header_social_platform" AS ENUM('facebook', 'linkedin', 'instagram', 'x', 'youtube', 'behance'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE TABLE IF NOT EXISTS "header_menu_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_menu_children_link_type" DEFAULT 'page',
  	"link_new_tab" boolean,
  	"link_label" varchar NOT NULL,
  	"link_page_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "header_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_header_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "header" DROP CONSTRAINT IF EXISTS "header_menu_button_page_id_pages_id_fk";
  
  DROP INDEX IF EXISTS "header_menu_button_menu_button_page_idx";
  ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "menu_logo_id" integer;
  ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "phone" varchar;
  ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "email" varchar;
  ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "menu_image1_id" integer;
  ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "menu_image2_id" integer;
  ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "chat_title" varchar DEFAULT 'We are much closer';
  ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "chat_text" varchar DEFAULT 'Contact us via Telegram';
  ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "chat_url" varchar;
  DO $$ BEGIN ALTER TABLE "header_menu_children" ADD CONSTRAINT "header_menu_children_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "header_menu_children" ADD CONSTRAINT "header_menu_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_menu"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "header_social" ADD CONSTRAINT "header_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "header_menu_children_order_idx" ON "header_menu_children" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_menu_children_parent_id_idx" ON "header_menu_children" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_menu_children_link_link_page_idx" ON "header_menu_children" USING btree ("link_page_id");
  CREATE INDEX IF NOT EXISTS "header_social_order_idx" ON "header_social" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_social_parent_id_idx" ON "header_social" USING btree ("_parent_id");
  DO $$ BEGIN ALTER TABLE "header" ADD CONSTRAINT "header_menu_logo_id_media_id_fk" FOREIGN KEY ("menu_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "header" ADD CONSTRAINT "header_menu_image1_id_media_id_fk" FOREIGN KEY ("menu_image1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "header" ADD CONSTRAINT "header_menu_image2_id_media_id_fk" FOREIGN KEY ("menu_image2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "header_menu_logo_idx" ON "header" USING btree ("menu_logo_id");
  CREATE INDEX IF NOT EXISTS "header_menu_image1_idx" ON "header" USING btree ("menu_image1_id");
  CREATE INDEX IF NOT EXISTS "header_menu_image2_idx" ON "header" USING btree ("menu_image2_id");
  ALTER TABLE "header" DROP COLUMN IF EXISTS "menu_button_type";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "menu_button_new_tab";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "menu_button_label";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "menu_button_page_id";
  ALTER TABLE "header" DROP COLUMN IF EXISTS "menu_button_url";
  DROP TYPE IF EXISTS "public"."enum_header_menu_button_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_menu_button_type" AS ENUM('page', 'custom');
  ALTER TABLE "header_menu_children" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_social" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "header_menu_children" CASCADE;
  DROP TABLE "header_social" CASCADE;
  ALTER TABLE "header" DROP CONSTRAINT "header_menu_logo_id_media_id_fk";
  
  ALTER TABLE "header" DROP CONSTRAINT "header_menu_image1_id_media_id_fk";
  
  ALTER TABLE "header" DROP CONSTRAINT "header_menu_image2_id_media_id_fk";
  
  DROP INDEX "header_menu_logo_idx";
  DROP INDEX "header_menu_image1_idx";
  DROP INDEX "header_menu_image2_idx";
  ALTER TABLE "header" ADD COLUMN "menu_button_type" "enum_header_menu_button_type" DEFAULT 'page';
  ALTER TABLE "header" ADD COLUMN "menu_button_new_tab" boolean;
  ALTER TABLE "header" ADD COLUMN "menu_button_label" varchar;
  ALTER TABLE "header" ADD COLUMN "menu_button_page_id" integer;
  ALTER TABLE "header" ADD COLUMN "menu_button_url" varchar;
  ALTER TABLE "header" ADD CONSTRAINT "header_menu_button_page_id_pages_id_fk" FOREIGN KEY ("menu_button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "header_menu_button_menu_button_page_idx" ON "header" USING btree ("menu_button_page_id");
  ALTER TABLE "header" DROP COLUMN "menu_logo_id";
  ALTER TABLE "header" DROP COLUMN "phone";
  ALTER TABLE "header" DROP COLUMN "email";
  ALTER TABLE "header" DROP COLUMN "menu_image1_id";
  ALTER TABLE "header" DROP COLUMN "menu_image2_id";
  ALTER TABLE "header" DROP COLUMN "chat_title";
  ALTER TABLE "header" DROP COLUMN "chat_text";
  ALTER TABLE "header" DROP COLUMN "chat_url";
  DROP TYPE "public"."enum_header_menu_children_link_type";
  DROP TYPE "public"."enum_header_social_platform";`)
}
