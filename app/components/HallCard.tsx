"use client";

import Image from "next/image";
import { Hall } from "../types";
import { Users, DollarSign, Star, Check } from "lucide-react";

interface HallCardProps {
  hall: Hall;
  onSelect: (hall: Hall) => void;
  isSelected: boolean;
}

export default function HallCard({ hall, onSelect, isSelected }: HallCardProps) {
  return (
    <div
      onClick={() => onSelect(hall)}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border transition-all duration-500 cursor-pointer ${
        isSelected
          ? "border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/50 shadow-emerald-500/10 shadow-2xl"
          : "border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
      }`}
    >
      {/* Premium Gradient Glow on selection */}
      {isSelected && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5 blur-xl" />
      )}

      {/* Hall Image Wrapper */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={hall.image}
          alt={hall.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Tag Overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            Cap. {hall.capacity}
          </span>
        </div>

        {/* Rating and Price Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <h3 className="text-xl font-bold tracking-tight">{hall.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{hall.rating}</span>
              <span className="text-xs text-zinc-300">({hall.reviewsCount} reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-300 block">per hour</span>
            <span className="text-2xl font-black text-emerald-400">${hall.pricePerHour}</span>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-6">
          {hall.description}
        </p>

        {/* Features Checklist */}
        <div className="mt-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
            Highlights
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
            {hall.features.slice(0, 4).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                  <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Amenities tags */}
          <div className="flex flex-wrap gap-1.5">
            {hall.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
              >
                {amenity}
              </span>
            ))}
            {hall.amenities.length > 3 && (
              <span className="rounded-lg bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                +{hall.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Select Border Button */}
      <div
        className={`w-full py-4 border-t text-center text-sm font-semibold tracking-wide transition-all ${
          isSelected
            ? "bg-emerald-600 border-emerald-500 text-white font-bold"
            : "bg-zinc-50 border-zinc-100 text-zinc-700 dark:bg-zinc-900/50 dark:border-zinc-800/80 dark:text-zinc-300 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900"
        }`}
      >
        {isSelected ? "Selected for Reservation" : "Select this Venue"}
      </div>
    </div>
  );
}
