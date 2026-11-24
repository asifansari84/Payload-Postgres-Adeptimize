import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "social_facebook" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "social_instagram" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "social_x" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "social_linkedin" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "social_tiktok" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN IF EXISTS "social_facebook";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "social_instagram";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "social_x";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "social_linkedin";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "social_tiktok";`)
}
