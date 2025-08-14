import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { Chart01 } from "@/components/chart-01";
import { Chart02 } from "@/components/chart-02";
import { Chart03 } from "@/components/chart-03";
import { Chart04 } from "@/components/chart-04";
import { Chart05 } from "@/components/chart-05";
import { Chart06 } from "@/components/chart-06";
import { KPICards } from "@/components/kpi-cards";

export const metadata: Metadata = {
  title: "Dashboard | Aplicativo Financeiro",
};

export default function Page() {
  return (
    <PageLayout 
      title="Dashboard"
    >
      <div className="overflow-hidden">
        <div className="grid gap-6">
          <KPICards />
          <div className="grid auto-rows-min @2xl:grid-cols-2 *:-ms-px *:-mt-px -m-px">
            <Chart01 />
            <Chart02 />
            <Chart03 />
            <Chart04 />
            <Chart05 />
            <Chart06 />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
