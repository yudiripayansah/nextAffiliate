"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function parseTags(text) {
  return text
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function ProductTagsField({ values, onChange }) {
  const [text, setText] = useState(values.tags.join(", "));

  function handleChange(event) {
    setText(event.target.value);
    onChange("tags", parseTags(event.target.value));
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
      <Input id="tags" value={text} onChange={handleChange} />
    </div>
  );
}
