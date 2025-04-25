"use client"

import { FormEvent } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { BacklogItem } from "@/lib/types";

interface BacklogListProps {
  items: BacklogItem[];
  isLoading: boolean;
  selectedItem: BacklogItem | null;
  searchQuery: string;
  onSearch: (e: FormEvent) => Promise<void>;
  onSearchChange: (value: string) => void;
  onItemClick: (item: BacklogItem) => void;
}

export function BacklogList({
  items,
  isLoading,
  selectedItem,
  searchQuery,
  onSearch,
  onSearchChange,
  onItemClick,
}: BacklogListProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Backlog Items</h2>
        <form onSubmit={onSearch} className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter issue number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </form>
      </div>
      <ScrollArea className="h-[600px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground">
              {isLoading ? "Loading backlog items..." : "Connect your Jira account to view backlog items"}
            </p>
          ) : (
            items.map((item) => (
              <Card 
                key={item.id} 
                className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
                  selectedItem?.id === item.id ? 'bg-accent' : ''
                }`}
                onClick={() => onItemClick(item)}
              >
                <h3 className="font-medium">{item.key}</h3>
                <p className="text-sm text-muted-foreground">{item.fields.summary}</p>
                <div className="mt-2">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {item.fields.status.name}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}