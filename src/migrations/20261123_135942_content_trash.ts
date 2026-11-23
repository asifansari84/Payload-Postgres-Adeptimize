import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "services" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "locations" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "services_deleted_at_idx" ON "services" USING btree ("deleted_at");
  CREATE INDEX "locations_deleted_at_idx" ON "locations" USING btree ("deleted_at");
  CREATE INDEX "posts_deleted_at_idx" ON "posts" USING btree ("deleted_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "pages_deleted_at_idx";
  DROP INDEX "services_deleted_at_idx";
  DROP INDEX "locations_deleted_at_idx";
  DROP INDEX "posts_deleted_at_idx";
  ALTER TABLE "pages" DROP COLUMN "deleted_at";
  ALTER TABLE "services" DROP COLUMN "deleted_at";
  ALTER TABLE "locations" DROP COLUMN "deleted_at";
  ALTER TABLE "posts" DROP COLUMN "deleted_at";`)
}
