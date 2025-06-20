import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const categories = [
  "Language & Literature",
  "Science & Mathematics",
  "Programming & Technology",
  "Art & Creativity",
  "Business & Career Development",
  "Exercises",
  "Life Skills",
];

export function CategorySelect({ value, onValueChange, disabled }: CategorySelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Category</Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id="category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}