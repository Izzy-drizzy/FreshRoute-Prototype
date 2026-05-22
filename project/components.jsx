// Shared UI primitives for FreshRoute prototype.
// Buttons, status bar, checkbox tile, transitions.

const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

/* -------------------------------------------------- icons */
const IconCheck = (props) =>
<svg viewBox="0 0 10 8" fill="none" {...props}>
    <path d="M1 4 L3.8 6.5 L9 1" stroke="rgb(5,150,105)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

const IconArrowLeft = ({ size = 18 }) =>
<svg width={size} height={size} viewBox="0 0 20 16" fill="none">
    <path d="M8 1 L1 8 L8 15 M1 8 H19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

const IconArrowRight = ({ size = 16, color = "#fff" }) =>
<svg width={size} height={size} viewBox="0 0 20 16" fill="none">
    <path d="M12 1 L19 8 L12 15 M19 8 H1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

const IconClose = ({ size = 14 }) =>
<svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 2 L12 12 M12 2 L2 12" stroke="#fff" strokeWidth="2.25" strokeLinecap="round" />
  </svg>;

const IconUser = ({ color = "rgb(220,255,101)" }) =>
<svg width="14" height="15" viewBox="0 0 14 15" fill="none">
    <circle cx="7" cy="4" r="3" fill={color} />
    <path d="M1 14 C 1 10, 4 8, 7 8 S 13 10, 13 14" fill={color} />
  </svg>;

const IconFilter = ({ color = "rgb(220,255,101)" }) =>
<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M1 3 H15 L10 9 V14 L6 12 V9 L1 3 Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
  </svg>;

const IconSpark = ({ color = "rgb(220,255,101)" }) =>
<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 1 L9.5 6.5 L15 8 L9.5 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z" fill={color} />
  </svg>;

const IconCircleNum = ({ n }) =>
<img src={`assets/rank-${n}.svg`} alt={`#${n}`}
  style={{ width: 28, height: 28, display: "block", flex: "0 0 auto" }} />;


/* -------------------------------------------------- StatusBar */
function StatusBar({ dark = false }) {
  return (
    <div className={"statusbar" + (dark ? " on-dark" : "")}>
      <span className="time">9:41</span>
      <span style={{ width: 104 }} />
      <span className="icons">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="0.5" /><rect x="4.5" y="4" width="3" height="6" rx="0.5" /><rect x="9" y="2" width="3" height="8" rx="0.5" /><rect x="13.5" y="0" width="3" height="10" rx="0.5" /></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none"><path d="M7.5 3 C 4.5 3 2.5 5 1 6.5 L 7.5 10 L 14 6.5 C 12.5 5 10.5 3 7.5 3 Z" fill="currentColor" /></svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="currentColor" fill="none" /><rect x="2" y="2" width="16" height="7" rx="1" fill="currentColor" /><rect x="21" y="3.5" width="2" height="4" rx="0.5" fill="currentColor" /></svg>
      </span>
    </div>);

}

/* -------------------------------------------------- Buttons */
function BtnPrimary({ children, onClick, disabled, style, full }) {
  return (
    <button className={"btn btn-primary" + (full ? " btn-block" : "")}
    onClick={onClick} disabled={disabled} style={{ ...style, fontWeight: "400" }}>
      {children}
    </button>);

}
function BtnSecondary({ children, onClick, disabled, style, full }) {
  return (
    <button className={"btn btn-secondary" + (full ? " btn-block" : "")}
    onClick={onClick} disabled={disabled} style={{ ...style, fontWeight: "400" }}>
      {children}
    </button>);

}
function BtnTertiary({ children, onClick, disabled, style, full }) {
  return (
    <button className={"btn btn-tertiary" + (full ? " btn-block" : "")}
    onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>);

}
function BtnSmall({ onClick, dir = "left", style }) {
  return (
    <button className="btn-small" onClick={onClick} aria-label="Back" style={style}>
      {dir === "left" ? <IconArrowLeft /> : <IconArrowRight />}
    </button>);

}

/* -------------------------------------------------- Tile (checklist) */
function DayTile({ label, checked, onToggle, rank }) {
  return (
    <div className={"tile" + (checked ? " checked" : "")} onClick={onToggle} role="checkbox" aria-checked={checked}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {typeof rank === "number" && (
          <img src={`assets/rank-${rank}.svg`} alt={`#${rank}`} className="tile-rank-img" />
        )}
        <span>{label}</span>
      </div>
      <div className="tile-checkbox">
        <IconCheck width="11" height="9" />
      </div>
    </div>);

}

/* -------------------------------------------------- TimeTile (with icon) */
function TimeTile({ label, sub, icon, checked, onToggle }) {
  return (
    <div className={"tile tile-time" + (checked ? " checked" : "")} onClick={onToggle}>
      <div className="row">
        <div className="ti-icon">{icon}</div>
        <div className="ti-text">
          <span className="ti-title">{label}</span>
          <span className="ti-sub">{sub}</span>
        </div>
      </div>
      <div className="tile-checkbox">
        <IconCheck width="11" height="9" />
      </div>
    </div>);

}

/* -------------------------------------------------- Screen transition wrapper */
function ScreenSwitch({ screenKey, children }) {
  const [render, setRender] = useState({ key: screenKey, node: children, phase: "enter" });
  const lastKey = useRef(screenKey);
  useEffect(() => {
    if (lastKey.current === screenKey) {
      setRender((r) => ({ ...r, node: children }));
      return;
    }
    lastKey.current = screenKey;
    // simple cross-fade: just swap with enter animation
    setRender({ key: screenKey, node: children, phase: "enter" });
  }, [screenKey, children]);

  return (
    <div key={render.key} className="fade-enter fade-enter-active" style={{ position: "absolute", inset: 0 }}>
      {render.node}
    </div>);

}

/* Expose to window for cross-script use */
Object.assign(window, {
  IconCheck, IconArrowLeft, IconArrowRight, IconClose, IconUser, IconFilter, IconSpark, IconCircleNum,
  StatusBar, BtnPrimary, BtnSecondary, BtnTertiary, BtnSmall,
  DayTile, TimeTile, ScreenSwitch
});