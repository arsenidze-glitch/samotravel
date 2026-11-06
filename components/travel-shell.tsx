"use client";
import Link from "next/link";
import { useState, createContext, useContext } from "react";
import {
  Menu,
  Globe,
  ChevronDown,
  Heart,
  ArrowUpRight,
  Headphones,
  Plane,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { categories } from "@/lib/travel";
const CurrencyContext = createContext("EUR");
export const useCurrency = () => useContext(CurrencyContext);
export function TravelShell({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState("EUR");
  const [menu, setMenu] = useState(false);
  const [language, setLanguage] = useState(false);
  return (
    <CurrencyContext.Provider value={currency}>
      <header className="site-header">
        <div className="container header-row">
          <Link href="/" aria-label="SAMO Travel homepage">
            <img
              className="brand"
              src="/samo-logo.svg"
              alt="SAMO Travel. Anywhere. Simply."
            />
          </Link>
          <nav className="desktop-nav">
            {categories.slice(0, 4).map((c) => (
              <Link key={c.path} href={`/${c.path}`}>
                {c.name}
              </Link>
            ))}
            <Link href="/activities">Things to do</Link>
            <Link href="/deals" className="deals-link">
              Deals <span>↗</span>
            </Link>
          </nav>
          <div className="header-actions">
            <label className="currency">
              <span className="sr-only">Currency</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option>EUR</option>
                <option>USD</option>
                <option>GBP</option>
              </select>
            </label>
            <button className="language" onClick={() => setLanguage(true)}>
              <Globe size={15} /> EN
            </button>
            <Link className="help-icon" href="/help" aria-label="Help center">
              <Headphones size={19} />
            </Link>
            <Link className="signin" href="/login">
              Sign in <ArrowUpRight size={15} />
            </Link>
            <button
              className="mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMenu(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>
      <Dialog open={menu} onOpenChange={setMenu}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Where to next?</DialogTitle>
          </DialogHeader>
          <nav className="mobile-links">
            {categories.map((c) => (
              <Link
                onClick={() => setMenu(false)}
                key={c.path}
                href={`/${c.path}`}
              >
                {c.name}
                <ArrowRight size={16} />
              </Link>
            ))}
            <Link href="/destinations" onClick={() => setMenu(false)}>
              Explore destinations
            </Link>
            <Link href="/help" onClick={() => setMenu(false)}>
              Help center
            </Link>
          </nav>
        </DialogContent>
      </Dialog>
      <Dialog open={language} onOpenChange={setLanguage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>A world without language barriers</DialogTitle>
            <DialogDescription>
              English is our starting language. More languages will join the
              journey soon.
            </DialogDescription>
          </DialogHeader>
          <button className="primary" onClick={() => setLanguage(false)}>
            Continue in English
          </button>
        </DialogContent>
      </Dialog>
      {children}
      <footer>
        <div className="container footer-grid">
          <div>
            <Link href="/">
              <img src="/samo-logo.svg" alt="SAMO Travel" width="160" />
            </Link>
            <p>
              Less planning.
              <br />
              More living.
            </p>
            <a href="/samo-logo.svg" download className="small-link">
              Download our logo <ArrowUpRight size={13} />
            </a>
          </div>
          {[
            ["Explore", "Stays", "Flights", "Flight + Hotel", "Things to do"],
            [
              "A little help",
              "Help center",
              "Manage booking",
              "Cancellation information",
              "Contact us",
            ],
            [
              "The fine print",
              "About Samotravel",
              "Terms & conditions",
              "Privacy policy",
              "Cookie policy",
            ],
          ].map((group, i) => (
            <div key={group[0]}>
              <h4>{group[0]}</h4>
              {group.slice(1).map((name, j) => (
                <Link
                  key={name}
                  href={
                    i === 0
                      ? ["/hotels", "/flights", "/packages", "/activities"][j]
                      : i === 1
                        ? [
                            "/help",
                            "/manage-booking",
                            "/help/cancellations",
                            "/contact",
                          ][j]
                        : ["/about", "/terms", "/privacy", "/cookies"][j]
                  }
                >
                  {name}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Samotravel.com. Go somewhere good.
          </span>
          <span>Demo experience · Illustrative prices · No real bookings</span>
          <span>
            Made for the way you travel <Plane size={14} />
          </span>
        </div>
      </footer>
    </CurrencyContext.Provider>
  );
}
