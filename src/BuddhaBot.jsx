import { useState } from "react";

const toneInstructions = {
  mirror: `Reflect the behavior back using Buddhist philosophical concepts. Name the relevant klesha or hindrance (e.g. mana, lobha, moha, asmimana). Do not moralize. Use the person's own framework to illuminate what is happening. Be precise and compassionate. 2-3 paragraphs.`,
  gentle: `Compose a gentle, curious inquiry the user could offer this person. Root it in Buddhist concepts. Ask questions that invite self-reflection without accusation. Draw on concepts like anatta, metta, or the Bodhisattva ideal if relevant. 2-3 short paragraphs or a series of questions.`,
  direct: `Provide a direct but philosophically grounded critique. Name the behavior clearly using Buddhist ethics (sila), the five precepts, or the concept of "spiritual bypassing." Be frank but not unkind. Cite a teaching, sutra, or koan if useful. 2-3 paragraphs.`,
  script: `Write an actual short conversation script the user could use. Root every response in Buddhist language and concepts so the critique lands within that framework. Keep it natural, not lecture-y. Include 3-5 exchanges.`
};

const tones = [
  { key: "mirror", label: "Mirror back" },
  { key: "gentle", label: "Gentle inquiry" },
  { key: "direct", label: "Direct challenge" },
  { key: "script", label: "Conversation script" },
];

const styles = {
  root: {
    minHeight: "100vh",
    background: "#f5efe3",
    backgroundImage:
      "radial-gradient(ellipse at 20% 10%, rgba(200,120,42,0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, rgba(200,120,42,0.05) 0%, transparent 50%)",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 24px 80px",
  },
};

export default function BuddhaBot() {
  const [situation, setSituation] = useState("");
  const [tone, setTone] = useState("mirror");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!situation.trim() || loading) return;
    setLoading(true);
    setResponse("");
    setError("");

    const systemPrompt = `You are a scholar and practitioner deeply versed in Buddhist philosophy across traditions: Theravada (Pali Canon), Mahayana, Vajrayana, and Zen. You help people articulate critique, concern, or challenge to someone who identifies as Buddhist, using language and concepts from within that tradition. You never mock or dismiss Buddhism. You ground every critique in authentic dharma teachings, naming specific concepts, kleshas, hindrances, or sutras where relevant. You write with clarity, warmth, and precision. You do not use bullet points. You write in flowing prose or natural dialogue depending on the framing requested.`;

    const userPrompt = `Situation: ${situation}\n\nFraming requested: ${tone}\nInstructions: ${toneInstructions[tone]}`;

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text =
        data.content?.map((b) => b.text || "").join("") ||
        "No response received.";
      setResponse(text);
    } catch (err) {
      setError(`Something went wrong: ${err.message}`);
    }

    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            fontSize: "2.2rem",
            marginBottom: 12,
            opacity: 0.7,
            display: "inline-block",
            animation: "spin 30s linear infinite",
          }}
        >
          ☸
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: "#c8782a",
            margin: 0,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
          }}
        >
          BUDDHA BOT
        </h1>
        <p
          style={{
            fontStyle: "italic",
            fontSize: "0.95rem",
            color: "#8a8070",
            marginTop: 6,
            letterSpacing: "0.04em",
          }}
        >
          critique through the dharma, not against it
        </p>
        <div
          style={{
            width: 60,
            height: 1,
            background: "#d4b896",
            margin: "20px auto 0",
          }}
        />
      </div>

      {/* Main */}
      <div style={{ width: "100%", maxWidth: 660 }}>
        <label
          style={{
            display: "block",
            fontSize: "0.75rem",
            fontFamily: "Inconsolata, monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#8a8070",
            marginBottom: 10,
          }}
        >
          Describe the behavior or situation
        </label>
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) generate();
          }}
          placeholder="e.g. A dharma teacher is gatekeeping access to teachings, framing it as protecting the sangha…"
          style={{
            width: "100%",
            background: "white",
            border: "1px solid #d4b896",
            borderRadius: 2,
            padding: "18px 20px",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.05rem",
            color: "#1a1208",
            resize: "vertical",
            minHeight: 120,
            lineHeight: 1.6,
            outline: "none",
          }}
        />

        {/* Tone buttons */}
        <div
          style={{
            display: "flex",
            gap: 8,
            margin: "18px 0 26px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Inconsolata, monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#8a8070",
            }}
          >
            Framing:
          </span>
          {tones.map((t) => (
            <button
              key={t.key}
              onClick={() => setTone(t.key)}
              style={{
                fontFamily: "Inconsolata, monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "6px 13px",
                border: `1px solid ${tone === t.key ? "#c8782a" : "#d4b896"}`,
                background: tone === t.key ? "#c8782a" : "transparent",
                color: tone === t.key ? "white" : "#8a8070",
                cursor: "pointer",
                borderRadius: 2,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={loading || !situation.trim()}
          style={{
            width: "100%",
            padding: 16,
            background: loading || !situation.trim() ? "#8a8070" : "#1a1208",
            color: "#f5efe3",
            border: "none",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1rem",
            fontWeight: 300,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: loading || !situation.trim() ? "not-allowed" : "pointer",
            borderRadius: 2,
            transition: "background 0.2s",
          }}
        >
          {loading ? "Contemplating…" : "Consult the Dharma"}
        </button>

        {/* Loading indicator */}
        {loading && (
          <div
            style={{
              display: "flex",
              gap: 6,
              justifyContent: "center",
              padding: "28px 0 0",
              color: "#8a8070",
              fontStyle: "italic",
              fontSize: "1rem",
            }}
          >
            <style>{`
              @keyframes pulse {
                0%, 100% { opacity: 0.2; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1); }
              }
              .dot { width: 6px; height: 6px; border-radius: 50%; background: #c8782a; animation: pulse 1.2s ease-in-out infinite; }
              .dot:nth-child(2) { animation-delay: 0.2s; }
              .dot:nth-child(3) { animation-delay: 0.4s; }
            `}</style>
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              marginTop: 20,
              padding: "14px 18px",
              background: "#fff8f5",
              border: "1px solid #e8c4a0",
              borderLeft: "3px solid #c8782a",
              color: "#8a4a1a",
              fontSize: "0.9rem",
              fontStyle: "italic",
            }}
          >
            {error}
          </div>
        )}

        {/* Response */}
        {response && !loading && (
          <div style={{ marginTop: 36 }}>
            <div
              style={{
                fontFamily: "Inconsolata, monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8a8070",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              Response{" "}
              <div style={{ flex: 1, height: 1, background: "#e8e0d0" }} />
            </div>
            <div
              style={{
                background: "white",
                border: "1px solid #e8e0d0",
                borderLeft: "3px solid #c8782a",
                padding: "28px 28px 24px",
                borderRadius: "0 2px 2px 0",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "#1a1208",
                whiteSpace: "pre-wrap",
              }}
            >
              {response}
            </div>
            <div style={{ textAlign: "right", marginTop: 10 }}>
              <button
                onClick={copy}
                style={{
                  fontFamily: "Inconsolata, monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "1px solid #e8e0d0",
                  color: "#8a8070",
                  padding: "5px 12px",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>

      <p
        style={{
          marginTop: 60,
          fontStyle: "italic",
          fontSize: "0.85rem",
          color: "#8a8070",
          opacity: 0.6,
        }}
      >
        Grounded in Pali Canon, Mahayana, and Zen sources.
      </p>
    </div>
  );
}
