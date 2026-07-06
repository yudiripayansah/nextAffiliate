import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductFaq({ faq }) {
  if (!faq?.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">FAQ</h2>
      <Accordion type="single" collapsible>
        {faq.map((item, index) => (
          <AccordionItem key={item.question} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
