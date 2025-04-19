"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string | null;
  onChange?: (date: string | null) => void; // Updated type to string for ISO format
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);

  const handleDateChange = (date: Date) => {
    // Convert the date to ISO format
    const isoDate = date.toISOString();
    setSelectedDate(date);
    onChange && onChange(isoDate); // Pass the ISO string to the onChange handler
    setIsOpen(false); // Close after selecting a date
  };

  const handleMonthNavigation = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subMonths(selectedDate || new Date(), 1) : addMonths(selectedDate || new Date(), 1);
    setSelectedDate(newDate);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Button variant="outline" className="flex items-center justify-between">
          <span>
            {selectedDate ? format(selectedDate, "MM/dd/yyyy") : "Select a date"}
          </span>
          <CalendarIcon className="ml-2 w-4 h-4" />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className={cn("z-50 w-[260px] p-4 bg-white shadow-md rounded-lg dark:bg-gray-800")}
      >
        <div className="flex justify-between mb-4">
          <Button variant="ghost" onClick={() => handleMonthNavigation("prev")}>
            ←
          </Button>
          <span className="text-lg font-medium">
            {format(selectedDate || new Date(), "MMMM yyyy")}
          </span>
          <Button variant="ghost" onClick={() => handleMonthNavigation("next")}>
            →
          </Button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div key={index} className="text-center font-semibold">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
            <Button
              key={day}
              variant="ghost"
              className={cn(
                "w-full py-2 rounded-md",
                selectedDate?.getDate() === day &&
                  selectedDate.getMonth() === new Date().getMonth() &&
                  selectedDate.getFullYear() === new Date().getFullYear()
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              )}
              onClick={() =>
                handleDateChange(
                  new Date(
                    selectedDate?.getFullYear() || new Date().getFullYear(),
                    selectedDate?.getMonth() || new Date().getMonth(),
                    day
                  )
                )
              }
            >
              {day}
            </Button>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default DatePicker;
