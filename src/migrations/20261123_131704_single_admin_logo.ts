import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Keep a logo uploaded to the removed dark-theme field.
  await db.execute(sql`
   UPDATE "site_settings" SET "admin_logo_id" = "admin_logo_dark_id" WHERE "admin_logo_id" IS NULL;
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_admin_logo_dark_id_media_id_fk";
  
  DROP INDEX "site_settings_admin_logo_dark_idx";
  ALTER TABLE "site_settings" DROP COLUMN "admin_logo_dark_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "admin_logo_dark_id" integer;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_admin_logo_dark_id_media_id_fk" FOREIGN KEY ("admin_logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_admin_logo_dark_idx" ON "site_settings" USING btree ("admin_logo_dark_id");`)
}
