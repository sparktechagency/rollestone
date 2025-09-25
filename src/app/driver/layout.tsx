import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SecurityProvider from "@/provider/security-provider";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import GlobalJourneyUpdater from "./global-journey-updater";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" rounded />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col bg-[#E8F1FB]">
          <Suspense
            fallback={
              <div className={`flex justify-center items-center h-24 mx-auto`}>
                <Loader2Icon className={`animate-spin`} />
              </div>
            }
          >
            <SecurityProvider>
              {children}
              <GlobalJourneyUpdater />
            </SecurityProvider>
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
