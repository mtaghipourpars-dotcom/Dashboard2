const STEPS = [
  { id: "sap", label: "SAP / حقیقت" },
  { id: "graph", label: "گراف" },
  { id: "sim", label: "شبیه‌سازی" },
  { id: "opt", label: "امتیاز" },
  { id: "council", label: "شورا" },
  { id: "human", label: "انسان" },
];

export function ArchitectureFlow() {
  return (
    <ol className="flex flex-wrap gap-2">
      {STEPS.map((s, i) => (
        <li key={s.id} className="flex items-center gap-2">
          <span className="border border-border bg-bg-subtle rounded-[12px] px-3 py-2 text-[12px]">
            {s.label}
          </span>
          {i < STEPS.length - 1 && <span className="text-fg-subtle text-xs">→</span>}
        </li>
      ))}
    </ol>
  );
}
