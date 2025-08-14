"use client";

import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/login"];

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Mostrar loading durante verificação de autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Se for rota pública ou usuário não autenticado, mostrar sem sidebar
  if (isPublicRoute || !isAuthenticated) {
    return <>{children}</>;
  }

  // Se autenticado, mostrar com sidebar (já está no layout pai)
  return <>{children}</>;
}
