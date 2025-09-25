"use client";

import { type Icon } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ZapIcon } from "lucide-react";
import { useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const [active, setActive] = useState(true);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {!pathname.includes("/admin") && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="border h-14 flex items-center justify-center text-lg font-semibold"
                variant={active ? "success" : "destructive"}
                onClick={() => {
                  setActive(!active);
                }}
              >
                <ZapIcon className="size-8" />
                <span>Auto {active ? "on" : "off"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={`${
                    isActive
                      ? "bg-blue-500 hover:bg-blue-500/90 !text-background"
                      : ""
                  }`}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon className="size-5" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
