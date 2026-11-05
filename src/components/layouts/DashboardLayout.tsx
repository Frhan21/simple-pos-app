import {
  BarChart3,
  Grid3X3,
  LogOut,
  Package,
  ShoppingCart,
} from "lucide-react";
import React, { type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SignOutButton } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SimplePosMark } from "@/components/brand/SimplePosMark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DashboardHeader = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <header className={cn("mb-8", className)}>{children}</header>;
export const DashboardTitle = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <h1
    className={cn(
      "text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl",
      className,
    )}
  >
    {children}
  </h1>
);
export const DashboardDescription = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={cn(
      "text-muted-foreground mt-2 max-w-2xl text-[15px] leading-relaxed",
      className,
    )}
  >
    {children}
  </p>
);

const groups = [
  {
    label: "Sell",
    items: [{ href: "/dashboard", label: "New order", icon: ShoppingCart }],
  },
  {
    label: "Manage",
    items: [
      { href: "/products", label: "Products", icon: Package },
      { href: "/categories", label: "Categories", icon: Grid3X3 },
      { href: "/sales", label: "Sales", icon: BarChart3 },
    ],
  },
];

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  return (
    <SidebarProvider defaultOpen>
      <div className="bg-sidebar flex min-h-svh w-full p-0 md:p-2">
        <Sidebar variant="inset" collapsible="icon" className="md:py-2 md:pl-2">
          <SidebarHeader className="px-3 py-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 overflow-hidden font-bold tracking-[-0.03em]"
            >
              <SimplePosMark className="text-sidebar-primary size-8 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                Simple POS
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-2">
            {groups.map((group) => (
              <SidebarGroup key={group.label} className="py-3">
                <SidebarGroupLabel className="px-2 text-xs font-medium tracking-normal normal-case">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = router.pathname === item.href;
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            tooltip={item.label}
                            isActive={active}
                            className="h-10 rounded-sm"
                          >
                            <Link href={item.href}>
                              <Icon className="size-4" />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter className="gap-2 p-3">
            <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
              <span className="text-muted-foreground text-xs group-data-[collapsible=icon]:hidden">
                Appearance
              </span>
              <ThemeToggle />
            </div>
            <SignOutButton redirectUrl="/">
              <Button
                variant="ghost"
                className="h-10 w-full justify-start px-2 group-data-[collapsible=icon]:justify-center"
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Sign out
                </span>
              </Button>
            </SignOutButton>
          </SidebarFooter>
        </Sidebar>
        <main className="bg-grid bg-background md:ring-border min-w-0 flex-1 overflow-auto md:rounded-lg md:ring-1">
          <div className="bg-background/95 sticky top-0 z-20 flex h-14 items-center border-b px-4 md:hidden">
            <SidebarTrigger />
            <span className="ml-3 font-semibold">Simple POS</span>
          </div>
          <div className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
