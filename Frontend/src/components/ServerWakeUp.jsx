// src/components/ServerWakeUp.jsx
import React, { useState, useEffect, useRef } from "react";

/**
 * ServerWakeUp
 * -----------
 * On Render's free tier the backend sleeps after inactivity.
 * This component fires a lightweight ping on mount and shows a
 * beautiful fullscreen overlay until the server responds.
 *
 * Once the server is awake (or the request completes) the overlay
 * fades out and the children (the whole app) are revealed.
 */

const PING_URLS = [
  import.meta.env.VITE_AUTH_BASE_URL,
  import.meta.env.VITE_MUSIC_BASE_URL,
].filter(Boolean);

// If no backend URLs configured, skip entirely
const SHOULD_PING = PING_URLS.length > 0;

export default function ServerWakeUp({ children }) {
  const [serverReady, setServerReady] = useState(!SHOULD_PING);
  const [fadeOut, setFadeOut] = useState(false);
  const [dots, setDots] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const startTime = useRef(Date.now());

  // Animate the dots: . → .. → ... → .
  useEffect(() => {
    if (serverReady) return;
    const id = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(id);
  }, [serverReady]);

  // Elapsed second counter
  useEffect(() => {
    if (serverReady) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [serverReady]);

  // Ping the backends
  useEffect(() => {
    if (!SHOULD_PING) return;

    let cancelled = false;

    const ping = async () => {
      try {
        // Fire all pings in parallel – we only need ALL to respond
        await Promise.all(
          PING_URLS.map((url) =>
            fetch(url, { mode: "cors", credentials: "include" }).catch(() => {
              // Even a CORS error / 401 means the server IS awake
              return "awake";
            })
          )
        );
      } catch {
        // network-level failure, servers are still waking
      }
      if (!cancelled) {
        // Smooth exit: fade-out then unmount
        setFadeOut(true);
        setTimeout(() => setServerReady(true), 700);
      }
    };

    ping();

    return () => {
      cancelled = true;
    };
  }, []);

  // If no ping needed or server is ready, just render children
  if (serverReady) return <>{children}</>;

  // Show overlay while waiting
  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#020202",
          transition: "opacity 0.7s ease",
          opacity: fadeOut ? 0 : 1,
          pointerEvents: fadeOut ? "none" : "auto",
        }}
      >
        {/* Ambient glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "30%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(46,224,122,0.06)",
            filter: "blur(120px)",
            animation: "wakeUpPulse 3s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "25%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(75,111,245,0.06)",
            filter: "blur(120px)",
            animation: "wakeUpPulse 3s ease-in-out infinite 1.5s",
          }}
        />

        {/* Spinning ring */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.05)",
            borderTopColor: "#2EE07A",
            animation: "wakeUpSpin 1s linear infinite",
            marginBottom: 32,
          }}
        />

        {/* Brand */}
        <h1
          style={{
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            fontSize: "2rem",
            fontWeight: 900,
            background: "linear-gradient(135deg, #2EE07A, #4B6FF5, #9b59ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          AURA
        </h1>

        {/* Status text */}
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 500,
            marginBottom: 8,
            minWidth: 260,
            textAlign: "center",
          }}
        >
          Waking up the servers{dots}
        </p>

        {/* Sub-text explanation */}
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.25)",
            fontWeight: 400,
            maxWidth: 340,
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          Our servers spin down after inactivity to save resources.
          The first request may take <strong style={{ color: "rgba(255,255,255,0.4)" }}>30–60 seconds</strong> to respond.
        </p>

        {/* Elapsed timer */}
        {elapsed > 0 && (
          <div
            style={{
              fontFamily: "'Inter', monospace, sans-serif",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.15)",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {elapsed}s elapsed
          </div>
        )}

        {/* Inline keyframes */}
        <style>{`
          @keyframes wakeUpSpin {
            to { transform: rotate(360deg); }
          }
          @keyframes wakeUpPulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `}</style>
      </div>

      {/* Render children behind the overlay so they can start loading */}
      <div style={{ visibility: "hidden" }}>{children}</div>
    </>
  );
}
