import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import UnderConstruction from "../under-construction";

export const metadata: Metadata = {
  title: "Relatórios | Aplicativo Financeiro",
};

export default function RelatoriosPage() {
  return (
    <PageLayout 
      title="Relatórios"
    >
      <UnderConstruction />
    </PageLayout>
  );
}
