// src/components/ServerWakeUp.jsx
import React, { useState, useEffect, useRef } from "react";

/**
 * ServerWakeUp — NON-BLOCKING banner
 * -----------------------------------
 * Shows a slim, animated banner at the top of the page while the
 * Render free-tier backends are cold-starting.  The app always
 * renders underneath — nothing is ever blocked or hidden.
 *
 * The banner auto-dismisses once any backend responds, or after
 * a maximum timeout (90 s).
 */

const PING_URLS = [
  import.meta.env.VITE_AUTH_BASE_URL,
  import.meta.env.VITE_MUSIC_BASE_URL,
].filter(Boolean);

const SHOULD_PING = PING_URLS.length > 0;
const MAX_WAIT = 90; // seconds

export default function ServerWakeUp({ children }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [dots, setDots] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  const timerRef = useRef(null);

  // Animate dots
  useEffect(() => {
    if (!visible || dismissed) return;
    const id = setInterval(() => {
      setDots((p) => (p.length >= 3 ? "" : p + "."));
    }, 500);
    return () => clearInterval(id);
  }, [visible, dismissed]);

  // Elapsed counter
  useEffect(() => {
    if (!visible || dismissed) return;
    timerRef.current = setInterval(() => {
      const s = Math.floor((Date.now() - startRef.current) / 1000);
      setElapsed(s);
      if (s >= MAX_WAIT) dismiss();
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [visible, dismissed]);

  const dismiss = () => {
    setDismissed(true);
    clearInterval(timerRef.current);
  };

  // Ping backends
  useEffect(() => {
    if (!SHOULD_PING) return;

    let cancelled = false;

    const ping = async () => {
      // Show banner only if server takes more than 3s
      const showTimeout = setTimeout(() => {
        if (!cancelled) setVisible(true);
      }, 3000);

      try {
        await Promise.all(
          PING_URLS.map((url) =>
            fetch(url, { mode: "cors", credentials: "include" })
              .then(() => "ok")
              .catch(() => "ok") // CORS error / network error still means server IS awake
          )
        );
      } catch {
        // ignore
      }

      clearTimeout(showTimeout);
      if (!cancelled) dismiss();
    };

    ping();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {/* Banner — only shows if server is slow (>3s) */}
      {visible && !dismissed && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "linear-gradient(135deg, rgba(46,224,122,0.12), rgba(75,111,245,0.12))",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            animation: "slideDown 0.4s ease-out",
          }}
        >
          {/* Spinner */}
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.1)",
              borderTopColor: "#2EE07A",
              animation: "wakeUpSpin 0.8s linear infinite",
              flexShrink: 0,
            }}
          />

          {/* Message */}
          <span
            style={{
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 500,
            }}
          >
            Server is waking up{dots}
            <span style={{ color: "rgba(255,255,255,0.35)", marginLeft: 6, fontSize: "0.75rem" }}>
              Free tier servers may take 30–60s to start
            </span>
          </span>

          {/* Timer */}
          {elapsed > 0 && (
            <span
              style={{
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.25)",
                fontWeight: 600,
                fontFamily: "monospace",
                flexShrink: 0,
              }}
            >
              {elapsed}s
            </span>
          )}

          {/* Close button */}
          <button
            onClick={dismiss}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
              fontSize: "1.1rem",
              padding: "0 4px",
              marginLeft: 4,
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>

          <style>{`
            @keyframes wakeUpSpin {
              to { transform: rotate(360deg); }
            }
            @keyframes slideDown {
              from { transform: translateY(-100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* App always renders — never blocked */}
      {children}
    </>
  );
}
