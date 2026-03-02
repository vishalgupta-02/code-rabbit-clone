"use client";

import React from "react";
import { Github, BookOpen, Settings, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Logout from "@/module/auth/components/logout";

export const AppSidebar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BookOpen,
    },
    {
      title: "Repository",
      url: "/dashboard/repository",
      icon: Github,
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: BookOpen,
    },
    {
      title: "Subscription",
      url: "/dashboard/subscription",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/dashboard");
  };

  if (!mounted || !session) return null;

  const user = session.user;
  const userName = user.name || "Guest";
  const userEmail = user.email || "";
  const userAvatar = user.image || "";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex flex-col gap-4 px-2 py-6">
          <div className="bg-sidebar-accent/50 hover:bg-sidebar-accent/70 flex items-center gap-4 rounded-lg px-3 py-4 transition-colors">
            <div className="bg-primary text-primary-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <Github className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground text-xs font-semibold tracking-wide">
                Connected Acccount
              </p>
              <p className="text-sidebar-foreground/90 text-sm font-medium">
                @{userName}
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-col gap-1 px-3 py-6">
        <div className="mb-2">
          <p className="text-sidebar-foreground/60 mb-3 px-3 text-xs font-semibold tracking-widest uppercase">
            Menu
          </p>
        </div>

        <SidebarMenu className="gap-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`h-11 rounded-lg px-4 transition-all duration-200 ${isActive(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : "hover:bg-sidebar-accent/60 text-sidebar-foreground"}`}
              >
                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 h-12 rounded-lg px-4 transition-colors"
                >
                  <Avatar className="h-10 w-10 shrink-0 rounded-lg">
                    <AvatarImage
                      src={userAvatar || "/placeholder.svg"}
                      alt={userName}
                    />
                    <AvatarFallback className="rounded-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 text-left text-sm leading-relaxed">
                    <span className="truncate text-base font-semibold">
                      {userName}
                    </span>
                    <span className="text-sidebar-foreground/70 truncate text-xs">
                      {userEmail}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-80 rounded-lg"
                align="end"
                side="right"
                sideOffset={8}
              >
                <div className="border-t border-b px-2 py-3">
                  <DropdownMenuItem>
                    <Avatar className="h-10 w-10 shrink-0 rounded-lg">
                      <AvatarImage
                        src={userAvatar || "/placeholder.svg"}
                        alt={userName}
                      />
                      <AvatarFallback className="rounded-lg">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid min-w-0 flex-1 text-left text-sm leading-relaxed">
                      <span className="truncate text-base font-semibold">
                        {userName}
                      </span>
                      <span className="text-sidebar-foreground/70 truncate text-xs">
                        {userEmail}
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="hover:bg-sidebar-accent/50 flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors"
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className="h-5 w-5 shrink-0" />
                          <span>Light mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-5 w-5 shrink-0" />
                          <span>Dark mode</span>
                        </>
                      )}
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="my-1 cursor-pointer rounded-md px-3 py-3 font-medium transition-colors hover:bg-red-500/10 hover:text-red-600">
                    <LogOut className="mr-3 h-5 w-5 shrink-0" />
                    <Logout>Sign out</Logout>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
