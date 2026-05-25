// Flow 1 — Slot booking
// landing → grid → (filters) → confirm → (error) → autolearn

// Reference "today" for the demo. Building Date objects per render lets the
// week range shift with the weekOffset filter without touching the rest of
// the flow's logic.
const F1_TODAY = new Date(2026, 4, 25); // May 25, 2026
const F1_DAY_ABBRS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const F1_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function daysForWeek(offsetDays) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(F1_TODAY);
    d.setDate(F1_TODAY.getDate() + offsetDays + i);
    const isToday = offsetDays === 0 && i === 0;
    return {
      abbr: isToday ? "TODAY" : F1_DAY_ABBRS[d.getDay()],
      date: `${F1_MONTHS[d.getMonth()]} ${d.getDate()}`,
    };
  });
}

const F1_WEEK_OPTIONS = [
  { offset: 0,  label: "This week" },
  { offset: 7,  label: "Next week" },
  { offset: 14, label: "In 2 weeks" },
];


const F1_SLOTS_2H = [
{ time: "10:00 AM - 12:00 PM", price: "£3", avail: true },
{ time: "12:00 PM - 02:00 PM", price: "£3", avail: false },
{ time: "02:00 PM - 04:00 PM", price: "£3", avail: true },
{ time: "06:00 PM - 08:00 PM", price: "£4", avail: true, eco: true },
{ time: "08:00 PM - 10:00 PM", price: "£3", avail: false }];

const F1_SLOTS_1H = [
{ time: "10:00 AM - 11:00 AM", price: "£4", avail: true },
{ time: "11:00 AM - 12:00 PM", price: "£4", avail: true },
{ time: "12:00 PM - 01:00 PM", price: "£4", avail: false },
{ time: "01:00 PM - 02:00 PM", price: "£4", avail: false },
{ time: "08:00 PM - 09:00 PM", price: "£5", avail: true, eco: true },
{ time: "09:00 PM - 10:00 PM", price: "£5", avail: true }];

// Deterministic per-day variation: same day index always produces the same
// availability/eco distribution, so navigating away and back stays consistent.
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6D2B79F5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function slotsForDay(base, mode, dayIdx, weekOffset = 0) {
  // mix mode + weekOffset into seed so each (week, day, mode) combo is unique
  const rng = mulberry32(
    dayIdx * 137 + (mode === "2h" ? 7 : 23) + weekOffset * 911
  );
  return base.map((s) => {
    const r = rng();
    // ~55% available, ~30% sold out, ~15% available + eco
    const avail = r > 0.30;
    const eco = avail && r > 0.85;
    return { ...s, avail, eco: eco || undefined };
  });
}


/* ---- Landing (Personalized) ------------------------------------ */
function F1Landing({ onBook, onBrowse, onBack }) {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: "9px 13px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 21 }}>
          <BtnSmall onClick={onBack} />
          <h2 className="h-section" style={{ margin: 0 }}>Choose your slot</h2>
        </div>

        <div className="card-pref" style={{
          animation: "cardIn 400ms cubic-bezier(.2,1.1,.4,1)"
        }}>
          <div className="pref-badge">
            <span className="ico"><img src="assets/badge-icon.svg" alt="" width="14" height="14"/></span>
            Your preferred slot
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{

              color: "var(--green-deep)", lineHeight: "30.8px", fontFamily: "\"Crimson Pro\"", letterSpacing: "-1px", fontWeight: "500", fontSize: "28px"
            }}>Thursday, May 22</div>
            <div className="h-card" style={{ fontSize: "24px", color: "rgb(28, 92, 66)" }}>7:00pm - 9:00pm</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <PrefRow label="Day" val="Thu, May 22" />
            <PrefRow label="Time" val="7-9pm" />
            <PrefRow label="Price" val="£3.00" />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <BtnTertiary style={{ flex: 1 }} onClick={onBrowse}>Browse all Slots</BtnTertiary>
            <BtnPrimary style={{ flex: 1 }} onClick={onBook}>Book This Slot</BtnPrimary>
          </div>
        </div>
      </div>
      <style>{`@keyframes cardIn { from { transform: translateY(12px) scale(0.98); } to { transform: none; } }`}</style>
    </div>);

}
function PrefRow({ label, val }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", padding: "13px 0",
      borderBottom: "1px solid rgba(28,92,66,0.12)"
    }}>
      <span style={{ color: "var(--text-mid)", fontFamily: "Switzer", fontSize: "15px" }}>{label}</span>
      <span style={{ color: "var(--text-dark)", fontSize: "16px", fontWeight: "400", fontFamily: "Switzer" }}>{val}</span>
    </div>);

}

