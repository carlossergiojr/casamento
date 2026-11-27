ALTER TABLE "convites" ADD COLUMN "visto_em" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "convites" ADD COLUMN "ultima_visita_em" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "convites" ADD COLUMN "visitas" integer DEFAULT 0 NOT NULL;