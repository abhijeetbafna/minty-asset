import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 text-muted-foreground text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image
                src="/brand/logo-icon.svg"
                alt="Minty Logo"
                width={28}
                height={28}
              />
              <span className="font-bold text-base text-foreground tracking-tight">Minty</span>
            </div>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              A private, focused personal finance ledger designed specifically for Indian households.
              Track income, manage expenses, and view total invested capital with zero distractions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Core Features
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Philosophy
            </h4>
            <ul className="space-y-2 text-sm">
              <li>100% Manual & Private</li>
              <li>No Bank Integrations</li>
              <li>April–March FY Built-In</li>
              <li>Lakhs & Crores Native</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Minty. All rights reserved.</p>
          <p>Engineered for clarity, privacy, and long-term financial discipline.</p>
        </div>
      </div>
    </footer>
  );
}