/* ---- Grid ------------------------------------------------------ */
function F1Grid({ onContinue, onBack, onOpenFilters, onSlotConflict, weekOffset = 0 }) {
  const [mode, setMode] = useState("2h"); // 2h | 1h
  const [dayIdx, setDayIdx] = useState(0); // first day of the visible week
  const [chip, setChip] = useState(new Set()); // active filter chips
  const [picked, setPicked] = useState(null);

  const days = useMemo(() => daysForWeek(weekOffset), [weekOffset]);
  const slots = useMemo(
    () => slotsForDay(mode === "2h" ? F1_SLOTS_2H : F1_SLOTS_1H, mode, dayIdx, weekOffset),
    [mode, dayIdx, weekOffset]
  );

  // When the week range changes, reset to the first day of the new week and
  // drop any stale slot selection.
  useEffect(() => { setDayIdx(0); setPicked(null); }, [weekOffset]);

  // Clear any picked slot when day or mode changes so a stale index can't
  // carry across to a different slot list.
  const selectDay = (i) => { setPicked(null); setDayIdx(i); };

  const toggleChip = (c) => {
    const n = new Set(chip);
    if (n.has(c)) n.delete(c);else n.add(c);
    setChip(n);
  };

  const handlePick = (idx, slot) => {
    if (!slot.avail) {
      // shake unavailable
      const el = document.getElementById("slot-" + idx);
      el?.animate([
      { transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }],
      { duration: 280 });
      return;
    }
    setPicked(idx);
  };

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: "0 16px 24px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>
          <BtnSmall onClick={onBack} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <h2 className="h-section" style={{ margin: 0, fontSize: 30 }}>Choose your slot</h2>
            <button onClick={onOpenFilters}
            style={{
              height: 38, padding: "0 16px",
              borderRadius: 999,
              background: "transparent",
              color: "var(--green-deep)",
              border: "1px solid var(--green-deep)",
              display: "flex", alignItems: "center", gap: 6,
              cursor: "pointer",
              fontFamily: "var(--font-body)", fontSize: 12,
              flexShrink: 0
            }}>
              <IconFilter color="var(--green-deep)" />
              Filters
            </button>
          </div>
        </div>

        {/* filter chips */}
        <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
          {[
          { id: "hide", label: "Hide unavailable" },
          { id: "eve", label: "Evening" },
          { id: "aft", label: "Afternoon" },
          { id: "eco", label: "Eco" }].
          map((c) =>
          <div key={c.id} className={"chip" + (chip.has(c.id) ? "" : " off")} onClick={() => toggleChip(c.id)}>
              {c.label}
            </div>
          )}
        </div>

        {/* duration toggle */}
        <div className="toggle-2" style={{ marginTop: 20 }} onClick={() => { setPicked(null); setMode(mode === "2h" ? "1h" : "2h"); }}>
          <div className="toggle-2-knob" style={{ transform: mode === "2h" ? "translateX(0)" : "translateX(100%)" }} />
          <div className="toggle-2-opt" style={{ color: mode === "2h" ? "var(--green-deep)" : "#fff" }}>2-Hour</div>
          <div className="toggle-2-opt" style={{ color: mode === "1h" ? "var(--green-deep)" : "#fff" }}>1-Hour</div>
        </div>

        {/* day pills */}
        <div style={{ display: "flex", gap: 4, marginTop: 28 }}>
          {days.map((d, i) =>
          <div key={i} className={"day-pill" + (i === dayIdx ? " active" : "")}
          onClick={() => selectDay(i)}>
              <span style={{ fontSize: 8.5 }}>{d.abbr}</span>
            </div>
          )}
        </div>

        {/* slots list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}
        key={mode + dayIdx} // re-mount for animation
        >
          {(chip.has("hide") ? slots.filter((s) => s.avail) : slots).map((s, i) => {
            const isPicked = picked === i;
            return (
              <div key={i} id={"slot-" + i}
              className={"slot-card " + (s.avail ? isPicked ? "selected" : "available" : "unavailable")}
              onClick={() => handlePick(i, s)}
              style={{ animation: `slotIn 320ms ${i * 0.05}s forwards cubic-bezier(.2,.9,.3,1)` }}>
                
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {s.time}
                  {s.eco && <span style={{
                    fontSize: 10, padding: "2px 8px",
                    background: "var(--lime)", color: "var(--green-deep)",
                    borderRadius: 999, fontWeight: 700, letterSpacing: 0.5
                  }}>ECO</span>}
                </span>
                <span style={{ fontWeight: 500 }}>{s.avail ? s.price : "Sold out"}</span>
              </div>);

          })}
        </div>

        <div style={{ marginTop: 45 }}>
          <BtnPrimary full disabled={picked === null}
          onClick={() => {
            // 10% chance the slot was just taken
            if (Math.random() < 0.1) {onSlotConflict();return;}
            onContinue(slots[picked]);
          }}>
            Continue
          </BtnPrimary>
        </div>
      </div>

      <style>{`@keyframes slotIn { from { transform: translateY(8px); } to { transform: none; } }`}</style>
    </div>);

}

/* ---- Filters Sheet --------------------------------------------- */
function F1FiltersSheet({ open, onClose, onApply, weekOffset = 0, setWeekOffset }) {
  const [hideUnavail, setHideUnavail] = useState(true);
  const [tod, setTod] = useState(new Set(["morning"]));
  const [special, setSpecial] = useState(new Set(["eco"]));

  const toggle = (set, val, setter) => {
    const n = new Set(set);
    if (n.has(val)) n.delete(val);else n.add(val);
    setter(n);
  };

  const total = (hideUnavail ? 1 : 0) + tod.size + special.size;

  return (
    <>
      <div className={"sheet-backdrop" + (open ? " show" : "")} onClick={onClose} />
      <div className={"sheet" + (open ? " show" : "")}>
        <div className="sheet-handle" />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid var(--green-deep)", paddingBottom: 18, marginBottom: 24 }}>
          <span className="h-section" style={{ margin: 0, fontSize: "28px" }}>Filter Slots</span>
          <button onClick={onClose} aria-label="Close"
          style={{
            width: 34, height: 34, borderRadius: 22,
            background: "var(--green-deep)", color: "#fff", border: "none",
            display: "grid", placeItems: "center", cursor: "pointer"
          }}>
            <IconClose />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--green-deep)", marginBottom: 16, fontWeight: 400 }}>Date</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {F1_WEEK_OPTIONS.map((w) =>
                <div key={w.offset}
                     className={"chip" + (weekOffset === w.offset ? "" : " off")}
                     onClick={() => setWeekOffset?.(w.offset)}>
                  {w.label}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="h-card" style={{ marginBottom: 16, fontFamily: "Switzer", fontSize: "16px", fontWeight: "400", letterSpacing: "0px" }}>Quick Filter</div>
            <div style={{ display: "flex", gap: 8 }}>
              <div className={"chip" + (hideUnavail ? "" : " off")} onClick={() => setHideUnavail(true)}>
                Hide unavailable
              </div>
              <div className={"chip" + (!hideUnavail ? "" : " off")} onClick={() => setHideUnavail(false)}>
                Show all slots
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--green-deep)", marginBottom: 16, fontWeight: "400" }}>Time of Day</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["morning", "afternoon", "evening"].map((t) =>
              <div key={t} className={"chip" + (tod.has(t) ? "" : " off")} onClick={() => toggle(tod, t, setTod)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--green-deep)", marginBottom: 16, fontWeight: "400" }}>Special Filters</div>
            <div style={{ display: "flex", gap: 8 }}>
              <div className={"chip-stack" + (special.has("eco") ? "" : " off")} onClick={() => toggle(special, "eco", setSpecial)}>
                <span>Eco slots</span>
                <span className="sub">Off-peak</span>
              </div>
              <div className={"chip-stack" + (special.has("saver") ? "" : " off")} onClick={() => toggle(special, "saver", setSpecial)}>
                <span>Saver slots</span>
                <span className="sub">Budget</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{
              height: 50, borderRadius: 35,
              background: "var(--card-pale)", border: "1px solid var(--border-sage)",
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-body)", fontSize: 14, color: "var(--green-deep)"
            }}>
              {total} {total === 1 ? "filter" : "filters"} applied
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <BtnTertiary style={{ flex: 1 }} onClick={() => {setHideUnavail(true);setTod(new Set());setSpecial(new Set());}}>Reset</BtnTertiary>
              <BtnPrimary style={{ flex: 1 }} onClick={onApply}>Apply</BtnPrimary>
            </div>
          </div>
        </div>
      </div>
    </>);

}

