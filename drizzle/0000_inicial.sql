CREATE TABLE "convites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"codigo" text NOT NULL,
	"titular" text NOT NULL,
	"telefone" text DEFAULT '' NOT NULL,
	"lado" text DEFAULT 'Os dois' NOT NULL,
	"obs" text DEFAULT '' NOT NULL,
	"restricao" text DEFAULT '' NOT NULL,
	"respondido_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "convites_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "gastos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item" text NOT NULL,
	"fornecedor" text DEFAULT '' NOT NULL,
	"previsto" integer DEFAULT 0 NOT NULL,
	"pago" integer DEFAULT 0 NOT NULL,
	"vencimento" date,
	"estimado" boolean DEFAULT false NOT NULL,
	"obs" text DEFAULT '' NOT NULL,
	"ordem" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo" text DEFAULT '' NOT NULL,
	"texto" text DEFAULT '' NOT NULL,
	"ordem" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pessoas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"convite_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"ordem" integer NOT NULL,
	"resposta" text DEFAULT 'pendente' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tarefas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo" text NOT NULL,
	"nota" text DEFAULT '' NOT NULL,
	"fase" text NOT NULL,
	"categoria" text DEFAULT '' NOT NULL,
	"feita" boolean DEFAULT false NOT NULL,
	"urgente" boolean DEFAULT false NOT NULL,
	"ordem" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tentativas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"chave" text NOT NULL,
	"tipo" text NOT NULL,
	"criada_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pessoas" ADD CONSTRAINT "pessoas_convite_id_convites_id_fk" FOREIGN KEY ("convite_id") REFERENCES "public"."convites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pessoas_convite_idx" ON "pessoas" USING btree ("convite_id");--> statement-breakpoint
CREATE INDEX "tentativas_idx" ON "tentativas" USING btree ("tipo","chave","criada_em");