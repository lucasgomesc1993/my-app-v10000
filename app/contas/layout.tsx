import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contas Bancárias | Aplicativo Financeiro",
  description: "Gerencie suas contas bancárias e defina suas contas favoritas para agilizar suas transações.",
};

export default function ContasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
