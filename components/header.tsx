"use client"

import { Clipboard } from "lucide-react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-2">
          <Clipboard className="h-6 w-6" />
          <span className="text-xl font-bold">Story Refinement Assistant</span>
        </div>
      </div>
    </header>
  );
}