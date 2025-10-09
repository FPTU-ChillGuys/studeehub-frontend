CREATE TABLE "embeddings" (
	"id" varchar PRIMARY KEY NOT NULL,
	"resource_id" varchar,
	"content" varchar NOT NULL,
	"vector" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" varchar PRIMARY KEY NOT NULL,
	"file_name" varchar NOT NULL,
	"url" varchar NOT NULL,
	"type" varchar NOT NULL,
	"content" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "embeddings" USING hnsw ("vector" vector_cosine_ops);