"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { subDays } from "date-fns";

interface SingleDatePickerProps {
  value: Date;
  onChange: (date: Date | undefined) => void;
}

export function SingleDatePicker({ value, onChange }: SingleDatePickerProps) {
  const today = new Date();
  const yesterday = subDays(today, 1);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-4",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex max-sm:flex-col">
            <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
              <div className="h-full sm:border-e">
                <div className="flex flex-col px-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onChange(today)}
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onChange(yesterday)}
                  >
                    Ontem
                  </Button>
                </div>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              initialFocus
            />
        </div>
      </PopoverContent>
    </Popover>
  );
}
