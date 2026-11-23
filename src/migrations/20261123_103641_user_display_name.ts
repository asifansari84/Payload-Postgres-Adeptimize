import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "display_name" varchar;
  CREATE INDEX "users_display_name_idx" ON "users" USING btree ("display_name");
  -- Fill in "Name (username)" for existing accounts; new saves keep it in sync via the Users hook.
  UPDATE "users" SET "display_name" = "name" || ' (' || "username" || ')';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "users_display_name_idx";
  ALTER TABLE "users" DROP COLUMN "display_name";`)
}
