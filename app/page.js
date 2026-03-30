"use client";
import { useState } from "react";
import ResultCard from "../components/ResultCard";

const EXAMPLES = [
  {
    customerMessage: "Hi! I placed an order 8 days ago and it still hasn't arrived. The tracking page hasn't updated in 5 days. Order #ORD-8821. What is going on??",
    orderNumber: "ORD-8821",
    orderDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    currentStatus: "Shipped",
  },
  {
    customerMessage: "Hey, just wondering when my order will ship? I ordered yesterday and haven't gotten a tracking number yet.",
    orderNumber: "ORD-3345",
    orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    currentStatus: "Processing",
  },
];

export default function Home() {
  const [form, setForm] = useState({
    customerMessage: "",
    orderNumber: "",
    orderDate: "",
    currentStatus: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadExample = (ex) => {
    setForm(ex);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!form.customerMessage.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ customerMessage: "", orderNumber: "", orderDate: "", currentStatus: "" });
    setResult(null);
    setError(null);
  };

  return (
    <main className="main-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-block">
          <div className="logo-icon">W</div>
          <div>
            <div className="logo-title">WISMO</div>
            <div className="logo-sub">Support AI</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Quick Examples</div>
          {EXAMPLES.map((ex, i) => (
            <button key={i} className="example-btn" onClick={() => loadExample(ex)}>
              <span className="example-icon">{i === 0 ? "⚑" : "◎"}</span>
              <span className="example-text">
                {i === 0 ? "Delayed order (8d)" : "New order inquiry"}
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-text">
            Paste any customer message to instantly generate support replies, internal notes, and escalation flags.
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="content-area">
        <header className="content-header">
          <div>
            <h1 className="page-title">Order Inquiry Analyzer</h1>
            <p className="page-sub">AI-powered WISMO detection & reply generation</p>
          </div>
          {result && (
            <button className="reset-btn" onClick={handleReset}>
              ↺ New Analysis
            </button>
          )}
        </header>

        {!result ? (
          <div className="form-card">
            {/* Customer message */}
            <div className="field-group full-width">
              <label className="field-label">Customer Message <span className="required">*</span></label>
              <textarea
                name="customerMessage"
                className="field-textarea"
                placeholder="Paste the customer's message here..."
                value={form.customerMessage}
                onChange={handleChange}
                rows={5}
              />
            </div>

            {/* Order details row */}
            <div className="fields-row">
              <div className="field-group">
                <label className="field-label">Order Number</label>
                <input
                  name="orderNumber"
                  className="field-input"
                  placeholder="ORD-1234"
                  value={form.orderNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group">
                <label className="field-label">Order Date</label>
                <input
                  name="orderDate"
                  type="date"
                  className="field-input"
                  value={form.orderDate}
                  onChange={handleChange}
                />
              </div>
              <div className="field-group">
                <label className="field-label">Current Status</label>
                <select
                  name="currentStatus"
                  className="field-input field-select"
                  value={form.currentStatus}
                  onChange={handleChange}
                >
                  <option value="">Select status</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                  <option>Returned</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button
              className={`submit-btn ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading || !form.customerMessage.trim()}
            >
              {loading ? (
                <span className="loading-inner">
                  <span className="spinner"></span> Analyzing...
                </span>
              ) : (
                "Analyze Message →"
              )}
            </button>
          </div>
        ) : (
          <ResultCard result={result} />
        )}
      </div>
    </main>
  );
}
