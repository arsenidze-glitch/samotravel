"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BedDouble,
  Plane,
  Package,
  Car,
  Palmtree,
  MapPin,
  Search,
  Users,
  ArrowLeftRight,
  Bus,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const tabs = [
  ["hotels", "Stays", BedDouble],
  ["flights", "Flights", Plane],
  ["packages", "Flight + Hotel", Package],
  ["cars", "Cars", Car],
  ["transfers", "Transfers", Bus],
  ["activities", "Things to do", Palmtree],
] as const;
export function TravelSearch({
  initial = "hotels",
  compact = false,
  values = {},
}: {
  initial?: string;
  compact?: boolean;
  values?: Record<string, string>;
}) {
  const router = useRouter();
  const [type, setType] = useState(initial),
    [destination, setDestination] = useState(values.destination || "Barcelona"),
    [origin, setOrigin] = useState(values.origin || "London"),
    [start, setStart] = useState(values.start || "2027-07-10"),
    [end, setEnd] = useState(values.end || "2027-07-14"),
    [guests, setGuests] = useState(Number(values.guests) || 2),
    [rooms, setRooms] = useState(Number(values.rooms) || 1),
    [open, setOpen] = useState(false),
    [trip, setTrip] = useState(values.trip || "Round trip");
  const flight = type === "flights" || type === "packages";
  return (
    <div className={compact ? "search-widget compact" : "search-widget"}>
      <Tabs value={type} onValueChange={(v) => setType(String(v))}>
        <TabsList variant="line" className="product-tabs">
          {tabs.map(([id, title, Icon]) => (
            <TabsTrigger key={id} value={id}>
              <Icon />
              {title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {type === "flights" && (
        <div className="flight-options">
          <label>
            Journey{" "}
            <select value={trip} onChange={(e) => setTrip(e.target.value)}>
              <option>Round trip</option>
              <option>One way</option>
            </select>
          </label>
          <label>
            Cabin{" "}
            <select>
              <option>Economy</option>
              <option>Business</option>
            </select>
          </label>
        </div>
      )}
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          const p = new URLSearchParams({
            destination,
            start,
            end,
            guests: String(guests),
            rooms: String(rooms),
            origin,
            trip,
          });
          router.push(
            `/${type}/${type === "hotels" || type === "activities" ? encodeURIComponent(destination.toLowerCase()) : "search"}?${p}`,
          );
        }}
      >
        {flight && (
          <div className="search-location">
            <Plane />
            <Field>
              <FieldLabel htmlFor="origin">Flying from</FieldLabel>
              <input
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              />
            </Field>
            <button
              type="button"
              aria-label="Swap origin and destination"
              onClick={() => {
                setOrigin(destination);
                setDestination(origin);
              }}
            >
              <ArrowLeftRight size={17} />
            </button>
          </div>
        )}
        <div className="search-location">
          <MapPin />
          <Field>
            <FieldLabel htmlFor="destination">
              {type === "cars" || type === "transfers"
                ? "Pick-up location"
                : flight
                  ? "Flying to"
                  : "Where to?"}
            </FieldLabel>
            <input
              id="destination"
              list="cities"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
            <datalist id="cities">
              {[
                "Barcelona",
                "Lisbon",
                "Santorini",
                "Bali",
                "Kyoto",
                "Paris",
                "London",
                "Dubai",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </datalist>
          </Field>
        </div>
        <div className="search-date">
          <Field>
            <FieldLabel htmlFor="checkin">
              {type === "hotels" ? "Check-in" : "Departure"}
            </FieldLabel>
            <input
              id="checkin"
              type="date"
              min="2026-11-06"
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                if (e.target.value >= end)
                  setEnd(
                    new Date(new Date(e.target.value).getTime() + 86400000)
                      .toISOString()
                      .slice(0, 10),
                  );
              }}
              required
            />
          </Field>
        </div>
        {type !== "activities" && trip !== "One way" && (
          <div className="search-date">
            <Field>
              <FieldLabel htmlFor="checkout">
                {type === "hotels" ? "Check-out" : "Return"}
              </FieldLabel>
              <input
                id="checkout"
                type="date"
                min={new Date(
                  new Date(start || "2027-07-10").getTime() + 86400000,
                )
                  .toISOString()
                  .slice(0, 10)}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
              />
            </Field>
          </div>
        )}
        <button
          type="button"
          className="guest-trigger"
          onClick={() => setOpen(true)}
        >
          <Users />
          <span>
            <small>Travelers & rooms</small>
            {guests} adults · {rooms} room{rooms > 1 ? "s" : ""}
          </span>
        </button>
        <button type="submit" className="search-submit">
          <Search size={20} /> Search
        </button>
      </form>
      {!compact && (
        <div className="popular-search">
          <span>A little inspiration:</span>
          {["Lisbon", "Santorini", "Bali", "Kyoto"].map((city) => (
            <button key={city} onClick={() => setDestination(city)}>
              {city}
              <ArrowLeftRight size={10} />
            </button>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Who&apos;s coming along?</DialogTitle>
          </DialogHeader>
          {[
            ["Adults", guests, setGuests, 1],
            ["Rooms", rooms, setRooms, 1],
          ].map(([name, value, setter, min]) => (
            <div className="counter" key={String(name)}>
              <span>{String(name)}</span>
              <div>
                <button
                  disabled={Number(value) <= Number(min)}
                  onClick={() =>
                    (setter as typeof setGuests)(Number(value) - 1)
                  }
                  aria-label={`Remove ${name}`}
                >
                  −
                </button>
                <b>{String(value)}</b>
                <button
                  disabled={Number(value) >= 8}
                  onClick={() =>
                    (setter as typeof setGuests)(Number(value) + 1)
                  }
                  aria-label={`Add ${name}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <button className="primary" onClick={() => setOpen(false)}>
            Done
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
