"use client";

import React, { ReactNode } from "react";
import { SidebarTrigger } from "@/components/sidebar";
import { ActionButtons } from "@/components/action-buttons";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  actionButtons?: ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  title,
  actionButtons,
  className = "",
}: PageLayoutProps) {
  return (
    <div className={cn("flex flex-col h-full", className)} suppressHydrationWarning>
      {/* Header com Título e Botões de Ação */}
      <header className="w-full border-b">
        <div className="flex items-center justify-between min-h-20 py-4 px-4 md:px-6 lg:px-8 mx-auto w-full max-w-6xl">
          {/* Lado Esquerdo - Título */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ms-1" />
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>

          {/* Lado Direito - Botões de Ação */}
          <div className="flex items-center">
            {actionButtons || <ActionButtons />}
          </div>
        </div>
      </header>

      {/* Conteúdo da Página */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
