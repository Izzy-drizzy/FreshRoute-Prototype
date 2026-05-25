// Root App — hub screen + Flow 0 and Flow 1 as independent paths.
//
// Routes (hash-based, works on any static host):
//   #/         → Hub
//   #/flow0    → Onboarding (splash → welcome → days → times → rank → complete)
//   #/flow1    → Slot booking (landing → grid → confirm → autolearn / error)

const SCREENS = [
  // Hub
  "hub",
  // Flow 0
  "f0-splash", "f0-welcome", "f0-days", "f0-times", "f0-rank", "f0-complete",
  // Flow 1
  "f1-landing", "f1-grid", "f1-confirm", "f1-success", "f1-error", "f1-autolearn",
];
const SCREEN_LABELS = {
  "hub":         "Hub",
  "f0-splash":   "0.1 Splash",
  "f0-welcome":  "0.2 Welcome",
  "f0-days":     "0.3 Days · Step 1",
  "f0-times":    "0.4 Times · Step 2",
  "f0-rank":     "0.5 Rank · Step 3",
  "f0-complete": "0.6 You're All Set",
  "f1-landing":  "1.1 Your Preferred Slot",
  "f1-grid":     "1.2 Slot Grid",
  "f1-confirm":  "1.3 Confirm",
  "f1-success":  "1.4 Slot Booked",
  "f1-error":    "1.5 Slot Taken",
  "f1-autolearn":"1.6 Auto-Learn",
};

// Resolve current hash → { mode, screen }.
// mode tells flow components how to behave at exit points.
function routeFromHash() {
  const h = (window.location.hash || "").replace(/^#\/?/, "").toLowerCase();
  if (h === "flow0") return { mode: "flow0", screen: "f0-splash" };
  if (h === "flow1") return { mode: "flow1", screen: "f1-landing" };
  return { mode: "hub", screen: "hub" };
}

function goToHub() { window.location.hash = "#/"; }
function goToFlow0() { window.location.hash = "#/flow0"; }
function goToFlow1() { window.location.hash = "#/flow1"; }

function App() {
  const initial = useMemo(() => routeFromHash(), []);
  const [mode, setMode] = useState(initial.mode);
  const [screen, setScreen] = useState(initial.screen);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pickedSlot, setPickedSlot] = useState(null);
  const [history, setHistory] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0); // days from "today"
  const [autoLearnOpen, setAutoLearnOpen] = useState(false);

  // Keep React state in sync with the URL hash (forward/back, manual edits, Hub pill).
  useEffect(() => {
    const onHash = () => {
      const next = routeFromHash();
      setMode(next.mode);
      setScreen(next.screen);
      setHistory([]);
      setFiltersOpen(false);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // collected preferences across flow 0
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [topPicks, setTopPicks] = useState([]);

  const go = useCallback((next) => {
    setHistory(h => [...h, screen]);
    setScreen(next);
  }, [screen]);
  const goBack = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setScreen(prev);
      return h.slice(0, -1);
    });
  }, []);
  const jump = useCallback((s) => {
    setHistory(h => [...h, screen]);
    setScreen(s);
  }, [screen]);

  // Default top picks for the complete screen
  useEffect(() => {
    if (screen === "f0-complete") {
      if (ranking.length >= 1) {
        // resolve labels from ranking ids "<day>-<timeId>" — use however many
        // the user actually picked (1, 2, or 3)
        const labels = ranking.map(id => {
          const [d, t] = id.split("-");
          const tinfo = F0_TIMES.find(x => x.id === t);
          return `${d} ${tinfo?.label ?? ""} (${tinfo?.sub ?? ""})`;
        });
        setTopPicks(labels);
      } else {
        setTopPicks([
          "Thursday Evening (6-9pm)",
          "Wednesday Evening (6-9pm)",
          "Saturday Afternoon (12-3pm)",
        ]);
      }
    }
  }, [screen, ranking]);

  // In single-flow modes the "exit" actions return to the hub instead of
  // cascading into the other flow.
  const exitToFlow1 = mode === "flow0" ? goToHub : () => go("f1-landing");

  // Render current screen
  const node = useMemo(() => {
    switch (screen) {
      case "hub":
        return <Hub onFlow0={goToFlow0} onFlow1={goToFlow1}/>;
      case "f0-splash":
        return <F0Splash onDone={() => setScreen("f0-welcome")}/>;
      case "f0-welcome":
        return <F0Welcome onStart={() => go("f0-days")} onSkip={exitToFlow1}/>;
      case "f0-days":
        return <F0Days value={days} onChange={setDays}
                       onBack={goBack}
                       onNext={() => go("f0-times")}/>;
      case "f0-times":
        return <F0Times value={times} onChange={setTimes}
                        onBack={goBack}
                        onNext={() => go("f0-rank")}/>;
      case "f0-rank":
        return <F0Rank days={days} times={times} value={ranking} onChange={setRanking}
                       onBack={goBack}
                       onNext={() => go("f0-complete")}/>;
      case "f0-complete":
        return <F0Complete topPicks={topPicks} onContinue={exitToFlow1}/>;
      case "f1-landing":
        return <F1Landing onBack={goBack}
                          onBook={() => {
                            setPickedSlot({ dateLabel: "Thursday, May 22", time: "7:00pm - 9:00pm", price: "£3.00" });
                            go("f1-confirm");
                          }}
                          onBrowse={() => go("f1-grid")}/>;
      case "f1-grid":
        return <F1Grid onBack={goBack}
                       onOpenFilters={() => setFiltersOpen(true)}
                       weekOffset={weekOffset}
                       onContinue={(slot) => {
                         setPickedSlot({ dateLabel: "Thursday, May 22", time: slot?.time ?? "7:00pm - 9:00pm", price: slot?.price ?? "£3.00" });
                         go("f1-confirm");
                       }}
                       onSlotConflict={() => go("f1-error")}/>;
      case "f1-confirm":
        return <F1Confirm slot={pickedSlot}
                          onBack={goBack}
                          onChange={() => go("f1-grid")}
                          onCheckout={() => go("f1-success")}
                          onTimeout={() => go("f1-error")}/>;
      case "f1-success":
        return <F1Success slot={pickedSlot}
                          onContinue={() => {
                            goToHub();
                            // Let the hub fade in first, then surface the prompt.
                            setTimeout(() => setAutoLearnOpen(true), 240);
                          }}/>;
      case "f1-error":
        return <F1Error onBack={goBack}
                        onTryAgain={() => go("f1-grid")}
                        onBrowse={() => go("f1-grid")}
                        onPick={(a) => {
                          setPickedSlot({ dateLabel: a.day, time: a.time, price: a.price });
                          go("f1-confirm");
                        }}/>;
      case "f1-autolearn":
        return <F1AutoLearn onBack={goBack}
                            onAccept={() => go("f1-grid")}
                            onDecline={() => go("f1-grid")}/>;
      default:
        return null;
    }
  }, [screen, mode, days, times, ranking, topPicks, pickedSlot, go, goBack, exitToFlow1]);

  return (
    <div className="stage">
      <div className="phone">
        <div className="phone-notch"/>
        <div className="phone-screen" data-screen-label={SCREEN_LABELS[screen] || screen}>
          {/* ScreenSwitch wraps the current screen with a fade transition */}
          <FadeSwap k={screen}>{node}</FadeSwap>

          {/* Filters bottom sheet floats over the grid */}
          <F1FiltersSheet open={filtersOpen}
                          onClose={() => setFiltersOpen(false)}
                          onApply={() => setFiltersOpen(false)}
                          weekOffset={weekOffset}
                          setWeekOffset={setWeekOffset}/>

          {/* Auto-learn prompt — floats over whatever screen is current.
              Opens when the user clicks "Continue Shopping" on F1Success. */}
          <F1AutoLearnPrompt open={autoLearnOpen}
                             onAccept={() => setAutoLearnOpen(false)}
                             onDecline={() => setAutoLearnOpen(false)}/>

          {/* "Back to Hub" pill — only inside a flow, never on the hub itself. */}
          {screen !== "hub" && (
            <a href="#/" className="hub-pill" aria-label="Back to hub">← Hub</a>
          )}
        </div>
      </div>

      <TweaksHostProto current={screen} jump={jump} reset={goToHub}/>
    </div>
  );
}

