"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => resolvedTheme && setTheme(isDark ? "light" : "dark")}
      disabled={!resolvedTheme}
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
    >
      <SunIcon className="hidden size-[1.1rem] dark:block" />
      <MoonIcon className="size-[1.1rem] dark:hidden" />
    </Button>
  );
}
