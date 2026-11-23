import Link from "next/link";
import { BRAND } from "@/config/brand";

export default function HomePage() {
  return (
    <div className="shell min-h-screen flex flex-col justify-between p-6 sm:p-12">
      <header className="hero rounded-[2rem] p-8 sm:p-12 text-white shadow-2xl">
        <div className="stripes" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="text-xs uppercase tracking-wider text-[var(--baby)] font-semibold">
            Faza 0: Fundament & System Wyglądu
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {BRAND.name}
            <em className="font-normal block text-white/80 text-2xl sm:text-3xl mt-1">
              {BRAND.description}
            </em>
          </h1>
          <p className="text-sm text-white/70 max-w-lg">
            Platforma do planowania pracy i budżetu w stylu Soft Pink Glass. Kliknij poniżej, aby otworzyć galerię komponentów.
          </p>
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/design"
              className="btn rose text-sm px-6 py-3 font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Otwórz System Wyglądu (/design) →
            </Link>
            <a
              href="/reference/velodrome-dashboard.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn dark text-sm px-5 py-3 font-medium"
            >
              Podgląd Prototypu HTML ↗
            </a>
          </div>
        </div>
      </header>

      <footer className="mt-8 text-center text-xs text-[var(--muted)]">
        {BRAND.name} &copy; 2026. Zbudowane według specyfikacji <code>PLAN-platforma.md</code>.
      </footer>
    </div>
  );
}
