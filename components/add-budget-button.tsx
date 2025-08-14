"use client";

import { RiAddLine } from "@remixicon/react";
import { CreateBudgetDialog } from "@/components/dialogs/create-budget-dialog";
import { Button } from "@/components/button";
import { ReactNode } from "react";

interface AddBudgetButtonProps {
  children?: ReactNode;
  onBudgetCreated?: () => void;
}

export function AddBudgetButton({ children, onBudgetCreated }: AddBudgetButtonProps) {
  return (
    <CreateBudgetDialog onBudgetCreated={onBudgetCreated}>
      {children || (
        <Button>
          <RiAddLine className="size-5" size={20} aria-hidden="true" />
          <span className="max-lg:sr-only font-normal">Adicionar Orçamento</span>
        </Button>
      )}
    </CreateBudgetDialog>
  );
}
