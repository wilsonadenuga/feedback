"use client";

import {
  IconCheck,
  IconDeviceDesktop,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { useTheme } from "next-themes";

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@feedback/ui/components/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Theme</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => setTheme("light")}>
        <IconSun className="size-4" />
        Light
        {theme === "light" && <IconCheck className="ml-auto size-4" />}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        <IconMoon className="size-4" />
        Dark
        {theme === "dark" && <IconCheck className="ml-auto size-4" />}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        <IconDeviceDesktop className="size-4" />
        System
        {theme === "system" && <IconCheck className="ml-auto size-4" />}
      </DropdownMenuItem>
    </>
  );
}
