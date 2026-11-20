import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Section block on the homepage → the tab that now holds it. */
const HOME_TABS: Record<string, string> = {
  process: 'framework',
  differentiators: 'differentiators',
  imageAccordion: 'challenges',
  featureGrid: 'solutions',
  testimonials: 'testimonials',
  serviceCarousel: 'services',
  logoStrip: 'partners',
  faq: 'faq',
}

/**
 * Gives every homepage section its own tab and moves the remaining page
 * builder sections into them. Idempotent for databases made with dev push.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN CREATE TYPE "public"."enum_pages_services_services_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE TABLE IF NOT EXISTS "pages_framework_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages_differentiators_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"image_id" integer NOT NULL,
  	"thumbnail_id" integer,
  	"tag" varchar,
  	"note" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_challenges_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages_solutions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"company" varchar,
  	"rating" numeric DEFAULT 5
  );
  
  CREATE TABLE IF NOT EXISTS "pages_services_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_pages_services_services_link_type" DEFAULT 'page',
  	"link_new_tab" boolean,
  	"link_page_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pages_partners_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  ALTER TABLE "pages_trust_logos" ALTER COLUMN "logo_id" SET NOT NULL;
  ALTER TABLE "pages_trust_logos" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "pages_problems_items" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_problems_items" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "pages_blocks_logo_showcase_logos" ALTER COLUMN "logo_id" DROP NOT NULL;
  ALTER TABLE "pages_blocks_logo_showcase_logos" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "pages_blocks_logo_showcase" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_feature_grid_items" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_feature_grid_items" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "pages_blocks_process_steps" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_process_steps" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "pages_blocks_process" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_process" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "pages_blocks_differentiators_items" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_differentiators_items" ALTER COLUMN "body" DROP NOT NULL;
  ALTER TABLE "pages_blocks_differentiators_items" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "pages_blocks_differentiators" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_image_accordion_images" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "pages_blocks_image_accordion" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_testimonials_items" ALTER COLUMN "quote" DROP NOT NULL;
  ALTER TABLE "pages_blocks_testimonials_items" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "pages_blocks_testimonials" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_service_carousel_services" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_service_carousel" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_logo_strip_logos" ALTER COLUMN "logo_id" DROP NOT NULL;
  ALTER TABLE "pages_blocks_logo_strip_logos" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "pages_blocks_logo_strip" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_faq_items" ALTER COLUMN "question" DROP NOT NULL;
  ALTER TABLE "pages_blocks_faq_items" ALTER COLUMN "answer" DROP NOT NULL;
  ALTER TABLE "pages_blocks_faq" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "framework_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "framework_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "framework_accent_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "differentiators_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "challenges_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "solutions_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "testimonials_eyebrow" varchar DEFAULT 'Success';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "testimonials_title" varchar DEFAULT 'Stories';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "testimonials_aside" varchar DEFAULT 'Clients Say!';
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "services_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "partners_heading" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "partners_text" varchar;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "faq_heading" varchar;
  DO $$ BEGIN ALTER TABLE "pages_framework_steps" ADD CONSTRAINT "pages_framework_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_differentiators_items" ADD CONSTRAINT "pages_differentiators_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_differentiators_items" ADD CONSTRAINT "pages_differentiators_items_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_differentiators_items" ADD CONSTRAINT "pages_differentiators_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_challenges_images" ADD CONSTRAINT "pages_challenges_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_challenges_images" ADD CONSTRAINT "pages_challenges_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_solutions_items" ADD CONSTRAINT "pages_solutions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_testimonials_items" ADD CONSTRAINT "pages_testimonials_items_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_testimonials_items" ADD CONSTRAINT "pages_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_services_services" ADD CONSTRAINT "pages_services_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_services_services" ADD CONSTRAINT "pages_services_services_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_services_services" ADD CONSTRAINT "pages_services_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_partners_logos" ADD CONSTRAINT "pages_partners_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_partners_logos" ADD CONSTRAINT "pages_partners_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages_faq_items" ADD CONSTRAINT "pages_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "pages_framework_steps_order_idx" ON "pages_framework_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_framework_steps_parent_id_idx" ON "pages_framework_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_differentiators_items_order_idx" ON "pages_differentiators_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_differentiators_items_parent_id_idx" ON "pages_differentiators_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_differentiators_items_image_idx" ON "pages_differentiators_items" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_differentiators_items_thumbnail_idx" ON "pages_differentiators_items" USING btree ("thumbnail_id");
  CREATE INDEX IF NOT EXISTS "pages_challenges_images_order_idx" ON "pages_challenges_images" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_challenges_images_parent_id_idx" ON "pages_challenges_images" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_challenges_images_image_idx" ON "pages_challenges_images" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_solutions_items_order_idx" ON "pages_solutions_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_solutions_items_parent_id_idx" ON "pages_solutions_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_testimonials_items_order_idx" ON "pages_testimonials_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_testimonials_items_parent_id_idx" ON "pages_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_testimonials_items_photo_idx" ON "pages_testimonials_items" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "pages_services_services_order_idx" ON "pages_services_services" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_services_services_parent_id_idx" ON "pages_services_services" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_services_services_image_idx" ON "pages_services_services" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_services_services_link_link_page_idx" ON "pages_services_services" USING btree ("link_page_id");
  CREATE INDEX IF NOT EXISTS "pages_partners_logos_order_idx" ON "pages_partners_logos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_partners_logos_parent_id_idx" ON "pages_partners_logos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_partners_logos_logo_idx" ON "pages_partners_logos" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "pages_faq_items_order_idx" ON "pages_faq_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_faq_items_parent_id_idx" ON "pages_faq_items" USING btree ("_parent_id");
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_framework_image_id_media_id_fk" FOREIGN KEY ("framework_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN ALTER TABLE "pages" ADD CONSTRAINT "pages_framework_accent_image_id_media_id_fk" FOREIGN KEY ("framework_accent_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE INDEX IF NOT EXISTS "pages_framework_framework_image_idx" ON "pages" USING btree ("framework_image_id");
  CREATE INDEX IF NOT EXISTS "pages_framework_framework_accent_image_idx" ON "pages" USING btree ("framework_accent_image_id");`)

  const home = (await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, depth: 0, limit: 1, req })).docs[0]
  if (!home?.layout?.length) return

  const data: Record<string, unknown> = {}
  const layout = home.layout.filter((block) => {
    const tab = HOME_TABS[block.blockType]
    if (!tab || tab in data) return true
    const { id: _id, blockType: _type, blockName: _name, ...fields } = block as unknown as Record<string, unknown>
    data[tab] = fields
    return false
  })
  await payload.update({ collection: 'pages', id: home.id, data: { ...data, layout } as never, req })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_framework_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_differentiators_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_challenges_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_solutions_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_services_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_partners_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_faq_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_framework_steps" CASCADE;
  DROP TABLE "pages_differentiators_items" CASCADE;
  DROP TABLE "pages_challenges_images" CASCADE;
  DROP TABLE "pages_solutions_items" CASCADE;
  DROP TABLE "pages_testimonials_items" CASCADE;
  DROP TABLE "pages_services_services" CASCADE;
  DROP TABLE "pages_partners_logos" CASCADE;
  DROP TABLE "pages_faq_items" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_framework_image_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_framework_accent_image_id_media_id_fk";
  
  DROP INDEX "pages_framework_framework_image_idx";
  DROP INDEX "pages_framework_framework_accent_image_idx";
  ALTER TABLE "pages_trust_logos" ALTER COLUMN "logo_id" DROP NOT NULL;
  ALTER TABLE "pages_trust_logos" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "pages_problems_items" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_problems_items" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_logo_showcase_logos" ALTER COLUMN "logo_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_logo_showcase_logos" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "pages_blocks_logo_showcase" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_feature_grid_items" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_feature_grid_items" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "pages_blocks_process_steps" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_process_steps" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "pages_blocks_process" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_process" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_differentiators_items" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_differentiators_items" ALTER COLUMN "body" SET NOT NULL;
  ALTER TABLE "pages_blocks_differentiators_items" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_differentiators" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_image_accordion_images" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_image_accordion" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_testimonials_items" ALTER COLUMN "quote" SET NOT NULL;
  ALTER TABLE "pages_blocks_testimonials_items" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "pages_blocks_testimonials" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_service_carousel_services" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_service_carousel" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_logo_strip_logos" ALTER COLUMN "logo_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_logo_strip_logos" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "pages_blocks_logo_strip" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_faq_items" ALTER COLUMN "question" SET NOT NULL;
  ALTER TABLE "pages_blocks_faq_items" ALTER COLUMN "answer" SET NOT NULL;
  ALTER TABLE "pages_blocks_faq" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages" DROP COLUMN "framework_heading";
  ALTER TABLE "pages" DROP COLUMN "framework_image_id";
  ALTER TABLE "pages" DROP COLUMN "framework_accent_image_id";
  ALTER TABLE "pages" DROP COLUMN "differentiators_heading";
  ALTER TABLE "pages" DROP COLUMN "challenges_heading";
  ALTER TABLE "pages" DROP COLUMN "solutions_heading";
  ALTER TABLE "pages" DROP COLUMN "testimonials_eyebrow";
  ALTER TABLE "pages" DROP COLUMN "testimonials_title";
  ALTER TABLE "pages" DROP COLUMN "testimonials_aside";
  ALTER TABLE "pages" DROP COLUMN "services_heading";
  ALTER TABLE "pages" DROP COLUMN "partners_heading";
  ALTER TABLE "pages" DROP COLUMN "partners_text";
  ALTER TABLE "pages" DROP COLUMN "faq_heading";
  DROP TYPE "public"."enum_pages_services_services_link_type";`)
}