/* ---- Confirmation with countdown ------------------------------- */
function F1Confirm({ slot, onChange, onCheckout, onBack, onTimeout }) {
  const [seconds, setSeconds] = useState(7122); // 1:58:42
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {if (seconds === 0) onTimeout?.();}, [seconds]);

  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor(seconds % 3600 / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  const pct = seconds / 7122;

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: "9px 18px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 21 }}>
          <BtnSmall onClick={onBack} />
          <h2 className="h-section" style={{ margin: 0 }}>Confirm your slot</h2>
        </div>

        <div className="card-pref-dark">
          <div className="pref-badge lime">
            <span className="ico"><img src="assets/badge-icon-alt.svg" alt="" width="14" height="14"/></span>
            Your slot
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="h-card" style={{ color: "#fff", fontSize: "28px" }}>
              {slot?.dateLabel ?? "Thursday, May 22"}
            </div>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 500,
              letterSpacing: "-0.04em", color: "#fff", fontSize: "23px"
            }}>
              {slot?.time ?? "7:00pm - 9:00pm"}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0 11px" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#fff" }}>Price</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "#fff" }}>{slot?.price ?? "£3.00"}</span>
            </div>

            <div style={{
              background: "var(--card-pale)", borderRadius: 12, padding: 14,
              display: "flex", flexDirection: "column", gap: 10
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-dark)", letterSpacing: 1, fontFamily: "Switzer", fontSize: "14px", fontWeight: "400" }}>Held For</span>
                <span style={{ fontWeight: 700, fontSize: 22, color: "var(--green-deep)", fontFamily: "Switzer" }}>
                  {hh}:{mm}:{ss}
                </span>
              </div>
              <div className="timer-bar"><span style={{ transform: `scaleX(${pct})` }} /></div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 21 }}>
          <BtnTertiary style={{ flex: 1 }} onClick={onChange}>Change Slot</BtnTertiary>
          <BtnPrimary style={{ flex: 1 }} onClick={onCheckout}>Proceed to Checkout</BtnPrimary>
        </div>
      </div>
    </div>);

}

