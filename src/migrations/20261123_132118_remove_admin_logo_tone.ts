import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "admin_logo_tone";
  DROP TYPE "public"."enum_site_settings_admin_logo_tone";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_admin_logo_tone" AS ENUM('light', 'dark');
  ALTER TABLE "site_settings" ADD COLUMN "admin_logo_tone" "enum_site_settings_admin_logo_tone" DEFAULT 'light';`)
}
