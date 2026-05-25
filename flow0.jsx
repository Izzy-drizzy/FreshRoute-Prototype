// Flow 0 — Personalization onboarding
// 1) splash → 2) welcome → 3) days → 4) times → 5) rank → 6) complete

const F0_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const F0_TIMES = [
{ id: "early", label: "Early Morning", sub: "6am - 9am", icon: "assets/icon-early.svg" },
{ id: "morn", label: "Morning", sub: "9am - 12pm", icon: "assets/icon-morn.svg" },
{ id: "aft", label: "Afternoon", sub: "12pm - 3pm", icon: "assets/icon-aft.svg" },
{ id: "late", label: "Late Afternoon", sub: "3pm - 6pm", icon: "assets/icon-late.svg" },
{ id: "eve", label: "Evening", sub: "6pm - 9pm", icon: "assets/icon-eve.svg" },
{ id: "night", label: "Late Night", sub: "9pm - 12am", icon: "assets/icon-night.svg" }];


/* ---- Splash ------------------------------------------------------ */
function F0Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="screen">
      <StatusBar dark />
      <div className="splash">
        {/* floating orbs (Group3-style dots) */}
        <div className="splash-orb" style={{ width: 220, height: 220, left: -60, top: -40 }} />
        <div className="splash-orb" style={{ width: 180, height: 180, right: -50, top: 120, animationDelay: "1.2s" }} />
        <div className="splash-orb" style={{ width: 240, height: 240, left: 40, bottom: -80, animationDelay: "2.4s" }} />
        <div className="splash-orb" style={{ width: 140, height: 140, right: 30, bottom: 200, animationDelay: "0.6s" }} />

        <div style={{ textAlign: "center", animation: "popIn 700ms cubic-bezier(.2,1.4,.4,1) both" }}>
          <div className="splash-title">FreshRoute</div>
          <div className="splash-sub">Fresh food on your terms</div>
        </div>
        <div style={{ position: "absolute", bottom: 80 }}>
          <div className="spinner" />
        </div>
      </div>
      <style>{`@keyframes popIn { from { transform: scale(0.7); } to { transform: scale(1); } }`}</style>
    </div>);

}

