import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_trust_logos" ADD COLUMN IF NOT EXISTS "url" varchar;
  ALTER TABLE "pages_trust_logos" DROP COLUMN IF EXISTS "name";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_trust_logos" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "pages_trust_logos" DROP COLUMN "url";`)
}
