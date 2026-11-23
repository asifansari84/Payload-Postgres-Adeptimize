import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "username" varchar;
  -- Existing accounts: Asif gets "asif"; anyone else gets their email name plus ID so it stays unique.
  UPDATE "users" SET "username" = CASE
    WHEN "name" = 'Asif' AND NOT EXISTS (SELECT 1 FROM "users" u2 WHERE u2."name" = 'Asif' AND u2."id" < "users"."id") THEN 'asif'
    ELSE regexp_replace(lower(split_part("email", '@', 1)), '[^a-z0-9._-]', '', 'g') || '-' || "id"
  END;
  ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_media_id_fk";
  
  DROP INDEX "users_username_idx";
  DROP INDEX "users_avatar_idx";
  ALTER TABLE "users" DROP COLUMN "username";
  ALTER TABLE "users" DROP COLUMN "avatar_id";`)
}
