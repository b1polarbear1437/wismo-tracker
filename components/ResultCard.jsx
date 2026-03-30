"use client";

export default function ResultCard({ result }) {
  if (!result) return null;

  const sentimentColors = {
    frustrated: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-400" },
    urgent: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400" },
    neutral: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-400" },
  };
  const sentiment = sentimentColors[result.sentiment] || sentimentColors.neutral;

  return (
    <div className="result-container">
      {/* Header row */}
      <div className="result-header">
        <div className="wismo-badge">
          {result.isWismo ? (
            <span className="badge badge-wismo">✦ WISMO Detected</span>
          ) : (
            <span className="badge badge-other">◈ Other Inquiry</span>
          )}
          <span className={`badge sentiment-badge ${sentiment.bg} ${sentiment.border} ${sentiment.text}`}>
            <span className={`dot ${sentiment.dot}`}></span>
            {result.sentiment?.charAt(0).toUpperCase() + result.sentiment?.slice(1)}
          </span>
        </div>

        {result.escalate && (
          <div className="escalation-alert">
            <span className="escalation-icon">⚑</span>
            <span className="escalation-text">Escalation Required</span>
          </div>
        )}
      </div>

      {/* Issue Summary */}
      <div className="result-section summary-section">
        <div className="section-label">Issue Summary</div>
        <p className="summary-text">{result.issueSummary}</p>
      </div>

      {/* Two column: Customer Reply + Internal Note */}
      <div className="result-grid">
        <div className="result-section reply-section">
          <div className="section-label">
            <span className="label-icon">✉</span> Customer Reply
          </div>
          <p className="reply-text">{result.customerReply}</p>
          <button
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(result.customerReply)}
          >
            Copy Reply
          </button>
        </div>

        <div className="result-section note-section">
          <div className="section-label">
            <span className="label-icon">🗒</span> Internal Note
          </div>
          <p className="note-text">{result.internalNote}</p>
          <button
            className="copy-btn copy-btn-muted"
            onClick={() => navigator.clipboard.writeText(result.internalNote)}
          >
            Copy Note
          </button>
        </div>
      </div>

      {/* Escalation reason */}
      {result.escalate && result.escalationReason && (
        <div className="escalation-reason">
          <span className="escalation-reason-label">⚑ Escalation Reason:</span>
          <span className="escalation-reason-text">{result.escalationReason}</span>
        </div>
      )}
    </div>
  );
}
