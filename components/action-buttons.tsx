"use client";

import { Button } from "@/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import DatePicker from "@/components/date-picker";
import { 
  RiExpandRightLine, 
  RiAddLine, 
  RiArrowDownLine,
  RiArrowUpLine,
  RiBankCardLine,
  RiExchangeLine
} from "@remixicon/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { CreateExpenseDialog } from "./dialogs/create-expense-dialog";
import { CreateIncomeDialog } from "./dialogs/create-income-dialog";
import { CreateCreditCardExpenseDialog } from "./dialogs/create-credit-card-expense-dialog";
import { CreateTransferDialog } from "./dialogs/create-transfer-dialog";

export function ActionButtons() {
  const isMobile = useIsMobile();

  return (
    <div className="flex gap-3">
      <DatePicker />
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="aspect-square max-lg:p-0">
              <RiExpandRightLine
                className="lg:-ms-1 opacity-40 size-5"
                size={20}
                aria-hidden="true"
              />
              <span className="max-lg:sr-only">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="lg:hidden" hidden={isMobile}>
            Export
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenu>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button className="aspect-square max-lg:p-0">
                  <RiAddLine
                    className="lg:-ms-1 size-5"
                    size={20}
                    aria-hidden="true"
                  />
                  <span className="max-lg:sr-only font-normal">Adicionar Transação</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent className="lg:hidden" hidden={isMobile}>
              Adicionar Transação
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent 
          align="end" 
          className="w-48 bg-popover text-popover-foreground shadow-lg rounded-md border border-border p-1"
          sideOffset={8}
        >
          <CreateExpenseDialog>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 px-3 py-2 text-sm font-normal hover:bg-accent hover:text-accent-foreground rounded-[4px] cursor-pointer">
              <RiArrowDownLine className="size-4 text-[var(--chart-4)]" />
              <span>Despesa</span>
            </DropdownMenuItem>
          </CreateExpenseDialog>
          <CreateIncomeDialog>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 px-3 py-2 text-sm font-normal hover:bg-accent hover:text-accent-foreground rounded-[4px] cursor-pointer">
              <RiArrowUpLine className="size-4 text-[var(--chart-6)]" />
              <span>Receita</span>
            </DropdownMenuItem>
          </CreateIncomeDialog>
          <CreateCreditCardExpenseDialog>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 px-3 py-2 text-sm font-normal hover:bg-accent hover:text-accent-foreground rounded-[4px] cursor-pointer">
              <RiBankCardLine className="size-4 text-orange-500" />
              <span>Despesa cartão</span>
            </DropdownMenuItem>
          </CreateCreditCardExpenseDialog>
          <CreateTransferDialog>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 px-3 py-2 text-sm font-normal hover:bg-accent hover:text-accent-foreground rounded-[4px] cursor-pointer">
              <RiExchangeLine className="size-4 text-[var(--chart-1)]" />
              <span>Transferência</span>
            </DropdownMenuItem>
          </CreateTransferDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
