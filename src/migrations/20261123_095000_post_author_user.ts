import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Post author becomes a link to a user account. Existing posts (imported as the text
// "Adeptimize") are credited to the Asif account, or the oldest user if that name is gone.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "author_id" integer;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  UPDATE "posts" SET "author_id" = (SELECT "id" FROM "users" ORDER BY ("name" = 'Asif') DESC, "id" ASC LIMIT 1);
  ALTER TABLE "posts" DROP COLUMN "author";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "author" varchar;
  UPDATE "posts" SET "author" = "users"."name" FROM "users" WHERE "users"."id" = "posts"."author_id";
  ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_users_id_fk";
  DROP INDEX "posts_author_idx";
  ALTER TABLE "posts" DROP COLUMN "author_id";`)
}
