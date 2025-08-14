"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "@/components/button";
import { ChevronsUpDown, Search } from "lucide-react";
import { Input } from "./input";

// Lista de ícones disponíveis (apenas alguns exemplos, você pode adicionar mais)
const ICONS = [
  'home', 'shopping-cart', 'utensils', 'car', 'film', 'music', 'book', 'heart', 'gift', 'coffee',
  'dollar-sign', 'credit-card', 'shopping-bag', 'tag', 'package', 'box', 'layers', 'folder', 'file', 'folder-plus',
  'calendar', 'clock', 'bell', 'star', 'thumbs-up', 'message-square', 'mail', 'phone', 'camera', 'image',
  'video', 'mic', 'headphones', 'tv', 'monitor', 'printer', 'cpu', 'smartphone', 'tablet', 'wifi',
  'bluetooth', 'battery', 'database', 'hard-drive', 'server', 'cloud', 'sun', 'moon', 'droplet', 'wind',
  'umbrella', 'flame', 'tree', 'leaf', 'compass', 'map-pin', 'navigation', 'map', 'globe', 'anchor',
  'briefcase', 'gift', 'heart', 'star', 'bell', 'mail', 'phone', 'camera', 'video', 'mic',
  'headphones', 'tv', 'monitor', 'printer', 'cpu', 'smartphone', 'tablet', 'wifi', 'bluetooth', 'battery'
].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicatas

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  color?: string; // Nova prop para a cor de destaque
}

export function IconPicker({ value, onChange, className, color = '#3b82f6' }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  
  // Função para importar dinamicamente o ícone
  const IconComponent = ({ name, className, color }: { name: string; className?: string; color?: string }) => {
    // @ts-ignore - Importação dinâmica de ícones
    const Icon = require(`lucide-react`)[name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())];
    return Icon ? <Icon className={cn("h-4 w-4", className)} style={{ color }} /> : <span className="h-4 w-4" style={{ color }} />;
  };

  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredIcons = ICONS.filter(icon => 
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value ? (
            <div className="flex items-center gap-2">
              <IconComponent name={value} color={color} />
              <span className="truncate">{value}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Selecione um ícone...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] flex flex-col" 
        align="start" 
        side="bottom"
        onInteractOutside={(e) => {
          // Evita fechar ao clicar dentro do popover
          const target = e.target as HTMLElement;
          if (target && target.closest) {
            if (target.closest('.icon-picker-content')) {
              e.preventDefault();
            }
          }
        }}
      >
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar ícone..."
              className="w-full pl-9 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="relative flex-1 flex flex-col">
          <div 
            className="flex-1 overflow-y-auto p-2 icon-picker-content"
            style={{
              WebkitOverflowScrolling: 'touch',
              maxHeight: '300px',
              minHeight: '200px'
            }}
            onWheel={(e) => {
              e.stopPropagation();
              e.currentTarget.scrollTop += e.deltaY;
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {filteredIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => {
                    onChange(icon);
                    setOpen(false);
                  }}
                  className={cn(
                    "group flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-md cursor-pointer",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                    value === icon 
                      ? `bg-[${color}]/10` 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  title={icon}
                  style={{
                    ...(value === icon && {
                      '--tw-ring-color': color,
                      '--tw-ring-offset-color': 'hsl(var(--background))',
                    } as React.CSSProperties)
                  }}
                >
                  <div className="relative">
                    <IconComponent 
                      name={icon} 
                      className="h-4 sm:h-5 w-4 sm:w-5 transition-colors" 
                      color={value === icon ? color : undefined}
                    />
                  </div>
                  <span className="mt-1 text-[10px] sm:text-xs truncate w-full text-center">
                    {icon.length > 6 ? `${icon.substring(0, 4)}...` : icon}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-2 border-t text-xs text-muted-foreground text-center bg-background z-10">
            <span className="hidden sm:inline">Role para ver mais ícones</span>
            <span className="sm:hidden">Deslize para ver mais</span>
          </div>
        </div>
        {filteredIcons.length === 0 && (
          <div className="py-6 text-center text-sm text-muted-foreground px-3">
            Nenhum ícone encontrado. Tente outra busca.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
