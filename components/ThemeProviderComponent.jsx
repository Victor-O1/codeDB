"use client";

import { ThemeProvider } from "next-themes";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ThemeProviderComponent = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Skeleton placeholder for header + content
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-32 rounded-lg" /> {/* Logo / Title */}
          <div className="flex gap-3">
            <Skeleton className="h-8 w-20 rounded-lg" /> {/* Button */}
            <Skeleton className="h-8 w-8 rounded-full" /> {/* Theme toggle */}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

export default ThemeProviderComponent;
