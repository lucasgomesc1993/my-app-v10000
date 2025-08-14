"use client";

import { RiAddLine } from "@remixicon/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CreateCategoryDialog } from "@/components/dialogs/create-category-dialog";
import { Button } from "@/components/button";

interface AddCategoryButtonProps {
  onCategoryCreated?: () => void;
}

export function AddCategoryButton({ onCategoryCreated }: AddCategoryButtonProps) {
  const isMobile = useIsMobile();
  
  return (
    <CreateCategoryDialog onCategoryCreated={onCategoryCreated}>
      <Button>
        <RiAddLine className="size-5" size={20} aria-hidden="true" />
        <span className="max-lg:sr-only font-normal">Adicionar Categoria</span>
      </Button>
    </CreateCategoryDialog>
  );
}