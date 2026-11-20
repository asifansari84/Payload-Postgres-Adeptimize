import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_logo_showcase_link_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_service_carousel_services_link_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_header_buttons_link_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_header_menu_link_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_header_menu_button_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_footer_social_platform" AS ENUM('facebook', 'linkedin', 'instagram', 'x', 'youtube', 'behance');
  CREATE TYPE "public"."enum_footer_columns_links_link_type" AS ENUM('page', 'custom');
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"left_highlight" varchar,
  	"right_highlight" varchar,
  	"image_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_showcase_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_logo_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"body" jsonb,
  	"link_type" "enum_pages_blocks_logo_showcase_link_type" DEFAULT 'page',
  	"link_new_tab" boolean,
  	"link_label" varchar,
  	"link_page_id" integer,
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"image_id" integer NOT NULL,
  	"accent_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_differentiators_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"image_id" integer NOT NULL,
  	"thumbnail_id" integer,
  	"tag" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_differentiators" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_image_accordion_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_image_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"company" varchar,
  	"rating" numeric DEFAULT 5
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Success',
  	"title" varchar DEFAULT 'Stories' NOT NULL,
  	"aside" varchar DEFAULT 'Clients Say!',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_service_carousel_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_pages_blocks_service_carousel_services_link_type" DEFAULT 'page',
  	"link_new_tab" boolean,
  	"link_page_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_service_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_strip_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_logo_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "header_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_buttons_link_type" DEFAULT 'page',
  	"link_new_tab" boolean,
  	"link_label" varchar NOT NULL,
  	"link_page_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE "header_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_menu_link_type" DEFAULT 'page',
  	"link_new_tab" boolean,
  	"link_label" varchar NOT NULL,
  	"link_page_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"menu_button_type" "enum_header_menu_button_type" DEFAULT 'page',
  	"menu_button_new_tab" boolean,
  	"menu_button_label" varchar,
  	"menu_button_page_id" integer,
  	"menu_button_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_columns_links_link_type" DEFAULT 'page',
  	"link_new_tab" boolean,
  	"link_label" varchar NOT NULL,
  	"link_page_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "footer_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"cta_eyebrow" varchar DEFAULT 'Do You',
  	"cta_title" varchar DEFAULT 'Have',
  	"cta_aside" varchar DEFAULT 'A Project In Mind?',
  	"text" varchar,
  	"hours_title" varchar DEFAULT 'Working Hours',
  	"contact_title" varchar DEFAULT 'Contact Us',
  	"email" varchar,
  	"phone" varchar,
  	"newsletter_title" varchar DEFAULT 'Newsletter',
  	"newsletter_placeholder" varchar DEFAULT 'Your e-mail',
  	"copyright" varchar DEFAULT 'Copyright © {year}, All rights reserved.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages" ALTER COLUMN "hero_title" DROP NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "hero_text" DROP NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "seo_no_index" boolean;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_showcase_logos" ADD CONSTRAINT "pages_blocks_logo_showcase_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_showcase_logos" ADD CONSTRAINT "pages_blocks_logo_showcase_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_showcase" ADD CONSTRAINT "pages_blocks_logo_showcase_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_showcase" ADD CONSTRAINT "pages_blocks_logo_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_items" ADD CONSTRAINT "pages_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps" ADD CONSTRAINT "pages_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process" ADD CONSTRAINT "pages_blocks_process_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_process" ADD CONSTRAINT "pages_blocks_process_accent_image_id_media_id_fk" FOREIGN KEY ("accent_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_process" ADD CONSTRAINT "pages_blocks_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_differentiators_items" ADD CONSTRAINT "pages_blocks_differentiators_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_differentiators_items" ADD CONSTRAINT "pages_blocks_differentiators_items_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_differentiators_items" ADD CONSTRAINT "pages_blocks_differentiators_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_differentiators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_differentiators" ADD CONSTRAINT "pages_blocks_differentiators_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_accordion_images" ADD CONSTRAINT "pages_blocks_image_accordion_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_accordion_images" ADD CONSTRAINT "pages_blocks_image_accordion_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_accordion" ADD CONSTRAINT "pages_blocks_image_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_carousel_services" ADD CONSTRAINT "pages_blocks_service_carousel_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_carousel_services" ADD CONSTRAINT "pages_blocks_service_carousel_services_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_carousel_services" ADD CONSTRAINT "pages_blocks_service_carousel_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_carousel" ADD CONSTRAINT "pages_blocks_service_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_strip_logos" ADD CONSTRAINT "pages_blocks_logo_strip_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_strip_logos" ADD CONSTRAINT "pages_blocks_logo_strip_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_strip" ADD CONSTRAINT "pages_blocks_logo_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_buttons" ADD CONSTRAINT "header_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_buttons" ADD CONSTRAINT "header_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_menu" ADD CONSTRAINT "header_menu_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_menu" ADD CONSTRAINT "header_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_menu_button_page_id_pages_id_fk" FOREIGN KEY ("menu_button_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_social" ADD CONSTRAINT "footer_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_hours" ADD CONSTRAINT "footer_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_logo_showcase_logos_order_idx" ON "pages_blocks_logo_showcase_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_showcase_logos_parent_id_idx" ON "pages_blocks_logo_showcase_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_showcase_logos_logo_idx" ON "pages_blocks_logo_showcase_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logo_showcase_order_idx" ON "pages_blocks_logo_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_showcase_parent_id_idx" ON "pages_blocks_logo_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_showcase_path_idx" ON "pages_blocks_logo_showcase" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_showcase_link_link_page_idx" ON "pages_blocks_logo_showcase" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_feature_grid_items_order_idx" ON "pages_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_items_parent_id_idx" ON "pages_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_order_idx" ON "pages_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_parent_id_idx" ON "pages_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_path_idx" ON "pages_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_process_steps_order_idx" ON "pages_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_parent_id_idx" ON "pages_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_order_idx" ON "pages_blocks_process" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_parent_id_idx" ON "pages_blocks_process" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_path_idx" ON "pages_blocks_process" USING btree ("_path");
  CREATE INDEX "pages_blocks_process_image_idx" ON "pages_blocks_process" USING btree ("image_id");
  CREATE INDEX "pages_blocks_process_accent_image_idx" ON "pages_blocks_process" USING btree ("accent_image_id");
  CREATE INDEX "pages_blocks_differentiators_items_order_idx" ON "pages_blocks_differentiators_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_differentiators_items_parent_id_idx" ON "pages_blocks_differentiators_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_differentiators_items_image_idx" ON "pages_blocks_differentiators_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_differentiators_items_thumbnail_idx" ON "pages_blocks_differentiators_items" USING btree ("thumbnail_id");
  CREATE INDEX "pages_blocks_differentiators_order_idx" ON "pages_blocks_differentiators" USING btree ("_order");
  CREATE INDEX "pages_blocks_differentiators_parent_id_idx" ON "pages_blocks_differentiators" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_differentiators_path_idx" ON "pages_blocks_differentiators" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_accordion_images_order_idx" ON "pages_blocks_image_accordion_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_accordion_images_parent_id_idx" ON "pages_blocks_image_accordion_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_accordion_images_image_idx" ON "pages_blocks_image_accordion_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_accordion_order_idx" ON "pages_blocks_image_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_accordion_parent_id_idx" ON "pages_blocks_image_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_accordion_path_idx" ON "pages_blocks_image_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_service_carousel_services_order_idx" ON "pages_blocks_service_carousel_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_carousel_services_parent_id_idx" ON "pages_blocks_service_carousel_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_carousel_services_image_idx" ON "pages_blocks_service_carousel_services" USING btree ("image_id");
  CREATE INDEX "pages_blocks_service_carousel_services_link_link_page_idx" ON "pages_blocks_service_carousel_services" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_service_carousel_order_idx" ON "pages_blocks_service_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_carousel_parent_id_idx" ON "pages_blocks_service_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_carousel_path_idx" ON "pages_blocks_service_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_logo_strip_logos_order_idx" ON "pages_blocks_logo_strip_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_strip_logos_parent_id_idx" ON "pages_blocks_logo_strip_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_strip_logos_logo_idx" ON "pages_blocks_logo_strip_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logo_strip_order_idx" ON "pages_blocks_logo_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_strip_parent_id_idx" ON "pages_blocks_logo_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_strip_path_idx" ON "pages_blocks_logo_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "header_buttons_order_idx" ON "header_buttons" USING btree ("_order");
  CREATE INDEX "header_buttons_parent_id_idx" ON "header_buttons" USING btree ("_parent_id");
  CREATE INDEX "header_buttons_link_link_page_idx" ON "header_buttons" USING btree ("link_page_id");
  CREATE INDEX "header_menu_order_idx" ON "header_menu" USING btree ("_order");
  CREATE INDEX "header_menu_parent_id_idx" ON "header_menu" USING btree ("_parent_id");
  CREATE INDEX "header_menu_link_link_page_idx" ON "header_menu" USING btree ("link_page_id");
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE INDEX "header_menu_button_menu_button_page_idx" ON "header" USING btree ("menu_button_page_id");
  CREATE INDEX "footer_social_order_idx" ON "footer_social" USING btree ("_order");
  CREATE INDEX "footer_social_parent_id_idx" ON "footer_social" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_link_link_page_idx" ON "footer_columns_links" USING btree ("link_page_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_hours_order_idx" ON "footer_hours" USING btree ("_order");
  CREATE INDEX "footer_hours_parent_id_idx" ON "footer_hours" USING btree ("_parent_id");
  CREATE INDEX "footer_logo_idx" ON "footer" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_showcase_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_feature_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_differentiators_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_differentiators" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_accordion_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_accordion" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_carousel_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_service_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_strip_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_menu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_hours" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_logo_showcase_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_showcase" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_items" CASCADE;
  DROP TABLE "pages_blocks_feature_grid" CASCADE;
  DROP TABLE "pages_blocks_process_steps" CASCADE;
  DROP TABLE "pages_blocks_process" CASCADE;
  DROP TABLE "pages_blocks_differentiators_items" CASCADE;
  DROP TABLE "pages_blocks_differentiators" CASCADE;
  DROP TABLE "pages_blocks_image_accordion_images" CASCADE;
  DROP TABLE "pages_blocks_image_accordion" CASCADE;
  DROP TABLE "pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_service_carousel_services" CASCADE;
  DROP TABLE "pages_blocks_service_carousel" CASCADE;
  DROP TABLE "pages_blocks_logo_strip_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_strip" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "header_buttons" CASCADE;
  DROP TABLE "header_menu" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_social" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_hours" CASCADE;
  DROP TABLE "footer" CASCADE;
  ALTER TABLE "pages" ALTER COLUMN "hero_title" SET NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "hero_text" SET NOT NULL;
  ALTER TABLE "pages" DROP COLUMN "seo_no_index";
  DROP TYPE "public"."enum_pages_blocks_logo_showcase_link_type";
  DROP TYPE "public"."enum_pages_blocks_service_carousel_services_link_type";
  DROP TYPE "public"."enum_header_buttons_link_type";
  DROP TYPE "public"."enum_header_menu_link_type";
  DROP TYPE "public"."enum_header_menu_button_type";
  DROP TYPE "public"."enum_footer_social_platform";
  DROP TYPE "public"."enum_footer_columns_links_link_type";`)
}
