"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Laptop, Moon, Sun, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo + Name */}
        <motion.div
          className="flex items-center gap-2 font-bold text-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Database className="h-6 w-6 text-primary" />
          <span className="text-primary">codeDB</span>
        </motion.div>

        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme("light")}
              className={`${
                theme === "light" ? "bg-muted" : ""
              } transition-colors`}
            >
              <Sun className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme("dark")}
              className={`${
                theme === "dark" ? "bg-muted" : ""
              } transition-colors`}
            >
              <Moon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme("system")}
              className={`${
                theme === "system" ? "bg-muted" : ""
              } transition-colors`}
            >
              <Laptop className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