/* ------------ Hub: pick a flow to launch ------------------------------ */
function Hub({ onFlow0, onFlow1 }) {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: "30px 20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 48, color: "var(--green-deep)", margin: 0, letterSpacing: "-0.04em", lineHeight: 1 }}>FreshRoute</h1>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 16, color: "var(--text-mid)" }}>Pick a flow to launch.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button type="button" className="hub-card" onClick={onFlow0}>
            <span className="hub-card-label">Flow 0</span>
            <span className="hub-card-title">Onboarding</span>
            <span className="hub-card-sub">Set delivery preferences across six screens.</span>
          </button>
          <button type="button" className="hub-card" onClick={onFlow1}>
            <span className="hub-card-label">Flow 1</span>
            <span className="hub-card-title">Slot Booking</span>
            <span className="hub-card-sub">Pick a delivery slot from the weekly grid.</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------ Fade swap (mounts children fresh on key change) */
function FadeSwap({ k, children }) {
  return (
    <div key={k} className="screen-fade"
         style={{ position: "absolute", inset: 0 }}>
      {children}
    </div>
  );
}

/* ------------ Tweaks panel: jump screen, reset */
function TweaksHostProto({ current, jump, reset }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Jump to Screen">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
          {SCREENS.map(s => (
            <button key={s} onClick={() => jump(s)}
                    style={{
                      padding: "7px 8px",
                      borderRadius: 6,
                      background: current === s ? "rgb(28,92,66)" : "rgba(0,0,0,0.04)",
                      color: current === s ? "rgb(220,255,101)" : "rgba(41,38,27,0.85)",
                      border: "0.5px solid " + (current === s ? "rgb(28,92,66)" : "rgba(0,0,0,0.08)"),
                      fontFamily: "ui-sans-serif, system-ui",
                      fontWeight: current === s ? 600 : 500,
                      fontSize: 10.5,
                      cursor: "pointer",
                      textAlign: "left",
                      lineHeight: 1.2,
                    }}>
              {SCREEN_LABELS[s]}
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection label="Prototype">
        <TweakButton label="Back to hub" onClick={reset}/>
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
