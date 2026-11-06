"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, Users, ArrowLeftRight, Plane } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DestinationInput } from "./destination-input";
import { TravelCalendar } from "./travel-calendar";
import { parseChildren } from "@/lib/travel-party";
export function TravelSearch({
  initial = "hotels",
  compact = false,
  values = {},
}: {
  initial?: string;
  compact?: boolean;
  values?: Record<string, string>;
}) {
  const router = useRouter(),
    type = initial;
  const [destination, setDestination] = useState(
      values.destination || "Barcelona",
    ),
    [origin, setOrigin] = useState(values.origin || "London"),
    [start, setStart] = useState(values.start || "2027-07-10"),
    [end, setEnd] = useState(values.end || "2027-07-14"),
    [guests, setGuests] = useState(
      Math.min(8, Math.max(1, Number(values.guests) || 2)),
    ),
    [children, setChildren] = useState<(number | "")[]>(
      parseChildren(values.children),
    ),
    [open, setOpen] = useState(false),
    [trip, setTrip] = useState(values.trip || "Round trip"),
    [cabin, setCabin] = useState(values.cabin || "Economy");
  const flight = type === "flights" || type === "packages";
  const incomplete = children.some((a) => a === "");
  return (
    <div className={compact ? "search-widget compact" : "search-widget"}>
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
            <select value={cabin} onChange={(e) => setCabin(e.target.value)}>
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
          if (incomplete) {
            setOpen(true);
            return;
          }
          const p = new URLSearchParams({
            destination,
            start,
            end,
            guests: String(guests),
            children: children.join(","),
            origin,
            trip,
            cabin,
          });
          router.push(
            `/${type}/${type === "hotels" || type === "activities" ? encodeURIComponent(destination.toLowerCase()) : "search"}?${p}`,
          );
        }}
      >
        {flight && (
          <div className="search-location">
            <Plane />
            <DestinationInput
              value={origin}
              onChange={setOrigin}
              label="Flying from"
            />
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
          <DestinationInput
            value={destination}
            onChange={setDestination}
            label={
              type === "cars" || type === "transfers"
                ? "Pick-up location"
                : flight
                  ? "Flying to"
                  : "Where to?"
            }
          />
        </div>
        <TravelCalendar
          start={start}
          end={end}
          hotel={type === "hotels"}
          single={
            type === "activities" || (type === "flights" && trip === "One way")
          }
          onChange={(a, b) => {
            setStart(a);
            setEnd(b);
          }}
        />
        <button
          type="button"
          className="guest-trigger"
          onClick={() => setOpen(true)}
        >
          <Users />
          <span>
            <small>Travelers</small>
            {guests} adult{guests > 1 ? "s" : ""}
            {children.length
              ? ` · ${children.length} child${children.length > 1 ? "ren" : ""}`
              : ""}
          </span>
        </button>
        <button type="submit" className="search-submit">
          <Search size={20} />
          Search
        </button>
      </form>
      {!compact && (
        <div className="popular-search">
          <span>A little inspiration:</span>
          {["Lisbon", "Santorini", "Bali", "Kyoto"].map((city) => (
            <button
              type="button"
              key={city}
              onClick={() => setDestination(city)}
            >
              {city}
              <ArrowLeftRight size={10} />
            </button>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="family-dialog">
          <DialogHeader>
            <DialogTitle>Who&apos;s coming along?</DialogTitle>
            <DialogDescription>
              A little adventure for everyone.
            </DialogDescription>
          </DialogHeader>
          <div className="counter">
            <span>
              <b>Adults</b>
              <small>Ages 18 and above</small>
            </span>
            <div>
              <button
                aria-label="Remove adult"
                disabled={guests <= 1}
                onClick={() => setGuests(guests - 1)}
              >
                −
              </button>
              <b>{guests}</b>
              <button
                aria-label="Add adult"
                disabled={guests >= 8}
                onClick={() => setGuests(guests + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="counter">
            <span>
              <b>Children</b>
              <small>Ages 0–17</small>
            </span>
            <div>
              <button
                aria-label="Remove child"
                disabled={!children.length}
                onClick={() => setChildren(children.slice(0, -1))}
              >
                −
              </button>
              <b>{children.length}</b>
              <button
                aria-label="Add child"
                disabled={children.length >= 6}
                onClick={() => setChildren([...children, ""])}
              >
                +
              </button>
            </div>
          </div>
          {children.length > 0 && (
            <div className="child-ages">
              <p>How old will each child be at check-in?</p>
              <div>
                {children.map((age, i) => (
                  <label key={i}>
                    Child {i + 1}
                    <select
                      aria-label={`Child ${i + 1} age`}
                      required
                      value={age}
                      onChange={(e) =>
                        setChildren(
                          children.map((a, j) =>
                            j === i ? Number(e.target.value) : a,
                          ),
                        )
                      }
                    >
                      <option value="" disabled>
                        Select age
                      </option>
                      {Array.from({ length: 18 }, (_, a) => (
                        <option key={a} value={a}>
                          {a === 0
                            ? "Under 1"
                            : `${a} year${a === 1 ? "" : "s"}`}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              {incomplete && (
                <small role="status">
                  Please select an age for every child.
                </small>
              )}
            </div>
          )}
          <button
            className="primary"
            disabled={incomplete}
            onClick={() => setOpen(false)}
          >
            Done
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