/* ---- Slot Unavailable Error ------------------------------------ */
function F1Error({ onTryAgain, onBrowse, onPick, onBack }) {
  const alts = [
  { time: "07:00 PM - 09:00 PM", day: "Thu, May 22", price: "£4" },
  { time: "07:00 PM - 09:00 PM", day: "Fri, May 23", price: "£4" },
  { time: "07:00 PM - 09:00 PM", day: "Wed, May 21", price: "£4" }];

  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: 0 }}>
        <div style={{
          margin: "0 5px",
          height: 201,
          borderRadius: 20,
          border: "0.5px solid var(--border-sage)",
          backgroundImage: "linear-gradient(rgba(156,175,166,0.15), rgba(156,175,166,0.15)), url(assets/error.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          position: "relative"
        }}>
          <div style={{
            position: "absolute", left: 16, top: 16,
            background: "rgba(220,38,38,0.92)", color: "#fff",
            padding: "6px 12px", borderRadius: 14,
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
            display: "flex", gap: 6, alignItems: "center"
          }}>
            <span>⚠</span> Slot taken
          </div>
        </div>

        <div style={{ padding: "36px 20px 0", display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h2 className="h-section" style={{ margin: 0 }}>That slot was just booked</h2>
              <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-mid)" }}>
                We found similar alternatives for you.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--green-deep)", fontWeight: 500 }}>
                Alternatives
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {alts.map((a, i) =>
                <div key={i} className="slot-card available"
                onClick={() => onPick?.(a)}
                style={{
                  minHeight: 70,
                  animation: `altIn 360ms ${i * 0.08}s forwards cubic-bezier(.2,.9,.3,1)` }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontSize: 14, color: "var(--text-dark)" }}>{a.time}</span>
                      <span style={{ fontSize: 13, color: "var(--text-mid)" }}>{a.day}</span>
                    </div>
                    <span style={{ fontWeight: 500 }}>{a.price}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 18 }}>
            <BtnTertiary style={{ flex: 1 }} onClick={onTryAgain}>Try Again</BtnTertiary>
            <BtnPrimary style={{ flex: 1 }} onClick={onBrowse}>Browse All</BtnPrimary>
          </div>
        </div>
      </div>
      <style>{`@keyframes altIn { from { transform: translateX(8px); } to { transform: none; } }`}</style>
    </div>);

}

