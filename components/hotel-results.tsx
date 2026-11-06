"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MapPin,
  Check,
  SlidersHorizontal,
  ArrowUpRight,
  Heart,
  Wifi,
} from "lucide-react";
import { products, money } from "@/lib/travel";
import { hotelInfo, nightsBetween } from "@/lib/hotel-info";
import { partyDetails } from "@/lib/travel-party";
import { TravelSearch } from "./travel-search";
import { useCurrency } from "./travel-shell";
const groups: Record<string, string[]> = {
  "Popular filters": [
    "Free cancellation",
    "Breakfast included",
    "Pool",
    "Parking",
  ],
  "Star rating": ["3 stars", "4 stars"],
  "Property type": ["Boutique hotel", "Design hotel", "Guesthouse"],
  Neighborhood: ["Eixample", "Poblenou", "Barceloneta"],
  Facilities: [
    "Free Wi-Fi",
    "Restaurant",
    "Air conditioning",
    "Terrace",
    "Pet friendly",
    "Accessible rooms",
  ],
};
export function HotelResults({ destination }: { destination?: string }) {
  const params = useSearchParams(),
    currency = useCurrency(),
    city = params.get("destination") || destination || "Barcelona";
  const party = partyDetails(params),
    nights = nightsBetween(
      params.get("start") || "2027-07-10",
      params.get("end") || "2027-07-14",
    );
  const [filters, setFilters] = useState<string[]>([]),
    [budget, setBudget] = useState(800),
    [rating, setRating] = useState(0),
    [distance, setDistance] = useState(99),
    [name, setName] = useState(""),
    [sort, setSort] = useState("recommended"),
    [saved, setSaved] = useState<string[]>([]),
    [showFilters, setShowFilters] = useState(false);
  function reset() {
    setFilters([]);
    setBudget(800);
    setRating(0);
    setDistance(99);
    setName("");
  }
  function match(id: string, f: string) {
    const h = hotelInfo[id];
    return f === "Free cancellation"
      ? h.refundable
      : f === "Breakfast included"
        ? h.breakfast
        : f.endsWith(" stars")
          ? h.stars === Number(f[0])
          : h.amenities.includes(f) || h.area === f || h.kind === f;
  }
  const list = products
    .filter(
      (p) =>
        p.type === "hotels" &&
        p.price <= budget &&
        Number(p.rating) >= rating &&
        hotelInfo[p.id].distance <= distance &&
        p.name.toLowerCase().includes(name.toLowerCase()) &&
        Object.values(groups).every((opts) => {
          const selected = filters.filter((f) => opts.includes(f));
          return !selected.length || selected.some((f) => match(p.id, f));
        }),
    )
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : sort === "rating"
          ? Number(b.rating) - Number(a.rating)
          : sort === "distance"
            ? hotelInfo[a.id].distance - hotelInfo[b.id].distance
            : 0,
    );
  return (
    <main>
      <div className="search-band">
        <div className="container">
          <TravelSearch
            compact
            values={{
              ...Object.fromEntries(params.entries()),
              destination: city,
            }}
            key={params.toString() + city}
          />
        </div>
      </div>
      <section className="container section ota-results">
        <p className="breadcrumb">
          <Link href="/">Home</Link> / Spain / {city} / Stays
        </p>
        <div className="section-heading">
          <div>
            <span className="eyebrow">A LITTLE MORE YOUR KIND OF STAY</span>
            <h1 className="page-title">Find your place in {city}.</h1>
            <p className="muted">
              {nights} nights · {party.label} · Illustrative inventory, prices
              and reviews
            </p>
          </div>
        </div>
        <div className="results-layout">
          <aside
            className={`filters ota-filters ${showFilters ? "expanded" : ""}`}
          >
            <button
              className="mobile-filter-toggle outline-button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={17} />
              Filters {filters.length > 0 && `(${filters.length})`}
            </button>
            <div className="filter-body">
              <div className="filter-title">
                <h3>Filter your stay</h3>
                <button className="text-link" onClick={reset}>
                  Reset
                </button>
              </div>
              <label className="hotel-name-filter">
                Property name
                <input
                  placeholder="e.g. Casa Bonay"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="budget-filter">
                Your budget per night <b>Up to {money(budget, currency)}</b>
                <input
                  aria-label="Maximum nightly budget"
                  type="range"
                  min={50}
                  max={800}
                  step={10}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                />
              </label>
              {Object.entries(groups).map(([title, opts]) => (
                <fieldset key={title}>
                  <legend>{title}</legend>
                  {opts.map((f) => (
                    <label className="check-label" key={f}>
                      <input
                        type="checkbox"
                        checked={filters.includes(f)}
                        onChange={() =>
                          setFilters(
                            filters.includes(f)
                              ? filters.filter((x) => x !== f)
                              : [...filters, f],
                          )
                        }
                      />
                      <span>{f}</span>
                      <small>
                        {
                          products.filter(
                            (p) => p.type === "hotels" && match(p.id, f),
                          ).length
                        }
                      </small>
                    </label>
                  ))}
                </fieldset>
              ))}
              <fieldset>
                <legend>Guest rating</legend>
                {[
                  [0, "Any rating"],
                  [9, "Wonderful: 9+"],
                  [9.3, "Exceptional: 9.3+"],
                ].map(([v, label]) => (
                  <label className="check-label" key={v}>
                    <input
                      type="radio"
                      name="rating"
                      checked={rating === v}
                      onChange={() => setRating(Number(v))}
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
              <label className="hotel-name-filter">
                Distance from city center
                <select
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                >
                  <option value={99}>Any distance</option>
                  <option value={1.5}>Less than 1.5 km</option>
                  <option value={2}>Less than 2 km</option>
                  <option value={3}>Less than 3 km</option>
                </select>
              </label>
            </div>
          </aside>
          <div className="hotel-result-column">
            <div className="results-toolbar">
              <b aria-live="polite">{list.length} stays for your next story</b>
              <label>
                Sort by{" "}
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="recommended">Our top picks</option>
                  <option value="price">Lowest price</option>
                  <option value="rating">Guest rating</option>
                  <option value="distance">Distance to center</option>
                </select>
              </label>
            </div>
            {filters.length > 0 && (
              <div className="active-filters">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilters(filters.filter((x) => x !== f))}
                    aria-label={`Remove ${f} filter`}
                  >
                    {f} ×
                  </button>
                ))}
              </div>
            )}
            <div className="results-reassurance">
              <Check size={17} />
              <span>
                Clear prices. Thoughtful stays. A little less searching.
              </span>
            </div>
            <div className="result-list">
              {list.map((p) => {
                const h = hotelInfo[p.id],
                  url = `/hotel/${p.id}?${params}`,
                  total = p.price * nights * party.rooms;
                return (
                  <article className="hotel-result" key={p.id}>
                    <div className="hotel-result-photo">
                      <Link href={url}>
                        <img
                          src={p.image}
                          alt={`${p.name} — illustrative hotel photograph`}
                        />
                      </Link>
                      <span className="photo-badge">SAMO pick</span>
                      <button
                        aria-label={`Save ${p.name} for this visit`}
                        aria-pressed={saved.includes(p.id)}
                        onClick={() =>
                          setSaved(
                            saved.includes(p.id)
                              ? saved.filter((x) => x !== p.id)
                              : [...saved, p.id],
                          )
                        }
                      >
                        <Heart
                          size={19}
                          fill={saved.includes(p.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <div className="hotel-result-info">
                      <span className="eyebrow">
                        {"★".repeat(h.stars)} · {h.kind}
                      </span>
                      <Link href={url}>
                        <h2>{p.name}</h2>
                      </Link>
                      <p className="hotel-location">
                        <MapPin size={14} />
                        {h.area} · {h.distance} km from center
                      </p>
                      <p>{p.description}</p>
                      <div className="facility-chips">
                        {h.amenities.slice(0, 4).map((a) => (
                          <span key={a}>
                            {a === "Free Wi-Fi" && <Wifi size={12} />} {a}
                          </span>
                        ))}
                      </div>
                      <div className="result-room">
                        <b>Cozy Double Room</b>
                        <small>
                          20 m² · Double bed · {party.rooms} room
                          {party.rooms > 1 ? "s" : ""} allocated for your group
                        </small>
                        <span className="green-text">
                          <Check size={14} />
                          {h.breakfast
                            ? "Breakfast included"
                            : "Room only · Breakfast available as an extra"}
                        </span>
                        <small>
                          {h.refundable
                            ? "Refundable rate available — choose a room to see terms"
                            : "Non-refundable base rate"}
                        </small>
                      </div>
                    </div>
                    <div className="hotel-result-price">
                      <div className="review-compact">
                        <span>
                          <b>Wonderful</b>
                          <small>
                            {h.reviews.toLocaleString()} sample reviews
                          </small>
                        </span>
                        <b className="score">{p.rating}</b>
                      </div>
                      <div>
                        <small>
                          {nights} nights · {party.label}
                        </small>
                        <strong>{money(total, currency)}</strong>
                        <small>{money(p.price, currency)} / room / night</small>
                        <small>Demo taxes & fees included</small>
                        <Link className="primary" href={url}>
                          See availability <ArrowUpRight size={16} />
                        </Link>
                        <small>No payment needed to explore</small>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {!list.length && (
              <div className="empty">
                <h2>No stays match just yet.</h2>
                <p>Try widening your budget or removing a filter.</p>
                <button className="primary" onClick={reset}>
                  Clear all filters
                </button>
              </div>
            )}
            <p className="sample-caption">
              Demo catalog: all destination searches show these three
              illustrative stays. Facilities, review counts and policies are
              sample content, not verified property information.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
