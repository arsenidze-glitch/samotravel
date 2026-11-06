"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Heart,
  MapPin,
  Check,
  ArrowUpRight,
  Wifi,
  Coffee,
  Sun,
  BedDouble,
  Users,
  Maximize,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";
import { type Product, money } from "@/lib/travel";
import {
  hotelInfo,
  samplePhotos,
  roomNames,
  nightsBetween,
} from "@/lib/hotel-info";
import { partyDetails } from "@/lib/travel-party";
import { useCurrency } from "./travel-shell";
import { TravelSearch } from "./travel-search";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
const reviews = [
  {
    name: "Alex",
    country: "United Kingdom",
    type: "Couples",
    title: "A lovely little base for exploring.",
    text: "The design felt thoughtful, the room was peaceful and we loved starting the day with coffee on the terrace.",
    score: "9.6",
    date: "October 2026",
  },
  {
    name: "Sofia",
    country: "Portugal",
    type: "Families",
    title: "A warm welcome, from start to finish.",
    text: "Friendly staff made our arrival easy. The neighborhood had plenty of places to eat and getting around was straightforward.",
    score: "9.2",
    date: "September 2026",
  },
  {
    name: "Jamie",
    country: "Australia",
    type: "Solo travelers",
    title: "Exactly the slower pace I needed.",
    text: "Comfortable bedding, a good shower and welcoming shared spaces. A great spot to come back to after a long day out.",
    score: "9.4",
    date: "September 2026",
  },
];
export function HotelDetail({ product: p }: { product: Product }) {
  const params = useSearchParams(),
    currency = useCurrency(),
    party = partyDetails(params),
    h = hotelInfo[p.id];
  const [saved, setSaved] = useState(false),
    [photo, setPhoto] = useState<number | null>(null),
    [selected, setSelected] = useState(0),
    [reviewType, setReviewType] = useState("All travelers");
  const start = params.get("start") || "2027-07-10",
    end = params.get("end") || "2027-07-14",
    nights = nightsBetween(start, end),
    price = p.price + selected * 35,
    total = price * nights * party.rooms;
  const photos = [
    { src: p.image, label: "Your next stay" },
    ...samplePhotos.filter(
      (x) => x.src.split("?")[0] !== p.image.split("?")[0],
    ),
  ];
  const q = new URLSearchParams({
    product: p.id,
    start,
    end,
    guests: String(party.adults),
    children: party.children.join(","),
    option: String(selected),
  });
  return (
    <main className="hotel-page">
      <div className="search-band">
        <div className="container">
          <TravelSearch
            compact
            values={{
              ...Object.fromEntries(params.entries()),
              destination: params.get("destination") || "Barcelona",
            }}
          />
        </div>
      </div>
      <div className="container section">
        <p className="breadcrumb">
          <Link href="/">Home</Link> /{" "}
          <Link href={`/hotels/barcelona?${params}`}>Barcelona stays</Link> /{" "}
          {p.name}
        </p>
        <div className="hotel-page-heading">
          <div>
            <span className="eyebrow">
              {"★".repeat(h.stars)} · {h.kind} · SAMO PICK
            </span>
            <h1 className="page-title">{p.name}</h1>
            <p>
              <MapPin size={16} />
              {h.address}, Barcelona, Spain{" "}
              <a href="#location">Explore the neighborhood</a>
            </p>
          </div>
          <div className="hotel-heading-actions">
            <button
              className="outline-button"
              aria-pressed={saved}
              onClick={() => setSaved(!saved)}
            >
              <Heart size={17} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved for this visit" : "Save this stay"}
            </button>
            <a className="primary" href="#options">
              Choose your room <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <div className="hotel-gallery-grid">
          {photos.map((x, i) => (
            <button
              key={x.src}
              onClick={() => setPhoto(i)}
              aria-label={`View ${x.label.toLowerCase()} photo`}
            >
              <img src={x.src} alt={`${x.label} — illustrative photography`} />
              {i === photos.length - 1 && (
                <span>
                  <Images size={16} /> See all {photos.length} photos
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="sample-caption">
          Illustrative photography · Demo listing. Facilities, reviews and
          policies below are sample content, not verified property details.
        </p>
        <nav className="hotel-section-nav" aria-label="Hotel sections">
          {[
            ["overview", "Overview"],
            ["options", "Rooms & rates"],
            ["facilities", "Facilities"],
            ["reviews", "Guest reviews"],
            ["location", "Location"],
            ["policies", "House rules"],
            ["faq", "FAQs"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="hotel-detail-columns">
          <div className="hotel-main-content">
            <section id="overview" className="hotel-section">
              <div className="overview-heading">
                <div>
                  <span className="eyebrow">CHECK IN. SWITCH OFF.</span>
                  <h2>A little place with a lot of soul.</h2>
                </div>
                <a href="#reviews" className="rating-tile">
                  <strong>{p.rating}</strong>
                  <span>
                    <b>Wonderful</b>
                    <small>{h.reviews.toLocaleString()} sample reviews</small>
                  </span>
                </a>
              </div>
              <p>
                {p.description} Set in {h.area}, this sample stay puts
                neighborhood cafés, local restaurants and a different side of
                Barcelona within easy reach. Come for the city; stay for the
                slow mornings.
              </p>
              <p>
                Expect comfortable rooms, thoughtfully chosen details and
                welcoming shared spaces. Whether you are planning a weekend for
                two or a family city break, there is room to make this trip your
                own.
              </p>
              <div className="hotel-highlights">
                <div>
                  <MapPin />
                  <b>A neighborhood to explore</b>
                  <small>{h.distance} km from the city center</small>
                </div>
                <div>
                  <Coffee />
                  <b>Make mornings your own</b>
                  <small>
                    {h.breakfast
                      ? "Breakfast included in the base rate"
                      : "Breakfast available on selected rates"}
                  </small>
                </div>
                <div>
                  <Wifi />
                  <b>A little more connected</b>
                  <small>Complimentary Wi-Fi in the sample stay</small>
                </div>
              </div>
            </section>
            <section id="options" className="hotel-section">
              <div className="overview-heading">
                <div>
                  <span className="eyebrow">YOUR ROOM, YOUR RHYTHM</span>
                  <h2>Find your perfect room.</h2>
                </div>
                <span className="subtle-pill">
                  {nights} nights · {party.total} guests
                </span>
              </div>
              <div className="room-search-summary">
                <BedDouble size={20} />
                <span>
                  <b>
                    {start} → {end}
                  </b>
                  <small>
                    {party.label} · {party.rooms} room
                    {party.rooms > 1 ? "s" : ""} automatically allocated
                  </small>
                </span>
              </div>
              <p className="sample-caption">
                Demo occupancy: up to 2 people per room, including children.
                Children use the same sample occupancy pricing. No live
                availability is checked.
              </p>
              {roomNames.map((name, i) => (
                <article
                  key={name}
                  className={`room-rate-card ${selected === i ? "chosen" : ""}`}
                >
                  <div className="room-rate-top">
                    <img
                      src={photos[i % photos.length].src}
                      alt={`Illustrative ${name.toLowerCase()}`}
                    />
                    <div>
                      <h3>{name}</h3>
                      <div className="room-facts">
                        <span>
                          <Maximize size={15} />
                          {20 + i * 8} m²
                        </span>
                        <span>
                          <BedDouble size={15} />1 double bed
                        </span>
                        <span>
                          <Users size={15} />2 guests per room
                        </span>
                      </div>
                      <p>
                        {i === 2
                          ? "Private terrace · Outdoor seating · Extra living space"
                          : i === 1
                            ? "Extra space to unwind · Seating area · Courtyard outlook"
                            : "A cozy city base · Quiet interiors · Thoughtful details"}
                      </p>
                      <small>
                        Private bathroom · Air conditioning · Free Wi-Fi · Safe
                        · Hairdryer
                      </small>
                    </div>
                  </div>
                  <div className="room-rate-bottom">
                    <div>
                      <span className="green-text">
                        <Check size={15} />
                        {i > 0 || h.breakfast
                          ? "Breakfast included"
                          : "Room only"}
                      </span>
                      <span className={i > 0 ? "green-text" : "muted"}>
                        {i > 0
                          ? "Free cancellation until 7 days before arrival"
                          : "Non-refundable rate"}
                      </span>
                      <small>
                        {i > 0
                          ? "After the cancellation deadline: first night charged (sample policy)."
                          : "Changes and cancellation are not included (sample policy)."}
                      </small>
                    </div>
                    <div>
                      <strong>
                        {money(p.price + i * 35, currency)}
                        <small> / room / night</small>
                      </strong>
                      <small>
                        {money(
                          (p.price + i * 35) * nights * party.rooms,
                          currency,
                        )}{" "}
                        for your whole stay · Demo taxes included
                      </small>
                      <button
                        className={
                          selected === i ? "outline-button" : "primary"
                        }
                        aria-pressed={selected === i}
                        onClick={() => setSelected(i)}
                      >
                        {selected === i ? (
                          <>
                            <Check size={16} />
                            Selected
                          </>
                        ) : (
                          "Select room"
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
            <section id="facilities" className="hotel-section">
              <span className="eyebrow">THE LITTLE THINGS, TAKEN CARE OF</span>
              <h2>Facilities & services</h2>
              <div className="facility-chips large">
                {h.amenities.map((a) => (
                  <span key={a}>
                    <Check size={16} />
                    {a}
                  </span>
                ))}
              </div>
              <div className="facility-grid">
                {Object.entries({
                  "In your room": [
                    "Private bathroom with shower",
                    "Air conditioning",
                    "Fresh towels and toiletries",
                    "Hairdryer and in-room safe",
                    "Complimentary Wi-Fi",
                  ],
                  "Food & drink": [
                    "Breakfast on selected rates",
                    "Local cafés nearby",
                    ...(h.amenities.includes("Restaurant")
                      ? ["On-site restaurant (sample)"]
                      : []),
                  ],
                  "Guest services": [
                    "Luggage storage",
                    "Front-desk assistance",
                    "Local recommendations",
                    "Housekeeping",
                  ],
                  "Comfort & access": [
                    "Non-smoking rooms",
                    ...(h.amenities.includes("Accessible rooms")
                      ? ["Accessible rooms on request"]
                      : ["Contact the property about accessibility"]),
                    "Special requests subject to confirmation",
                  ],
                }).map(([title, items]) => (
                  <div key={title}>
                    <h3>{title}</h3>
                    <ul>
                      {items.map((x) => (
                        <li key={x}>
                          <Check size={14} />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
            <section id="reviews" className="hotel-section">
              <div className="overview-heading">
                <div>
                  <span className="eyebrow">
                    LITTLE MOMENTS, BIG IMPRESSIONS
                  </span>
                  <h2>What guests are saying</h2>
                </div>
                <span className="subtle-pill">Illustrative reviews</span>
              </div>
              <div className="review-breakdown">
                <div className="review-overall">
                  <strong>{p.rating}</strong>
                  <h3>Wonderful</h3>
                  <small>{h.reviews.toLocaleString()} sample reviews</small>
                </div>
                <div className="review-bars">
                  {[
                    ["Cleanliness", 9.5],
                    ["Comfort", 9.4],
                    ["Location", 9.3],
                    ["Staff", 9.7],
                    ["Value for money", 9.0],
                    ["Free Wi-Fi", 9.2],
                  ].map(([label, score]) => (
                    <div key={label}>
                      <span>
                        {label}
                        <b>{score}</b>
                      </span>
                      <meter
                        min={0}
                        max={10}
                        value={Number(score)}
                        aria-label={String(label)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <label className="review-filter">
                Travelers{" "}
                <select
                  value={reviewType}
                  onChange={(e) => setReviewType(e.target.value)}
                >
                  <option>All travelers</option>
                  <option>Couples</option>
                  <option>Families</option>
                  <option>Solo travelers</option>
                </select>
              </label>
              <div className="review-cards">
                {reviews
                  .filter(
                    (r) =>
                      reviewType === "All travelers" || r.type === reviewType,
                  )
                  .map((r) => (
                    <article key={r.name}>
                      <div className="review-author">
                        <span className="avatar-letter">{r.name[0]}</span>
                        <span>
                          <b>{r.name}</b>
                          <small>
                            {r.country} · {r.type}
                          </small>
                        </span>
                        <b className="score">{r.score}</b>
                      </div>
                      <h3>{r.title}</h3>
                      <p>{r.text}</p>
                      <small>
                        {r.date} · Fictional example, not a verified review
                      </small>
                    </article>
                  ))}
              </div>
            </section>
            <section id="location" className="hotel-section">
              <span className="eyebrow">
                GET A LITTLE LOST. FIND SOMETHING GOOD.
              </span>
              <h2>Explore {h.area}</h2>
              <div className="neighborhood-panel">
                <MapPin size={30} />
                <div>
                  <h3>{h.address}</h3>
                  <p>
                    {h.area}, Barcelona, Spain · {h.distance} km from the center
                  </p>
                  <a
                    className="text-link"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + " " + h.address + " Barcelona")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open location in Google Maps <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
              <div className="facility-grid">
                <div>
                  <h3>Around the neighborhood</h3>
                  <ul>
                    <li>Local cafés and bakeries</li>
                    <li>Independent shops and restaurants</li>
                    <li>City streets made for wandering</li>
                    <li>Public transport connections</li>
                  </ul>
                </div>
                <div>
                  <h3>Getting here</h3>
                  <p>
                    Barcelona El Prat Airport (BCN) serves the city. Train, bus
                    and taxi options are available; journey times depend on your
                    route and traffic.
                  </p>
                  <small>
                    Check current schedules and accessibility with the operator
                    before traveling.
                  </small>
                </div>
              </div>
            </section>
            <section id="policies" className="hotel-section">
              <h2>Good to know before you go.</h2>
              <div className="policy-list">
                {[
                  [
                    "Check-in",
                    "From 15:00. Photo ID is required. Lead guest must be at least 18.",
                  ],
                  [
                    "Check-out",
                    "By 11:00. Late check-out is subject to availability and may cost extra.",
                  ],
                  [
                    "Children & extra beds",
                    "All ages are welcome in this demo. Include each child’s age when searching. Cots and extra beds require confirmation; they are not included in the sample price.",
                  ],
                  [
                    "Cancellation",
                    "Conditions depend on your selected room rate. See the cancellation terms beside each room before continuing.",
                  ],
                  [
                    "Pets",
                    h.amenities.includes("Pet friendly")
                      ? "Pets on request. Restrictions and additional charges may apply."
                      : "Pet stays are not included in this sample listing. Contact the property to confirm.",
                  ],
                  [
                    "Smoking & quiet hours",
                    "Non-smoking rooms. Please respect other guests and any property quiet-hour rules.",
                  ],
                  [
                    "Payment & taxes",
                    "All shown prices are illustrative and include demo taxes and fees. No charge or supplier reservation is made.",
                  ],
                ].map(([title, text]) => (
                  <div key={title}>
                    <b>{title}</b>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </section>
            <section id="faq" className="hotel-section hotel-faq">
              <h2>A few things you might be wondering.</h2>
              {[
                [
                  "Is breakfast included?",
                  "Breakfast is included with the Roomy Double and Terrace Suite demo rates. Check your selected rate for the exact inclusions.",
                ],
                [
                  "Can I cancel my stay?",
                  "The Cozy Double base rate is non-refundable. The other sample rates allow cancellation up to 7 days before arrival. These terms illustrate the interface and do not create a booking contract.",
                ],
                [
                  "How are rooms allocated for families?",
                  "The demo automatically allocates one room per two guests, counting adults and children. Actual connecting rooms, bedding and child pricing must be confirmed with the property.",
                ],
                [
                  "Can I request an accessible room?",
                  "Accessibility needs should be confirmed directly with the property before booking. A sample facilities label does not guarantee a particular room or access arrangement.",
                ],
                [
                  "Is this a real reservation?",
                  "No. SAMO currently lets you explore a sample itinerary. Your details are not stored and no payment is collected.",
                ],
              ].map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </section>
          </div>
          <aside className="booking-summary hotel-booking">
            <span className="eyebrow">YOUR NEXT GOOD MEMORY</span>
            <div className="booking-price">
              <strong>{money(price, currency)}</strong>
              <span> / room / night</span>
            </div>
            <p>
              <b>{roomNames[selected]}</b>
            </p>
            <div className="booking-dates">
              <span>
                <small>Check-in</small>
                <b>{start}</b>
              </span>
              <span>
                <small>Check-out</small>
                <b>{end}</b>
              </span>
            </div>
            <p>
              <Users size={15} /> {party.label}
            </p>
            <p>
              {party.rooms} rooms · {nights} nights · Automatically allocated
            </p>
            <div className="price-row">
              <span>
                {money(price, currency)} × {nights * party.rooms} room nights
              </span>
              <b>{money(total, currency)}</b>
            </div>
            <div className="price-row">
              <span>Demo taxes & fees</span>
              <b>Included</b>
            </div>
            <div className="price-row total">
              <span>Your stay total</span>
              <b>{money(total, currency)}</b>
            </div>
            <Link className="primary" href={`/checkout?${q}`}>
              Continue to demo booking <ArrowUpRight size={16} />
            </Link>
            <p className="green-text">
              <ShieldCheck size={16} />
              {selected > 0
                ? "Free cancellation on this rate"
                : "Non-refundable sample rate"}
            </p>
            <small>
              No charge. No real reservation. Your selected dates, travelers and
              room carry through to checkout.
            </small>
            <div className="booking-help">
              <Sun size={20} />
              <span>
                A little clarity goes a long way.
                <small>All rates and availability are illustrative.</small>
              </span>
            </div>
          </aside>
        </div>
      </div>
      <Dialog
        open={photo !== null}
        onOpenChange={(v) => {
          if (!v) setPhoto(null);
        }}
      >
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {p.name} — {photo !== null ? photos[photo].label : ""}
            </DialogTitle>
            <DialogDescription>
              Illustrative photography, not verified property photos.
            </DialogDescription>
          </DialogHeader>
          {photo !== null && (
            <>
              <img
                className="gallery-full"
                src={photos[photo].src}
                alt={photos[photo].label}
              />
              <div className="gallery-controls">
                <button
                  className="outline-button"
                  aria-label="Previous photo"
                  onClick={() =>
                    setPhoto((photo + photos.length - 1) % photos.length)
                  }
                >
                  <ChevronLeft />
                </button>
                <span>
                  {photo + 1} / {photos.length}
                </span>
                <button
                  className="outline-button"
                  aria-label="Next photo"
                  onClick={() => setPhoto((photo + 1) % photos.length)}
                >
                  <ChevronRight />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
