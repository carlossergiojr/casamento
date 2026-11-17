CREATE TABLE "pagamentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"presente_id" text NOT NULL,
	"nome" text NOT NULL,
	"recado" text DEFAULT '' NOT NULL,
	"valor" integer NOT NULL,
	"status" text DEFAULT 'criado' NOT NULL,
	"mp_preferencia" text,
	"mp_pagamento" text,
	"pago_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "pagamentos_status_idx" ON "pagamentos" USING btree ("status","presente_id");