/* ---- Slot Booked Success --------------------------------------- */
// Positive counterpart to F1Error. Anchor image is a placeholder
// (complete.jpg) — swap when final art lands.
function F1Success({ slot, onContinue }) {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: 0 }}>
        <div style={{
          margin: "0 5px",
          height: 201,
          borderRadius: 20,
          border: "0.5px solid var(--border-sage)",
          backgroundImage: "linear-gradient(rgba(156,175,166,0.15), rgba(156,175,166,0.15)), url(assets/complete.jpg)",
          backgroundSize: "cover", backgroundPosition: "center",
          position: "relative"
        }}>
          <div style={{
            position: "absolute", left: 16, top: 16,
            background: "var(--green-deep)", color: "#fff",
            padding: "6px 12px", borderRadius: 14,
            fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
            display: "flex", gap: 6, alignItems: "center"
          }}>
            <span>✓</span> Booked
          </div>
        </div>

        <div style={{ padding: "36px 20px 0", display: "flex", flexDirection: "column", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h2 className="h-section" style={{ margin: 0 }}>Your slot is booked</h2>
              <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-mid)" }}>
                We'll send a reminder before your delivery window.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--green-deep)", fontWeight: 500 }}>
                Booking
              </div>
              <div className="slot-card available" style={{ minHeight: 70, cursor: "default" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 14, color: "var(--text-dark)" }}>{slot?.time ?? "7:00pm - 9:00pm"}</span>
                  <span style={{ fontSize: 13, color: "var(--text-mid)" }}>{slot?.dateLabel ?? "Thursday, May 22"}</span>
                </div>
                <span style={{ fontWeight: 500 }}>{slot?.price ?? "£3.00"}</span>
              </div>
            </div>
          </div>

          <BtnPrimary full onClick={onContinue}>Continue Shopping</BtnPrimary>
        </div>
      </div>
    </div>);
}

