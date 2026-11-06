"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  SlidersHorizontal,
  Heart,
  MapPin,
  Wifi,
  Coffee,
  Sun,
  Star,
} from "lucide-react";
import { products, Product, money, detailUrl, categories } from "@/lib/travel";
import { TravelSearch } from "./travel-search";
import { partyDetails } from "@/lib/travel-party";
import { useCurrency } from "./travel-shell";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HotelResults } from "./hotel-results";
import { HotelDetail } from "./hotel-detail";
export function TravelCatalog(props: { type?: string; destination?: string }) {
  return !props.type || props.type === "hotels" ? (
    <HotelResults destination={props.destination} />
  ) : (
    <GenericCatalog {...props} />
  );
}
function GenericCatalog({
  type = "hotels",
  destination,
}: {
  type?: string;
  destination?: string;
}) {
  const params = useSearchParams();
  const city = params.get("destination") || destination || "Barcelona";
  const currency = useCurrency();
  const [budget, setBudget] = useState(800),
    [sort, setSort] = useState("recommended"),
    [rating, setRating] = useState(false),
    [cancel, setCancel] = useState(false);
  const list = products
    .filter(
      (p) =>
        (type === "deals" || p.type === type) &&
        p.price <= budget &&
        (!rating || Number(p.rating) >= 9.3) &&
        (!cancel || p.feature === "Free cancellation"),
    )
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : sort === "rating"
          ? Number(b.rating) - Number(a.rating)
          : 0,
    );
  return (
    <main>
      <div className="search-band">
        <div className="container">
          <TravelSearch
            key={params.toString() + city + type}
            initial={type === "deals" ? "hotels" : type}
            compact
            values={{
              ...Object.fromEntries(params.entries()),
              destination: city,
            }}
          />
        </div>
      </div>
      <section className="container section">
        <p className="breadcrumb">
          <Link href="/">Home</Link> /{" "}
          {categories.find((c) => c.path === type)?.name || "Deals"} / {city}
        </p>
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR NEXT GOOD STORY</span>
            <h1 className="page-title">
              {type === "hotels"
                ? `Stay a little in ${city}.`
                : type === "flights"
                  ? `Your ticket to ${city}.`
                  : type === "cars"
                    ? "Take the scenic route."
                    : type === "activities"
                      ? `A different side of ${city}.`
                      : type === "packages"
                        ? "A whole trip. A little less."
                        : type === "transfers"
                          ? "A smooth landing."
                          : "Good trips. Even better prices."}
            </h1>
            <p className="muted">
              Illustrative {city} search · Sample inventory, not live
              availability
            </p>
          </div>
        </div>
        <div className="results-layout">
          <aside className="filters">
            <h3>
              <SlidersHorizontal size={18} /> Make it your kind of trip
            </h3>
            <label>
              Budget per {type === "hotels" ? "night" : "person"}
              <b>{money(budget, currency)}</b>
              <input
                type="range"
                min="30"
                max="800"
                step="10"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
            </label>
            <h4>Your priorities</h4>
            <label className="check-label">
              <input
                type="checkbox"
                checked={rating}
                onChange={(e) => setRating(e.target.checked)}
              />{" "}
              Exceptional rating (9.3+)
            </label>
            {type === "hotels" && (
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={cancel}
                  onChange={(e) => setCancel(e.target.checked)}
                />{" "}
                Free cancellation
              </label>
            )}
            <button
              className="text-link"
              onClick={() => {
                setBudget(800);
                setRating(false);
                setCancel(false);
              }}
            >
              Reset filters
            </button>
            <div className="filter-note">
              <Shield />A little clarity goes a long way.
              <p>
                Every price is a sample. Your final total is shown before the
                demo review.
              </p>
            </div>
          </aside>
          <div>
            <div className="results-toolbar">
              <span>{list.length} lovely options</span>
              <label>
                Sort by{" "}
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="recommended">Recommended</option>
                  <option value="price">Lowest price</option>
                  <option value="rating">Highest rating</option>
                </select>
              </label>
            </div>
            <div className="result-list">
              {list.map((p) => (
                <article key={p.id} className="result-card">
                  <Link href={`${detailUrl(p)}?${params}`}>
                    <img src={p.image} alt={p.name} />
                  </Link>
                  <div className="result-content">
                    <span className="eyebrow">
                      {type === "hotels"
                        ? "★★★★ · BOUTIQUE STAY"
                        : p.type.toUpperCase()}
                    </span>
                    <Link href={`${detailUrl(p)}?${params}`}>
                      <h2>{p.name}</h2>
                    </Link>
                    <p className="muted">
                      <MapPin size={13} /> {city} · Carefully picked by SAMO
                    </p>
                    <p>{p.description}</p>
                    <span className="green-text">
                      <Check size={14} />
                      {p.feature}
                    </span>
                    <div className="result-bottom">
                      <span>
                        <b className="score">{p.rating}</b> Wonderful{" "}
                        <small>· Sample rating</small>
                      </span>
                      <div>
                        <strong>{money(p.price, currency)}</strong>
                        <small>
                          {" "}
                          /{" "}
                          {type === "hotels"
                            ? "night"
                            : type === "cars"
                              ? "day"
                              : "person"}
                        </small>
                        <Link
                          className="primary"
                          href={`${detailUrl(p)}?${params}`}
                        >
                          Take a look <ArrowUpRight size={17} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              {list.length === 0 && (
                <div className="empty">
                  <Sun />
                  <h2>A little too specific?</h2>
                  <p>Try a higher budget or fewer filters.</p>
                  <button
                    className="primary"
                    onClick={() => {
                      setBudget(800);
                      setRating(false);
                      setCancel(false);
                    }}
                  >
                    Show all options
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
function Shield() {
  return <Sun size={24} />;
}
export function TravelDetail({ product }: { product: Product }) {
  return product.type === "hotels" ? (
    <HotelDetail product={product} />
  ) : (
    <GenericDetail product={product} />
  );
}
function GenericDetail({ product: p }: { product: Product }) {
  const params = useSearchParams();
  const currency = useCurrency();
  const [gallery, setGallery] = useState(false),
    [saved, setSaved] = useState(false),
    [selected, setSelected] = useState(0);
  const hotel = p.type === "hotels",
    flight = p.type === "flights";
  const start = params.get("start") || "2027-07-10",
    end = params.get("end") || "2027-07-14";
  const days = Math.max(
    1,
    Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / 86400000,
    ) || 4,
  );
  const party = partyDetails(params);
  const guests = party.total;
  const rooms = Math.min(
    8,
    Math.max(Math.ceil(guests / 2), Number(params.get("rooms")) || 1),
  );
  const count = hotel
    ? days * rooms
    : p.type === "cars"
      ? days
      : p.type === "transfers"
        ? 1
        : guests;
  const price = p.price + selected * 35;
  const q = new URLSearchParams({
    product: p.id,
    start,
    end,
    guests: String(party.adults),
    children: party.children.join(","),
    rooms: String(rooms),
    option: String(selected),
  });
  return (
    <main className="container section">
      <p className="breadcrumb">
        <Link href={`/${p.type}`}>Explore {p.type}</Link> / {p.name}
      </p>
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            {hotel
              ? "★★★★ · A STAY WITH SOUL"
              : "A LITTLE SOMETHING TO LOOK FORWARD TO"}
          </span>
          <h1 className="page-title">{p.name}</h1>
          <p className="muted">
            Barcelona, Spain · <b>{p.rating}</b> Wonderful · Sample listing
          </p>
        </div>
        <button
          className="outline-button"
          aria-pressed={saved}
          onClick={() => setSaved(!saved)}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved for this visit" : "Save for this visit"}
        </button>
      </div>
      <button
        className="detail-gallery"
        onClick={() => setGallery(true)}
        aria-label="Open photo gallery"
      >
        <img src={p.image} alt={p.name} />
        <span>
          View photo <ArrowUpRight size={16} />
        </span>
      </button>
      <div className="detail-layout">
        <div>
          <nav className="detail-tabs">
            <a href="#overview">Overview</a>
            <a href="#options">
              {hotel ? "Rooms" : flight ? "Fares" : "Options"}
            </a>
            <a href="#good-to-know">Good to know</a>
          </nav>
          <section id="overview">
            <h2>A little more about your escape.</h2>
            <p>{p.description}</p>
            <div className="amenities">
              <span>
                <Wifi />
                Stay connected
              </span>
              <span>
                <Coffee />
                Local favorites
              </span>
              <span>
                <Sun />
                Good vibes included
              </span>
            </div>
          </section>
          <section id="options">
            <h2>
              {hotel
                ? "Find your perfect room."
                : flight
                  ? "A fare that fits your plans."
                  : "Make it yours."}
            </h2>
            {(hotel
              ? ["Cozy Double Room", "Roomy Double Room", "Terrace Suite"]
              : flight
                ? ["Basic", "Standard", "Flex"]
                : [
                    "Essential experience",
                    "Comfort experience",
                    "Premium experience",
                  ]
            ).map((name, i) => (
              <button
                key={name}
                className={`option-row ${selected === i ? "selected" : ""}`}
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
              >
                <span>
                  <b>{name}</b>
                  <small>
                    {hotel
                      ? `${20 + i * 8} m² · 1 double bed · 2 guests`
                      : flight
                        ? i === 0
                          ? "Small cabin bag · Non-refundable"
                          : i === 1
                            ? "Cabin bag + 23 kg checked bag · Change fees apply"
                            : "Checked bag · Changes included · Refundable"
                        : "For your selected travelers"}
                    <br />
                    {hotel
                      ? i > 0
                        ? "Breakfast included · Free cancellation until 7 days before arrival"
                        : "Room only · Non-refundable"
                      : p.feature}
                  </small>
                </span>
                <span>
                  <strong>{money(p.price + i * 35, currency)}</strong>
                  <small>
                    per {hotel ? "night" : p.type === "cars" ? "day" : "person"}
                  </small>
                  {selected === i ? (
                    <Check size={20} />
                  ) : (
                    <span className="radio-dot" />
                  )}
                </span>
              </button>
            ))}
          </section>
          <section id="good-to-know">
            <h2>Good to know before you go.</h2>
            <p>
              {hotel
                ? "Check-in from 15:00. Check-out before 11:00. The lead guest must be at least 18. Photo identification is required at check-in."
                : "Please arrive at least 20 minutes before the scheduled departure. Your sample itinerary will show the meeting details."}
            </p>
            <p>
              This is a demo listing. Photography is illustrative, and ratings,
              prices and availability are sample data. No supplier reservation
              is made.
            </p>
          </section>
        </div>
        <aside className="booking-summary">
          <span className="eyebrow">YOUR NEXT GOOD MEMORY</span>
          <h3>{p.name}</h3>
          <p>
            {start} → {end}
          </p>
          <p>
            {party.label}{" "}
            {hotel
              ? `· ${rooms} room${rooms > 1 ? "s" : ""} · ${days} nights`
              : ""}
          </p>
          <div className="price-row">
            <span>
              {money(price, currency)} × {count}{" "}
              {hotel ? "room nights" : "units"}
            </span>
            <b>{money(price * count, currency)}</b>
          </div>
          <div className="price-row">
            <span>Demo taxes & fees</span>
            <span>Included</span>
          </div>
          <div className="price-row total">
            <span>Total</span>
            <b>{money(price * count, currency)}</b>
          </div>
          <Link className="primary" href={`/checkout?${q}`}>
            Continue to demo booking <ArrowUpRight size={16} />
          </Link>
          <small>
            {hotel
              ? "Maximum 2 adults per room. Room count adjusts to fit your group. "
              : ""}
            No charge. No real reservation.
          </small>
        </aside>
      </div>
      <Dialog open={gallery} onOpenChange={setGallery}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{p.name}</DialogTitle>
          </DialogHeader>
          <img src={p.image} alt={p.name} className="gallery-full" />
        </DialogContent>
      </Dialog>
    </main>
  );
}
