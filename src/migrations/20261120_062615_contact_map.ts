import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_details_show_map" boolean DEFAULT true;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "contact_details_map_location" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN IF EXISTS "contact_details_show_map";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "contact_details_map_location";`)
}
