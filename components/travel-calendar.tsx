"use client";
import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { format, parseISO, startOfDay } from "date-fns";
import { CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import "react-day-picker/style.css";
export function TravelCalendar({
  start,
  end,
  onChange,
  single = false,
  hotel = true,
}: {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
  single?: boolean;
  hotel?: boolean;
}) {
  const [open, setOpen] = useState(false),
    [range, setRange] = useState<DateRange | undefined>({
      from: parseISO(start),
      to: parseISO(end),
    });
  const [month, setMonth] = useState(parseISO(start));
  function show() {
    setRange({ from: parseISO(start), to: single ? undefined : parseISO(end) });
    setMonth(parseISO(start));
    setOpen(true);
  }
  return (
    <>
      <button type="button" className="date-range-trigger" onClick={show}>
        <CalendarDays size={20} />
        <span>
          <small>{hotel ? "Check-in" : "Departure"}</small>
          <b>{format(parseISO(start), "dd MMM yyyy")}</b>
        </span>
        {!single && (
          <>
            <span className="date-arrow">→</span>
            <span>
              <small>{hotel ? "Check-out" : "Return"}</small>
              <b>{format(parseISO(end), "dd MMM yyyy")}</b>
            </span>
          </>
        )}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="travel-calendar-dialog">
          <DialogHeader>
            <DialogTitle>Make time for a little getaway.</DialogTitle>
            <DialogDescription>
              {single
                ? "Choose your departure date."
                : "Choose your arrival date, then your departure date."}
            </DialogDescription>
          </DialogHeader>
          <div className="calendar-heading">
            <b>Calendar</b>
            <span>
              {range?.from ? format(range.from, "dd MMM") : "Arrival"}
              {!single &&
                ` — ${range?.to ? format(range.to, "dd MMM") : "Departure"}`}
            </span>
          </div>
          <div className="calendar-scroll">
            {single ? (
              <DayPicker
                mode="single"
                selected={range?.from}
                onSelect={(d) => setRange({ from: d })}
                month={month}
                onMonthChange={setMonth}
                numberOfMonths={2}
                weekStartsOn={1}
                disabled={{ before: startOfDay(new Date()) }}
              />
            ) : (
              <DayPicker
                mode="range"
                min={1}
                selected={range}
                onSelect={setRange}
                month={month}
                onMonthChange={setMonth}
                numberOfMonths={2}
                weekStartsOn={1}
                disabled={{ before: startOfDay(new Date()) }}
              />
            )}
          </div>
          <div className="calendar-footer">
            <span>
              {!single && range?.from && range.to
                ? `${Math.round((range.to.getTime() - range.from.getTime()) / 86400000)} nights`
                : "Exact dates"}
              <small>Dates and availability are illustrative</small>
            </span>
            <button
              type="button"
              className="primary"
              disabled={!range?.from || (!single && !range?.to)}
              onClick={() => {
                if (range?.from) {
                  onChange(
                    format(range.from, "yyyy-MM-dd"),
                    format(range.to || range.from, "yyyy-MM-dd"),
                  );
                  setOpen(false);
                }
              }}
            >
              Apply dates
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
