function OptionGrid({ items, value, onSelect }) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value)}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
            value === item.value
              ? "border-red-600 bg-red-50"
              : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/40"
          }`}>
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
              value === item.value
                ? "border-red-600 bg-red-600"
                : "border-slate-300"
            }`}
          />
          <span className="text-sm text-slate-900">{item.label}</span>
          {item.badge && (
            <span className="ml-auto rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] text-red-700">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default OptionGrid;
