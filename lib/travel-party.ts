export function parseChildren(value: string | null | undefined): number[] {
  if (!value) return [];
  return value
    .split(",")
    .slice(0, 6)
    .map(Number)
    .filter((age) => Number.isInteger(age) && age >= 0 && age <= 17);
}
export function partyDetails(params: { get: (key: string) => string | null }) {
  const adults = Math.min(8, Math.max(1, Number(params.get("guests")) || 2));
  const children = parseChildren(params.get("children"));
  const total = adults + children.length;
  const rooms = Math.ceil(total / 2);
  const label = `${adults} adult${adults > 1 ? "s" : ""}${children.length ? ` · ${children.length} child${children.length > 1 ? "ren" : ""} (ages ${children.join(", ")})` : ""}`;
  return { adults, children, total, rooms, label };
}