/* ---- Welcome to Personalization --------------------------------- */
function F0Welcome({ onStart, onSkip }) {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: "0 0 24px" }}>
        <div style={{
          margin: "0 5px",
          height: 416,
          borderRadius: 20,
          border: "0.5px solid var(--border-sage)",
          backgroundImage: "linear-gradient(rgba(156,175,166,0.30), rgba(156,175,166,0.30)), url(assets/welcome.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />

        <div style={{ padding: "30px 20px 0", display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h1 className="h-hero" style={{ margin: 0, letterSpacing: "-2.4px", lineHeight: "0.85", fontSize: "49px" }}>Find delivery slots that work for you</h1>
            <p className="body-sm" style={{ margin: 0, color: "var(--text-dark)", fontSize: "16px" }}>
              Tell us when you prefer deliveries and we'll prioritize those times.
            </p>
            <span className="caption" style={{ color: "var(--text-soft)", fontWeight: "400" }}>Takes 2 minutes</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <BtnPrimary full onClick={onStart}>Get Started</BtnPrimary>
            <BtnTertiary full onClick={onSkip}>Skip for Now</BtnTertiary>
          </div>
        </div>
      </div>
    </div>);

}

/* ---- Step Layout (shared) --------------------------------------- */
function F0StepShell({ step, total, title, hint, children, onBack, onNext, nextLabel = "Next", canContinue }) {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: "30px 20px 24px", overflowY: "auto", gap: "0px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          <div className="steps">
            {Array.from({ length: total }).map((_, i) =>
            <div key={i} className={"step-bar" + (i < step ? " done" : i === step - 1 ? " active" : "")} />
            )}
          </div>
          <span style={{ color: "var(--text-soft)", fontFamily: "Switzer", fontSize: "12px" }}>
            Step {step} of {total}
          </span>
        </div>

        <h2 className="h-hero" style={{ margin: 0, marginBottom: 28, paddingRight: 12, fontSize: "33px", lineHeight: "0.95" }}>{title}</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
          {hint && <span style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-soft)" }}>{hint}</span>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
        </div>

        <div style={{ marginTop: 36, display: "flex", gap: 18 }}>
          <BtnTertiary style={{ flex: 1 }} onClick={onBack}>Back</BtnTertiary>
          <BtnPrimary style={{ flex: 1 }} onClick={onNext} disabled={!canContinue}>{nextLabel}</BtnPrimary>
        </div>
      </div>
    </div>);

}

/* ---- Step 1 — Days ---------------------------------------------- */
function F0Days({ value, onChange, onBack, onNext }) {
  const toggle = (d) => {
    onChange((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };
  return (
    <F0StepShell step={1} total={3} title="Which days of the week work best ?"
    hint="Select all that apply"
    onBack={onBack} onNext={onNext}
    canContinue={value.length > 0}>
      {F0_DAYS.map((d) =>
      <DayTile key={d} label={d} checked={value.includes(d)} onToggle={() => toggle(d)} />
      )}
    </F0StepShell>);

}

/* ---- Step 2 — Times --------------------------------------------- */
function F0Times({ value, onChange, onBack, onNext }) {
  const toggle = (id) => {
    onChange((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  return (
    <F0StepShell step={2} total={3} title="What times work best?"
    hint="Select all that apply"
    onBack={onBack} onNext={onNext}
    canContinue={value.length > 0}>
      {F0_TIMES.map((t) =>
      <TimeTile key={t.id} label={t.label} sub={t.sub}
        icon={<img src={t.icon} alt="" style={{ width: 36, height: 36, display: "block" }} />}
        checked={value.includes(t.id)} onToggle={() => toggle(t.id)} />
      )}
    </F0StepShell>);

}

/* ---- Step 3 — Rank ---------------------------------------------- */
function F0Rank({ days, times, value, onChange, onBack, onNext }) {
  // Build candidates from days × times intersections (top 7-ish)
  const candidates = useMemo(() => {
    const list = [];
    days.slice(0, 4).forEach((d) => {
      times.slice(0, 3).forEach((t) => {
        const tInfo = F0_TIMES.find((x) => x.id === t);
        list.push({ id: `${d}-${t}`, label: `${d} ${tInfo?.label}`, sub: tInfo?.sub });
      });
    });
    return list.slice(0, 7);
  }, [days, times]);

  const toggle = (id) => {
    onChange((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length < 3) return [...prev, id];
      // shake
      const el = document.getElementById("rank-counter");
      if (el) {
        el.animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
          { duration: 280 }
        );
      }
      return prev;
    });
  };

  return (
    <F0StepShell step={3} total={3} title="Rank your top 3"
    hint={null}
    onBack={onBack} onNext={onNext}
    nextLabel="Finish"
    canContinue={value.length === 3}>
      <div id="rank-counter" style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-soft)",
        marginBottom: 4
      }}>
        <span>Optional - helps us prioritize</span>
        <span style={{
          color: value.length === 3 ? "var(--green-deep)" : "var(--text-soft)",
          fontWeight: 700
        }}>{value.length}/3 selected</span>
      </div>
      {candidates.map((c) => {
        const idx = value.indexOf(c.id);
        const checked = idx >= 0;
        return (
          <DayTile key={c.id} label={c.label}
          checked={checked}
          rank={checked ? idx + 1 : undefined}
          onToggle={() => toggle(c.id)} />);

      })}
    </F0StepShell>);

}

/* ---- Complete --------------------------------------------------- */
function F0Complete({ topPicks, onContinue }) {
  const items = topPicks.length ? topPicks : [
  "Thursday Evening (6-9pm)",
  "Wednesday Evening (6-9pm)",
  "Saturday Afternoon (12-3pm)"];

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: 0 }}>
        <div style={{
          margin: "0 5px",
          height: 220,
          borderRadius: 20,
          border: "0.5px solid var(--border-sage)",
          backgroundImage: "linear-gradient(rgba(156,175,166,0.40), rgba(156,175,166,0.40)), url(assets/complete.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          position: "relative", overflow: "hidden"
        }}>
          {/* burst sparkles */}
          {[0, 1, 2, 3, 4, 5].map((i) =>
          <div key={i} className="sparkle" style={{
            left: 40 + i * 40 + "px",
            top: 40 + i % 2 * 60 + "px",
            animationDelay: i * 0.15 + "s"
          }}>✦</div>
          )}
        </div>

        <div style={{ padding: "47px 20px 0", display: "flex", flexDirection: "column", gap: 36 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h2 className="h-section" style={{ margin: 0 }}>You're all set!</h2>
              <p style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-mid)" }}>
                These are priority matches based on your preferences
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                background: "var(--green-deep)",
                borderRadius: 12,
                padding: 26,
                color: "#fff",
                display: "flex", flexDirection: "column", gap: 16
              }}>
                {items.slice(0, 3).map((label, i) =>
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16,
                  animation: `slideIn 400ms ${i * 0.12}s forwards cubic-bezier(.2,.8,.2,1)` }}>
                    <IconCircleNum n={i + 1} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 14, letterSpacing: 0.14, color: "#fff", fontWeight: "300" }}>
                      {label}
                    </span>
                  </div>
                )}
              </div>
              <span className="caption" style={{ color: "var(--text-soft)", fontWeight: 400, fontSize: 12 }}>
                You can change these anytime in Settings
              </span>
            </div>
          </div>

          <BtnPrimary full onClick={onContinue}>Continue to Slot Booking</BtnPrimary>
        </div>
      </div>
      <style>{`@keyframes slideIn { from { transform: translateY(8px); } to { transform: none; } }`}</style>
    </div>);

}

Object.assign(window, { F0Splash, F0Welcome, F0Days, F0Times, F0Rank, F0Complete, F0_DAYS, F0_TIMES });