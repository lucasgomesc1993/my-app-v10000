"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { Calendar } from "@/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function DatePicker() {
  const today = new Date();
  const yesterday = {
    from: subDays(today, 1),
    to: subDays(today, 1),
  };
  const last7Days = {
    from: subDays(today, 6),
    to: today,
  };
  const last30Days = {
    from: subDays(today, 29),
    to: today,
  };
  const monthToDate = {
    from: startOfMonth(today),
    to: today,
  };
  const lastMonth = {
    from: startOfMonth(subMonths(today, 1)),
    to: endOfMonth(subMonths(today, 1)),
  };
  const yearToDate = {
    from: startOfYear(today),
    to: today,
  };
  const lastYear = {
    from: startOfYear(subYears(today, 1)),
    to: endOfYear(subYears(today, 1)),
  };
  const [month, setMonth] = useState(today);

  const [date, setDate] = useState<DateRange | undefined>(lastYear);

  return (
    <div className="*:not-first:mt-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start min-w-62">
            <CalendarIcon
              size={16}
              className="opacity-40 -ms-1 group-hover:text-foreground shrink-0 transition-colors"
              aria-hidden="true"
            />
            <span className={cn("truncate", !date && "text-muted-foreground")}>
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd 'de' LLL, y", { locale: ptBR })} -{" "}
                    {format(date.to, "dd 'de' LLL, y", { locale: ptBR })}
                  </>
                ) : (
                  format(date.from, "dd 'de' LLL, y", { locale: ptBR })
                )
              ) : (
                "Escolha um período"
              )}
            </span>
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
                    onClick={() => {
                      setDate({
                        from: today,
                        to: today,
                      });
                      setMonth(today);
                    }}
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setDate(yesterday);
                      setMonth(yesterday.to);
                    }}
                  >
                    Ontem
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setDate(last7Days);
                      setMonth(last7Days.to);
                    }}
                  >
                    Últimos 7 dias
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setDate(last30Days);
                      setMonth(last30Days.to);
                    }}
                  >
                    Últimos 30 dias
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setDate(monthToDate);
                      setMonth(monthToDate.to);
                    }}
                  >
                    Este mês
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setDate(lastMonth);
                      setMonth(lastMonth.to);
                    }}
                  >
                    Mês passado
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setDate(yearToDate);
                      setMonth(yearToDate.to);
                    }}
                  >
                    Este ano
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setDate(lastYear);
                      setMonth(lastYear.to);
                    }}
                  >
                    Ano passado
                  </Button>
                </div>
              </div>
            </div>
            <Calendar
              locale={ptBR}
              mode="range"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) {
                  setDate(newDate);
                }
              }}
              month={month}
              onMonthChange={setMonth}
              className="p-2"
              disabled={[
                { after: today }, // Dates before today
              ]}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
