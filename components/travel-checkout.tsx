"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Download } from "lucide-react";
import { products, money } from "@/lib/travel";
import { useCurrency } from "./travel-shell";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
export function TravelCheckout() {
  const params = useSearchParams(),
    currency = useCurrency();
  const p = products.find((x) => x.id === params.get("product")) || products[0];
  const [step, setStep] = useState(0),
    [first, setFirst] = useState(""),
    [last, setLast] = useState(""),
    [email, setEmail] = useState(""),
    [extra, setExtra] = useState(false),
    [accepted, setAccepted] = useState(false);
  const guests = Math.min(8, Math.max(1, Number(params.get("guests")) || 2)),
    rooms = Math.min(
      8,
      Math.max(Math.ceil(guests / 2), Number(params.get("rooms")) || 1),
    );
  const start = params.get("start") || "2027-07-10",
    end = params.get("end") || "2027-07-14";
  const days = Math.max(
    1,
    Math.round(
      (new Date(end).getTime() - new Date(start).getTime()) / 86400000,
    ) || 4,
  );
  const option = Math.min(2, Math.max(0, Number(params.get("option")) || 0));
  const count =
    p.type === "hotels"
      ? days * rooms
      : p.type === "cars"
        ? days
        : p.type === "transfers"
          ? 1
          : guests;
  const base = (p.price + option * 35) * count,
    total = base + (extra ? 35 : 0);
  const steps = ["Your details", "Little extras", "Demo payment", "Review"];
  function download() {
    const text = `SAMO TRAVEL — DEMO ITINERARY\nNot a reservation. No payment taken.\n${p.name}\n${start} to ${end}\n${guests} travelers\nIllustrative total: ${money(total, currency)}`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "samo-demo-itinerary.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  if (step === 4)
    return (
      <main className="container confirmation section">
        <div className="confirmation-icon">
          <Check size={38} />
        </div>
        <span className="eyebrow">THAT FEELING BEFORE A GOOD TRIP</span>
        <h1>Your demo itinerary is ready.</h1>
        <p>No booking was made, no payment was taken, and no email was sent.</p>
        <div className="panel">
          <img src={p.image} alt={p.name} />
          <h2>{p.name}</h2>
          <p>
            {start} — {end} · {guests} travelers
          </p>
          <p>
            Illustrative total: <b>{money(total, currency)}</b>
          </p>
          <button className="primary" onClick={download}>
            <Download size={18} />
            Download demo itinerary
          </button>
        </div>
        <Link className="text-link" href="/">
          Keep exploring <ArrowRight size={17} />
        </Link>
      </main>
    );
  return (
    <main className="container section">
      <p className="breadcrumb">
        <Link href="/">Home</Link> / Your trip / Demo checkout
      </p>
      <h1 className="page-title">A few details. Then the daydreaming.</h1>
      <p className="demo-notice">
        <ShieldCheck size={18} /> Demo mode. Use fictional details. Nothing is
        saved or charged.
      </p>
      <ol className="checkout-steps">
        {steps.map((s, i) => (
          <li
            className={step === i ? "current" : step > i ? "complete" : ""}
            key={s}
          >
            <span>{step > i ? <Check size={14} /> : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <div className="checkout-layout">
        <form
          className="panel checkout-form"
          onSubmit={(e) => {
            e.preventDefault();
            setStep(step + 1);
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        >
          <h2>{steps[step]}</h2>
          {step === 0 && (
            <>
              <p>Who should we put on the demo itinerary?</p>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="first">First name</FieldLabel>
                  <Input
                    id="first"
                    required
                    value={first}
                    onChange={(e) => setFirst(e.target.value)}
                    autoComplete="given-name"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last">Last name</FieldLabel>
                  <Input
                    id="last"
                    required
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
                    autoComplete="family-name"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input
                    id="email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="traveler@example.com"
                  />
                  <small>Demo only. We will not send an email.</small>
                </Field>
              </FieldGroup>
            </>
          )}
          {step === 1 && (
            <>
              <p>No pressure. Just a little extra comfort.</p>
              <label className="option-row">
                <span>
                  <b>Arrival transfer add-on</b>
                  <small>
                    One private city transfer for your group, up to 8 travelers.
                    <br />
                    Illustrative service only.
                  </small>
                </span>
                <span>
                  {money(35, currency)}
                  <input
                    type="checkbox"
                    checked={extra}
                    onChange={(e) => setExtra(e.target.checked)}
                  />
                </span>
              </label>
              <p className="muted">You can continue without any extras.</p>
            </>
          )}
          {step === 2 && (
            <>
              <ShieldCheck size={38} />
              <h3>All the journey. None of the charge.</h3>
              <p>
                This prototype does not collect card numbers or process
                payments. Continue to preview your order review.
              </p>
              <div className="demo-notice">
                Payment method: Demo — no charge
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h3>
                {first} {last}
              </h3>
              <p>{email}</p>
              <p>
                {guests} travelers · {start} to {end}
              </p>
              <p>
                {p.name} · {["Essential", "Comfort", "Premium"][option]} option
              </p>
              <p>
                {extra ? "Arrival transfer included" : "No extras selected"}
              </p>
              <p>
                Cancellation: this is not a real reservation. The sample product
                conditions do not create a contract.
              </p>
              <label className="check-label">
                <input
                  required
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />{" "}
                I understand that this creates a demo itinerary, not a real
                booking.
              </label>
            </>
          )}
          <div className="checkout-actions">
            {step > 0 && (
              <button
                type="button"
                className="outline-button"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            <button className="primary" type="submit">
              {step === 3 ? "Create demo itinerary" : "Continue"}
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
        <aside className="booking-summary">
          <img src={p.image} alt={p.name} />
          <h3>{p.name}</h3>
          <p>
            {start} → {end}
          </p>
          <p>
            {guests} travelers{" "}
            {p.type === "hotels" ? `· ${days} nights · ${rooms} rooms` : ""}
          </p>
          <div className="price-row">
            <span>Your selection</span>
            <b>{money(base, currency)}</b>
          </div>
          <div className="price-row">
            <span>Extras</span>
            <b>{money(extra ? 35 : 0, currency)}</b>
          </div>
          <div className="price-row">
            <span>Demo taxes & fees</span>
            <span>Included</span>
          </div>
          <div className="price-row total">
            <span>Illustrative total</span>
            <b>{money(total, currency)}</b>
          </div>
          <small>Actual amount charged: {money(0, currency)}</small>
        </aside>
      </div>
    </main>
  );
}
