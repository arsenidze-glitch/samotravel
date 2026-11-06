"use client";
import { useId, useState } from "react";
import { MapPin, Plane, Building2 } from "lucide-react";
const places = [
  ["Barcelona", "Spain", "City"],
  ["Barcelona El Prat (BCN)", "Spain", "Airport"],
  ["Lisbon", "Portugal", "City"],
  ["Santorini", "Greece", "Island"],
  ["Bali", "Indonesia", "Island"],
  ["Kyoto", "Japan", "City"],
  ["Paris", "France", "City"],
  ["London", "United Kingdom", "City"],
  ["London Heathrow (LHR)", "United Kingdom", "Airport"],
  ["Dubai", "United Arab Emirates", "City"],
  ["Rome", "Italy", "City"],
  ["New York", "United States", "City"],
  ["Casa Bonay", "Barcelona, Spain", "Hotel"],
];
export function DestinationInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const id = useId(),
    [open, setOpen] = useState(false),
    [typed, setTyped] = useState(false),
    [active, setActive] = useState(0);
  const options = places.filter(
    (p) => !typed || p.join(" ").toLowerCase().includes(value.toLowerCase()),
  );
  function choose(name: string) {
    onChange(name);
    setOpen(false);
    setTyped(false);
  }
  return (
    <div
      className="destination-combobox"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={
          open && options[active] ? `${id}-${active}` : undefined
        }
        autoComplete="off"
        value={value}
        required
        onFocus={() => {
          setOpen(true);
          setTyped(false);
          setActive(0);
        }}
        onClick={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setTyped(true);
          setOpen(true);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;
          if (e.key === "Escape") {
            setOpen(false);
            e.preventDefault();
          }
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            setActive((i) =>
              Math.max(
                0,
                Math.min(
                  options.length - 1,
                  i + (e.key === "ArrowDown" ? 1 : -1),
                ),
              ),
            );
          }
          if (e.key === "Enter" && open) {
            e.preventDefault();
            if (options[active]) choose(options[active][0]);
          }
        }}
      />
      {open && (
        <div className="destination-dropdown">
          <p>
            {typed ? "Matching destinations" : "Popular destinations"}{" "}
            <small>Demo suggestions</small>
          </p>
          <ul
            role="listbox"
            id={`${id}-list`}
            aria-label="Destination suggestions"
          >
            {options.map(([name, country, kind], i) => (
              <li
                key={name}
                role="option"
                id={`${id}-${i}`}
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(name)}
              >
                <span className="place-icon">
                  {kind === "Airport" ? (
                    <Plane size={19} />
                  ) : kind === "Hotel" ? (
                    <Building2 size={19} />
                  ) : (
                    <MapPin size={19} />
                  )}
                </span>
                <span>
                  <b>{name}</b>
                  <small>{country}</small>
                </span>
                <small>{kind}</small>
              </li>
            ))}
          </ul>
          {!options.length && (
            <p>No matches. You can still search this destination.</p>
          )}
        </div>
      )}
    </div>
  );
}
