function QuestionCard({
  stepIndex,
  title,
  subtitle,
  children,
  score,
  canContinue,
  onBack,
  onNext,
  nextLabel = "Continue",
  showBack = true,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-red-600">
        Step {stepIndex + 1}
      </p>
      <h2 className="mb-2 text-lg font-medium text-slate-900">{title}</h2>
      {subtitle && <p className="mb-5 text-sm text-slate-500">{subtitle}</p>}

      {children}

      <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-slate-600">Points so far</span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-medium text-red-600">{score}</span>
          <span className="text-sm text-slate-400">/ 1200</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        {showBack ? (
          <button
            onClick={onBack}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 disabled:opacity-40">
            Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-35">
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

export default QuestionCard;
