import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RepeatableFieldList({ label, items, onChange, fields, emptyItem, addLabel }) {
  function updateItem(index, key, value) {
    const next = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item
    );
    onChange(next);
  }

  function removeItem(index) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  function addItem() {
    onChange([...items, { ...emptyItem }]);
  }

  return (
    <div className="flex flex-col gap-2 sm:col-span-2">
      <Label>{label}</Label>

      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          {fields.map(({ key, placeholder }) => (
            <Input
              key={key}
              value={item[key]}
              placeholder={placeholder}
              onChange={(event) => updateItem(index, key, event.target.value)}
            />
          ))}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Hapus"
            onClick={() => removeItem(index)}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-fit">
        <Plus className="size-4" /> {addLabel}
      </Button>
    </div>
  );
}
