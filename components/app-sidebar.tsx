"use client";

import * as React from "react";
import Link from "next/link";

import { NavUser } from "@/components/nav-user";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/sidebar";
import {
  RiDashboardLine,
  RiBankLine,
  RiBankCardLine,
  RiPieChartLine,
  RiExchangeLine,
  RiMoneyDollarBoxLine,
  RiFileList3Line,
  RiSettings3Line,
} from "@remixicon/react";

// This is sample data.
interface NavItem {
  title: string;
  url: string;
  icon: any; // Usando 'any' temporariamente para resolver o erro de tipagem
  isActive?: boolean;
  items?: NavItem[]; // Adicionando suporte a subitens
  className?: string; // Para estilização personalizada
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavData {
  navMain: NavGroup[];
}

const data: NavData = {
  navMain: [
    {
      title: "Visão Geral",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: RiDashboardLine,
          isActive: false,
        },
      ],
    },
    {
      title: "Transações",
      items: [
        {
          title: "Transações",
          url: "/transacoes",
          icon: RiExchangeLine,
          isActive: false,
        },
        {
          title: "Contas Bancárias",
          url: "/contas",
          icon: RiBankLine,
          isActive: false,
        },
        {
          title: "Cartões de Crédito",
          url: "/cartoes",
          icon: RiBankCardLine,
          isActive: false,
          items: [
            {
              title: "Faturas",
              url: "/faturas",
              icon: RiFileList3Line,
              isActive: false,
              className: "ml-1" // Recuo mínimo para o subitem
            }
          ]
        },
      ],
    },
    {
      title: "Orçamento",
      items: [
        {
          title: "Orçamento",
          url: "/orcamento",
          icon: RiMoneyDollarBoxLine,
          isActive: false,
        },
        {
          title: "Categorias",
          url: "/categorias",
          icon: RiPieChartLine,
          isActive: false,
        },
      ],
    },
    {
      title: "Relatórios",
      items: [
        {
          title: "Relatórios",
          url: "/relatorios",
          icon: RiPieChartLine,
          isActive: false,
        },
      ],
    },
  ],
};

function SidebarLogo() {
  const id = React.useId();
  return (
    <div className="flex gap-2 px-2 group-data-[collapsible=icon]:px-0 transition-[padding] duration-200 ease-in-out">
      <Link className="group/logo inline-flex" href="/">
        <span className="sr-only">Logo</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 36 36"
          className="size-9 group-data-[collapsible=icon]:size-8 transition-[width,height] duration-200 ease-in-out"
        >
          <path
            fill={`url(#${id})`}
            fillRule="evenodd"
            d="M12.972 2a6.806 6.806 0 0 0-4.813 1.993L2 10.153v2.819c0 1.991.856 3.783 2.22 5.028A6.788 6.788 0 0 0 2 23.028v2.82l6.16 6.159A6.806 6.806 0 0 0 18 31.78a6.806 6.806 0 0 0 9.841.226L34 25.847v-2.819A6.788 6.788 0 0 0 31.78 18 6.788 6.788 0 0 0 34 12.972v-2.82l-6.159-6.159A6.806 6.806 0 0 0 18 4.22 6.788 6.788 0 0 0 12.972 2Zm9.635 16a6.741 6.741 0 0 1-.226-.216L18 13.403l-4.381 4.381a6.741 6.741 0 0 1-.226.216c.077.07.152.142.226.216L18 22.597l4.381-4.381c.074-.074.15-.146.226-.216Zm-2.83 7.848v1.346a3.25 3.25 0 0 0 5.55 2.298l5.117-5.117v-1.347a3.25 3.25 0 0 0-5.549-2.298l-5.117 5.117Zm-3.555 0-5.117-5.118a3.25 3.25 0 0 0-5.55 2.298v1.347l5.118 5.117a3.25 3.25 0 0 0 5.55-2.298v-1.346Zm0-17.042v1.347l-5.117 5.117a3.25 3.25 0 0 1-5.55-2.298v-1.347l5.118-5.117a3.25 3.25 0 0 1 5.55 2.298Zm8.673 6.464-5.117-5.117V8.806a3.25 3.25 0 0 1 5.549-2.298l5.117 5.117v1.347a3.25 3.25 0 0 1-5.549 2.298Z"
            clipRule="evenodd"
          />
          <defs>
            <linearGradient
              id={id}
              x1="18"
              x2="18"
              y1="2"
              y2="34"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F4F4F5" />
              <stop offset="1" stopColor="#A1A1AA" />
            </linearGradient>
          </defs>
        </svg>
      </Link>
    </div>
  );
}

// Função para renderizar itens do menu, incluindo subitens
function renderNavItem(item: NavItem, pathname: string) {
  const isItemActive = pathname === item.url || 
    (item.items && item.items.some(subItem => pathname === subItem.url));
  
  return (
    <React.Fragment key={item.url}>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className={`group/menu-button group-data-[collapsible=icon]:px-[5px]! font-medium gap-3 h-9 [&>svg]:size-auto ${item.className || ''}`}
          tooltip={item.title}
          isActive={isItemActive}
        >
          <Link href={item.url} className="w-full flex items-center">
            {item.icon && (
              <item.icon
                className={`text-muted-foreground/65 ${isItemActive ? 'text-primary' : ''}`}
                size={22}
                aria-hidden={true}
              />
            )}
            <span className={isItemActive ? 'text-primary font-medium' : ''}>
              {item.title}
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {/* Renderizar subitens se existirem */}
      {item.items && item.items.length > 0 && (
        <div className="ml-2 border-l border-muted pl-1">
          {item.items.map(subItem => renderNavItem(subItem, pathname))}
        </div>
      )}
    </React.Fragment>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 justify-center">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/65">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => renderNavItem(item, pathname))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