/* ---- Auto-Learning ---------------------------------------------- */
function F1AutoLearn({ onAccept, onDecline, onBack }) {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen-body" style={{ padding: "9px 19px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 8 }}>
          <BtnSmall onClick={onBack} />
        </div>

        <div className="card-pref" style={{
          marginTop: 16,
          animation: "cardIn 380ms cubic-bezier(.2,1.1,.4,1)", borderWidth: "1px", gap: "24px"
        }}>
          <div className="pref-badge">
            <span className="ico"><img src="assets/badge-icon.svg" alt="" width="14" height="14"/></span>
            Your preferred slot
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="h-card" style={{ width: "309px", fontSize: "24px" }}>We've learned your preferences</div>
            <div style={{ color: "var(--text-dark)", letterSpacing: "-0.04em", fontFamily: "Switzer", fontSize: "14px", fontWeight: "400", width: "280px", lineHeight: "1.3" }}>
              Based on your history, we've updated your preferences.
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <PrefColumn title="Before" muted items={["1. Thu Eve", "2. Wed Eve", "3. Sat Aft "]} />
            <PrefColumn title="After" items={["1. Thu 6-8", "2. Wed 6-8", "3. Sat 2-4"]} />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <BtnTertiary style={{ flex: 1 }} onClick={onDecline}>No, Thanks</BtnTertiary>
            <BtnPrimary style={{ flex: 1 }} onClick={onAccept}>Keep Changes</BtnPrimary>
          </div>
        </div>

        <div style={{ marginTop: 31 }}>
          <BtnPrimary full onClick={onAccept}>Continue shopping</BtnPrimary>
        </div>
      </div>
    </div>);

}

/* ---- Auto-Learn Prompt (modal overlay) -------------------------- */
// Floats over whatever screen is underneath (typically the hub when arriving
// from F1Success). Reuses the autolearn card body inside a centered modal.
function F1AutoLearnPrompt({ open, onAccept, onDecline }) {
  return (
    <>
      <div className={"sheet-backdrop" + (open ? " show" : "")} onClick={onDecline} />
      <div className={"autolearn-prompt" + (open ? " show" : "")}
           role="dialog" aria-modal="true" aria-label="Updated preferences">
        <div className="card-pref" style={{ borderWidth: "1px", gap: 24 }}>
          <div className="pref-badge">
            <span className="ico"><img src="assets/badge-icon.svg" alt="" width="14" height="14"/></span>
            Your preferred slot
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="h-card" style={{ fontSize: 24 }}>We've learned your preferences</div>
            <div style={{ color: "var(--text-dark)", letterSpacing: "-0.04em", fontFamily: "Switzer", fontSize: 14, fontWeight: 400, lineHeight: 1.3 }}>
              Based on your history, we've updated your preferences.
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <PrefColumn title="Before" muted items={["1. Thu Eve", "2. Wed Eve", "3. Sat Aft"]} />
            <PrefColumn title="After" items={["1. Thu 6-8", "2. Wed 6-8", "3. Sat 2-4"]} />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <BtnTertiary style={{ flex: 1 }} onClick={onDecline}>No, Thanks</BtnTertiary>
            <BtnPrimary style={{ flex: 1 }} onClick={onAccept}>Keep Changes</BtnPrimary>
          </div>
        </div>
      </div>
    </>);
}

function PrefColumn({ title, items, muted }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
      <span style={{
        fontFamily: "var(--font-body)", fontSize: 16,
        color: muted ? "var(--text-dark)" : "var(--green-deep)",
        fontWeight: muted ? 400 : 500
      }}>{title}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((s, i) =>
        <div key={i} style={{
          fontFamily: "var(--font-body)", fontSize: 16,
          color: muted ? "var(--text-mid)" : "var(--green-deep)",
          fontWeight: muted ? 400 : 500,
          animation: muted ? "none" : `fadeUp 380ms ${i * 0.08 + 0.1}s forwards`
        }}>
            {s}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeUp { from { transform: translateY(6px); } to { transform: none; } }`}</style>
    </div>);

}

Object.assign(window, { F1Landing, F1Grid, F1FiltersSheet, F1Confirm, F1Success, F1Error, F1AutoLearn, F1AutoLearnPrompt });