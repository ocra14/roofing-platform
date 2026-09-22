import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Icon } from "@/components/ui/icon";
import { getCompanySettings } from "@/lib/cms";
import { DemoBanner } from "@/components/admin/demo-banner";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login/");
  }

  const role = (session.user as { role?: string }).role;
  const company = await getCompanySettings();

  return (
    <div className="flex min-h-screen bg-canvas">
      <AdminSidebar
        companyName={company.name}
        role={role as any}
        userName={session.user.name || "User"}
        email={session.user.email || ""}
      />

      <div className="flex flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-surface/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold text-primary lg:hidden">
              {company.name}
            </span>
            <span className="hidden text-sm text-muted lg:block">
              Welcome back, <span className="font-semibold text-ink">{session.user.name}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge hidden capitalize sm:inline-flex">{role?.toLowerCase()}</span>
            <Link href="/" target="_blank" className="btn btn-outline btn-sm" aria-label="View website">
              <Icon name="eye" size={15} />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login/" });
              }}
            >
              <button type="submit" className="btn btn-outline btn-sm" aria-label="Sign out">
                <Icon name="logout" size={15} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </header>

        <DemoBanner />

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
