"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { halls, initialBookings } from "./hallsData";
import { Hall, Booking } from "./types";
import HallCard from "./components/HallCard";
import BookingCalendar from "./components/BookingCalendar";
import PaymentModal from "./components/PaymentModal";
import ReceiptModal from "./components/ReceiptModal";
import { Calendar, Search, Users, ShieldAlert, Sparkles, Filter, Trash2, Ticket } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Selection wizard state
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  
  // Modal triggers
  const [activePaymentHall, setActivePaymentHall] = useState<Hall | null>(null);
  const [activeReceiptBooking, setActiveReceiptBooking] = useState<Booking | null>(null);
  const [activeReceiptHall, setActiveReceiptHall] = useState<Hall | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const calendarSectionRef = useRef<HTMLDivElement>(null);

  // Set default date to today client-side
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  // Hydration handling and loading bookings
  useEffect(() => {
    setMounted(true);
    const local = localStorage.getItem("booking_hall_reservations");
    if (local) {
      try {
        setBookings(JSON.parse(local));
      } catch (e) {
        setBookings(initialBookings);
      }
    } else {
      setBookings(initialBookings);
      localStorage.setItem("booking_hall_reservations", JSON.stringify(initialBookings));
    }
  }, []);

  // Filter halls based on searches & inputs
  const filteredHalls = useMemo(() => {
    return halls.filter((hall) => {
      const matchesSearch =
        hall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hall.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hall.amenities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCapacity =
        capacityFilter === "all" ||
        (capacityFilter === "small" && hall.capacity <= 100) ||
        (capacityFilter === "medium" && hall.capacity > 100 && hall.capacity <= 250) ||
        (capacityFilter === "large" && hall.capacity > 250);

      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "low" && hall.pricePerHour <= 100) ||
        (priceFilter === "medium" && hall.pricePerHour > 100 && hall.pricePerHour <= 200) ||
        (priceFilter === "high" && hall.pricePerHour > 200);

      return matchesSearch && matchesCapacity && matchesPrice;
    });
  }, [searchQuery, capacityFilter, priceFilter]);

  const handleSelectHall = (hall: Hall) => {
    setSelectedHall(hall);
    setSelectedSlots([]); // Clear slots on hall change
    
    // Smooth scroll to calendar
    setTimeout(() => {
      calendarSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handlePaymentSuccess = (buyerName: string, buyerEmail: string) => {
    if (!selectedHall) return;

    const subtotal = selectedSlots.length * selectedHall.pricePerHour;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const serviceFee = 15;
    const finalPaid = subtotal + tax + serviceFee;

    const newBooking: Booking = {
      id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      hallId: selectedHall.id,
      hallName: selectedHall.name,
      date: selectedDate,
      timeSlots: [...selectedSlots],
      totalPaid: finalPaid,
      paymentStatus: "success",
      name: buyerName,
      email: buyerEmail,
      createdAt: new Date().toISOString(),
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem("booking_hall_reservations", JSON.stringify(updatedBookings));

    // Clear calendar choices
    setSelectedSlots([]);

    // Open receipt modal
    setActiveReceiptBooking(newBooking);
    setActiveReceiptHall(selectedHall);
    
    // Close checkout sheet
    setActivePaymentHall(null);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking? This will immediately free up the reserved time slots.")) {
      const updated = bookings.filter((b) => b.id !== bookingId);
      setBookings(updated);
      localStorage.setItem("booking_hall_reservations", JSON.stringify(updated));
    }
  };

  const viewReceiptFromDashboard = (booking: Booking) => {
    const hallMatch = halls.find((h) => h.id === booking.hallId) || halls[0];
    setActiveReceiptBooking(booking);
    setActiveReceiptHall(hallMatch);
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-50 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-semibold tracking-wider animate-pulse text-zinc-400">Loading Booking System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans transition-colors duration-300">
      
      {/* Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-900/60 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                VISTA<span className="text-emerald-500">HALLS</span>
              </span>
              <span className="text-[10px] block font-bold tracking-widest text-zinc-400 uppercase -mt-1">
                Luxury Spaces
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <a href="#halls-showcase" className="text-sm font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50">
              Browse Halls
            </a>
            <a href="#my-reservations" className="rounded-full bg-emerald-600/10 hover:bg-emerald-600/25 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 transition-colors">
              My Tickets
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-zinc-900 py-32 px-6 text-white border-b border-zinc-800">
        {/* Dynamic Dark Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/40 via-zinc-950 to-black" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,_transparent,_rgba(0,0,0,0.4))]" />

        <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-1.5 text-xs font-bold tracking-wider text-emerald-400 uppercase mb-8">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Premium Venues Sandbox
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl leading-[1.1] text-zinc-150">
            reserve the ultimate space for your next event
          </h1>
          <p className="mt-6 text-lg max-w-xl text-zinc-400 leading-relaxed">
            Choose from our highly-curated luxury event spaces. Pick your dates, select custom hours, and secure bookings instantly.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 py-16 flex flex-col gap-16">

        {/* 1. Explore Halls Section */}
        <section id="halls-showcase" className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                1. Pick an Event Space
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Hover over and select a venue space below to trigger the booking timeline
              </p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search space/amenity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-4 text-xs font-medium focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                />
                <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-zinc-400" />
              </div>

              {/* Capacity Filter */}
              <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900">
                <Users className="h-3.5 w-3.5 text-zinc-400" />
                <select
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none dark:text-zinc-300"
                >
                  <option value="all">Any Capacity</option>
                  <option value="small">Small (&le; 100 pax)</option>
                  <option value="medium">Medium (101-250 pax)</option>
                  <option value="large">Large (&gt; 250 pax)</option>
                </select>
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900">
                <Filter className="h-3.5 w-3.5 text-zinc-400" />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none dark:text-zinc-300"
                >
                  <option value="all">Any Hourly Rate</option>
                  <option value="low">Budget (&le; $100/hr)</option>
                  <option value="medium">Standard ($101-$200/hr)</option>
                  <option value="high">Premium (&gt; $200/hr)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredHalls.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {filteredHalls.map((hall) => (
                <HallCard
                  key={hall.id}
                  hall={hall}
                  onSelect={handleSelectHall}
                  isSelected={selectedHall?.id === hall.id}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center text-zinc-500">
              <ShieldAlert className="mx-auto h-10 w-10 text-zinc-400 mb-3" />
              <h3 className="font-bold text-zinc-800 dark:text-zinc-200">No venues match your filters</h3>
              <p className="text-xs mt-1">Try modifying your filters or search keywords above.</p>
            </div>
          )}
        </section>

        {/* 2. Calendar Booking & Checking conflicts */}
        {selectedHall ? (
          <section
            ref={calendarSectionRef}
            className="flex flex-col gap-6 scroll-mt-24 border-t border-zinc-200 dark:border-zinc-900 pt-16 animate-fade-in"
          >
            <div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                2. Set Dates and Times
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Configure bookings for <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedHall.name}</span>. Selected slots will be instantly reserved.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Calendar Selector (Col-span 2) */}
              <div className="lg:col-span-2">
                <BookingCalendar
                  selectedHallId={selectedHall.id}
                  selectedDate={selectedDate}
                  selectedSlots={selectedSlots}
                  onDateChange={setSelectedDate}
                  onSlotsChange={setSelectedSlots}
                  bookings={bookings}
                />
              </div>

              {/* Flow Action Sidebar Panel */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between h-fit gap-8">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4 pb-4 border-b border-zinc-150 dark:border-zinc-900">
                    Booking Summary
                  </h3>

                  <div className="flex flex-col gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-semibold">Selected Space</span>
                      <span className="font-extrabold text-zinc-800 dark:text-zinc-200">{selectedHall.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-semibold">Target Date</span>
                      <span className="font-extrabold text-zinc-800 dark:text-zinc-200">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 font-semibold">Hourly Rate</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        ${selectedHall.pricePerHour}/hr
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-zinc-400 font-semibold shrink-0">Reserved Slots</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 text-right max-w-[150px] break-words">
                        {selectedSlots.length > 0 ? selectedSlots.join(", ") : "None chosen"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-150 dark:border-zinc-900 pt-6">
                  {selectedSlots.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Estimated Subtotal
                        </span>
                        <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                          ${selectedSlots.length * selectedHall.pricePerHour}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActivePaymentHall(selectedHall)}
                        className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 transition-all shadow-lg shadow-emerald-600/10 text-center tracking-wide cursor-pointer"
                      >
                        Proceed to Secure Checkout
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2.5 rounded-2xl bg-zinc-50 border border-zinc-150 dark:bg-zinc-900 dark:border-zinc-800 p-4 text-xs text-zinc-500 font-semibold leading-relaxed">
                      <Calendar className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
                      <span>Please select at least 1 hourly slot from the timeline grid to activate checkout.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* 3. User Bookings Dashboard ("My Reservations") */}
        <section id="my-reservations" className="border-t border-zinc-200 dark:border-zinc-900 pt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              My Reservations & Tickets
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Track active bookings, print secure boarding codes, or release cancelable slots
            </p>
          </div>

          {bookings.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {booking.id}
                      </span>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                        {booking.hallName}
                      </h3>
                      <p className="text-xs font-semibold text-zinc-500 mt-0.5">{booking.date}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 text-emerald-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                      PAID
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-xs text-zinc-400 block font-semibold mb-1">Time Slots Booked</span>
                    <div className="flex flex-wrap gap-1.5">
                      {booking.timeSlots.map((slot) => (
                        <span
                          key={slot}
                          className="rounded-lg bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 text-xs text-zinc-700 dark:text-zinc-300 font-semibold"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-2">
                    <div className="text-zinc-500 text-xs font-semibold">
                      Paid: <span className="text-zinc-900 dark:text-zinc-50 font-bold">${booking.totalPaid.toFixed(2)}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => viewReceiptFromDashboard(booking)}
                        className="rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-850 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 px-3.5 py-2 text-xs font-bold text-zinc-700 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Ticket className="h-3.5 w-3.5 text-emerald-500" />
                        View Ticket
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="rounded-xl bg-red-50 hover:bg-red-100 text-red-650 p-2 text-xs font-bold flex items-center justify-center transition dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 cursor-pointer"
                        title="Cancel reservation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center text-zinc-500">
              <Calendar className="mx-auto h-10 w-10 text-zinc-400 mb-3" />
              <h3 className="font-bold text-zinc-850 dark:text-zinc-250">No active bookings</h3>
              <p className="text-xs mt-1">Make your first booking selection from the showcase above.</p>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-950 text-zinc-500 text-xs border-t border-zinc-900 py-12 px-6 mt-20">
        <div className="mx-auto max-w-7xl flex flex-col gap-6 sm:flex-row sm:justify-between items-center text-center sm:text-left">
          <div>
            <span className="font-black text-sm text-zinc-300">
              VISTA<span className="text-emerald-500">HALLS</span>
            </span>
            <p className="mt-1">Luxury Booking Space Sandbox System. All rights reserved.</p>
          </div>
          <div className="flex gap-4 font-semibold">
            <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300">Stripe Docs</a>
          </div>
        </div>
      </footer>

      {/* 4. Overlay Checkout Form */}
      {activePaymentHall && (
        <PaymentModal
          hall={activePaymentHall}
          date={selectedDate}
          selectedSlots={selectedSlots}
          onClose={() => setActivePaymentHall(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* 5. Overlay Ticket Receipt */}
      {activeReceiptBooking && activeReceiptHall && (
        <ReceiptModal
          hall={activeReceiptHall}
          booking={activeReceiptBooking}
          onClose={() => {
            setActiveReceiptBooking(null);
            setActiveReceiptHall(null);
          }}
        />
      )}
    </div>
  );
}
