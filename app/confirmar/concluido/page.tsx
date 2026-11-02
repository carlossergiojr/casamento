import { Suspense } from "react";
import { TelaSucesso } from "@/components/interno";
import { Concluido } from "./concluido";

export const metadata = { title: "Que alegria! · C & V" };

export default function ConfirmacaoConcluida() {
  return (
    <TelaSucesso
      icone={
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C7A45" strokeWidth="1.5">
          <path d="M5 12.5 L10 17 L19 7" />
        </svg>
      }
    >
      <Suspense>
        <Concluido />
      </Suspense>
    </TelaSucesso>
  );
}
