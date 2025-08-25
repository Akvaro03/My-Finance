"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header(
  {
    showBorder = true,
    user,
  }: {
    showBorder?: boolean;
    user?: { id: number; email?: string; name?: string };
  } = {
    showBorder: true,
  }
) {
  const [open, setOpen] = React.useState(false);
  const handleLogout = async () => {
    await fetch("/api/users/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-black/30 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20",
        showBorder && "border-b border-white/10"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Título */}
        <Link
          href="/"
          className="flex items-center gap-1 font-bold tracking-wide text-2xl transition-all hover:brightness-110"
        >
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
            My
          </span>
          <span className="text-zinc-100">Finance</span>
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/transactions"
            className="text-zinc-200 hover:text-white transition-colors text-sm font-medium"
          >
            History
          </Link>
          <Link
            href="/transactions/new"
            className="text-zinc-200 hover:text-white transition-colors text-sm font-medium"
          >
            Add Expense
          </Link>
          <Link
            href="/budgets"
            className="text-zinc-200 hover:text-white transition-colors text-sm font-medium"
          >
            Add Goal
          </Link>
        </nav>

        {/* Usuario desktop */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
          {user?.name && (
            <Avatar className="w-10 h-10">
              <AvatarImage src={undefined} alt={user?.name} />
              <AvatarFallback className="bg-blue-600 text-white">
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}
          <Button
            variant="link"
            className="text-zinc-200"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-1">
          <Button
            variant="ghost"
            className="text-zinc-200"
            aria-label="Abrir navegación"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden border-t border-white/10 bg-neutral-950/80 backdrop-blur px-4 py-3 space-y-3"
          onClick={() => setOpen(false)}
        >
          {/* Usuario en mobile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              {user?.name && (
                <p className="text-white font-medium">{user.name}</p>
              )}
              <p className="text-slate-400 text-sm">{user?.email}</p>
            </div>
            {user?.name && (
              <Avatar className="w-10 h-10">
                <AvatarImage src={undefined} alt={user?.name} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Navegación en mobile */}
          <nav className="flex flex-col space-y-2 pt-2">
            <Link
              href="/history"
              className="text-zinc-200 hover:text-white transition-colors text-sm font-medium"
            >
              History
            </Link>
            <Link
              href="/expenses/add"
              className="text-zinc-200 hover:text-white transition-colors text-sm font-medium"
            >
              Add Expense
            </Link>
            <Link
              href="/goals/add"
              className="text-zinc-200 hover:text-white transition-colors text-sm font-medium"
            >
              Add Goal
            </Link>
            <Button
              variant="link"
              className="text-zinc-200 justify-start p-0"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
