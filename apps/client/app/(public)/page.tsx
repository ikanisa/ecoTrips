import { BottomNavDock, CardGlass, buttonClassName } from "@ecotrips/ui";
import type { BottomNavItem } from "@ecotrips/ui";
import { availableLocales, createTranslator } from "@ecotrips/i18n";
import { OptionCard } from "./components/OptionCard";

const navItems = [
  { href: "/", label: "Home", icon: "🏡" },
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/wallet", label: "Wallet", icon: "👛" },
  { href: "/support", label: "Support", icon: "💬" },
] as const satisfies readonly BottomNavItem[];

function toURLSearchParams(params: Record<string, string | string[] | undefined>) {
  const pairs: [string, string][] = [];
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((entry) => pairs.push([key, entry]));
    } else if (typeof value === "string") {
      pairs.push([key, value]);
    }
  }
  return new URLSearchParams(pairs);
}

function getLocale(searchParams: URLSearchParams) {
  const candidate = searchParams.get("lang");
  if (candidate && availableLocales.includes(candidate as (typeof availableLocales)[number])) {
    return candidate as (typeof availableLocales)[number];
  }
  return "en";
}

export default function HomePage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const locale = getLocale(toURLSearchParams(searchParams));
  const t = createTranslator(locale);

  return (
    <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-4 pb-32 pt-10">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
          <span aria-hidden>🌿</span>
          <span>ecoTrips · Rwanda</span>
        </span>
        <h1 className="text-3xl font-semibold text-white">{t("app.tagline")}</h1>
        <p className="text-sm text-white/70">{t("home.secondary")}</p>
        <div className="flex flex-wrap gap-2 text-xs text-white/50">
          <span>Offline-first caches itinerary JSON + tickets</span>
          <span>Supabase realtime updates</span>
          <span>PlannerCoPilot + ConciergeGuide</span>
        </div>
      </header>
        <CardGlass
          title={t("home.cta")}
          subtitle="PlannerCoPilot turns vague intents into price-aware itineraries."
          actions={
            <a href="/search" className={buttonClassName()}>
              {t("search.cta")}
            </a>
          }
        >
        <p>Share your dream route — Kigali sunsets, Akagera safari, Nyungwe canopy. We keep daylight transfers and safety nudges.</p>
      </CardGlass>
      <OptionCard
        title="Carbon-neutral & travel assurance"
        subtitle="Bundle carbon offsets with medical cover from our phase-one partners."
        actionLabel="Review coverage"
        actionHref="/wallet?tab=protections"
      >
        <p>EcoCare pairs parametric weather coverage with the same payout ledgers you see in the admin console. Carbon sink receipts flow into your wallet ledger for transparency.</p>
        <p className="text-xs text-white/60">Insurance and carbon toggles stream through reward-grant so balances stay in sync even when fixtures power the UI.</p>
      </OptionCard>
      <CardGlass
        title="Split-pay escrows"
        subtitle="Create groups with WhatsApp invites, contributions, and payout audit trails."
      >
        <ul className="space-y-2 text-sm text-white/80">
          <li>• Hold seats for 15 minutes via inventory-hold edge function.</li>
          <li>• Contributions recorded with idempotency keys and ledger snapshots.</li>
          <li>• ConciergeGuide pushes daily briefs and safety alerts during the trip.</li>
        </ul>
      </CardGlass>
      <OptionCard
        title="Invite friends, earn travel credit"
        subtitle="Share your concierge with your crew – rewards land in your wallet automatically."
        actionLabel="Copy referral link"
        actionHref="/wallet?tab=referrals"
      >
        <p>Referral invites issue via the new referral-link edge function. We confirm consent and reuse idempotency keys so your friends never get duplicate SMS or WhatsApp pings.</p>
        <p className="text-xs text-white/60">PlannerCoPilot logs fixture fallbacks whenever growth services are offline so you always see a link.</p>
      </OptionCard>
      <BottomNavDock items={navItems} />
    </div>
  );
}
