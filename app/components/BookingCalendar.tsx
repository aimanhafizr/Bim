"use client";

import { useMemo } from "react";
import { ALL_TIME_SLOTS } from "../hallsData";
import { Booking } from "../types";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";

interface BookingCalendarProps {
  selectedHallId: string;
  selectedDate: string;
  selectedSlots: string[];
  onDateChange: (date: string) => void;
  onSlotsChange: (slots: string[]) => void;
  bookings: Booking[];
}

export default function BookingCalendar({
  selectedHallId,
  selectedDate,
  selectedSlots,
  onDateChange,
  onSlotsChange,
  bookings,
}: BookingCalendarProps) {
  // Generate the next 10 days for the quick date selector
  const quickDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = date.getDate();
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      dates.push({
        dateString,
        weekday,
        dayNum,
        monthName,
        isToday: i === 0,
      });
    }
    return dates;
  }, []);

  // Determine occupied slots for this hall on the selected date
  const occupiedSlots = useMemo(() => {
    const activeBookings = bookings.filter(
      (b) => b.hallId === selectedHallId && b.date === selectedDate && b.paymentStatus === "success"
    );
    const slots = new Set<string>();
    activeBookings.forEach((b) => {
      b.timeSlots.forEach((slot) => slots.add(slot));
    });
    return slots;
  }, [bookings, selectedHallId, selectedDate]);

  // Handle slot selection (multi-select)
  const handleSlotToggle = (slot: string) => {
    if (occupiedSlots.has(slot)) return; // Can't select occupied slot

    if (selectedSlots.includes(slot)) {
      onSlotsChange(selectedSlots.filter((s) => s !== slot));
    } else {
      onSlotsChange([...selectedSlots, slot].sort((a, b) => {
        return ALL_TIME_SLOTS.indexOf(a) - ALL_TIME_SLOTS.indexOf(b);
      }));
    }
  };

  const todayStr = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  return (
    <div className="flex flex-col gap-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. Date Selection Header */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Choose Reservation Date
              </h3>
              <p className="text-xs text-zinc-500">Bookings can be made up to 30 days in advance</p>
            </div>
          </div>

          {/* Standard date picker fallback */}
          <div className="relative">
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>
        </div>

        {/* Quick Date Carousel */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent dark:scrollbar-thumb-zinc-800">
          {quickDates.map((item) => {
            const isActive = selectedDate === item.dateString;
            return (
              <button
                key={item.dateString}
                type="button"
                onClick={() => {
                  onDateChange(item.dateString);
                  onSlotsChange([]); // Clear selected slots when switching date
                }}
                className={`flex min-w-[76px] flex-col items-center rounded-2xl border py-3 px-2 transition-all ${
                  isActive
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "border-zinc-200 bg-zinc-50 hover:border-zinc-400 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span className={`text-[10px] uppercase font-bold tracking-wide ${isActive ? "text-emerald-100" : "text-zinc-400 dark:text-zinc-500"}`}>
                  {item.weekday}
                </span>
                <span className="text-xl font-extrabold my-1">{item.dayNum}</span>
                <span className={`text-[10px] font-semibold ${isActive ? "text-emerald-100" : "text-zinc-500"}`}>
                  {item.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Time Slot Selection */}
      <div>
        <div className="flex items-center justify-between mb-4 border-t border-zinc-100 dark:border-zinc-900 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Select Time Slots
              </h3>
              <p className="text-xs text-zinc-500">Select one or more continuous hours for your event</p>
            </div>
          </div>

          {/* Slots Legend */}
          <div className="flex gap-4 text-xs font-semibold text-zinc-500">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-emerald-600" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-zinc-200 border border-transparent line-through text-zinc-400 dark:bg-zinc-900/50" />
              <span>Reserved</span>
            </div>
          </div>
        </div>

        {/* Time Slots Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {ALL_TIME_SLOTS.map((slot) => {
            const isReserved = occupiedSlots.has(slot);
            const isSelected = selectedSlots.includes(slot);

            return (
              <button
                key={slot}
                type="button"
                disabled={isReserved}
                onClick={() => handleSlotToggle(slot)}
                className={`relative flex items-center justify-between rounded-xl border p-4 text-sm font-semibold tracking-wide transition-all ${
                  isReserved
                    ? "border-zinc-100 bg-zinc-100 text-zinc-400 line-through cursor-not-allowed dark:border-zinc-900/40 dark:bg-zinc-900/30 dark:text-zinc-600"
                    : isSelected
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                    : "border-zinc-200 bg-white hover:border-zinc-400 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700"
                }`}
              >
                <span>{slot}</span>
                {isReserved ? (
                  <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
                    Booked
                  </span>
                ) : isSelected ? (
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-emerald-500/30" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Booking Cost Estimator bar */}
      {selectedSlots.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            You have selected <span className="font-bold">{selectedSlots.length} hour(s)</span> for reservation.
          </p>
        </div>
      )}
    </div>
  );
}
