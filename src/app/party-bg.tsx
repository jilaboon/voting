export default function PartyBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="party-bg">
      {/* Flying balls - left to right */}
      <div className="fly fly-lr-1" />
      <div className="fly fly-lr-2" />
      <div className="fly fly-lr-3" />
      <div className="fly fly-lr-4" />
      <div className="fly fly-lr-5" />

      {/* Flying balls - right to left */}
      <div className="fly fly-rl-1" />
      <div className="fly fly-rl-2" />
      <div className="fly fly-rl-3" />
      <div className="fly fly-rl-4" />

      {/* Flying balls - top to bottom */}
      <div className="fly fly-tb-1" />
      <div className="fly fly-tb-2" />
      <div className="fly fly-tb-3" />

      {/* Flying balls - bottom to top */}
      <div className="fly fly-bt-1" />
      <div className="fly fly-bt-2" />

      {/* Diagonal flythroughs */}
      <div className="fly fly-diag-1" />
      <div className="fly fly-diag-2" />
      <div className="fly fly-diag-3" />
      <div className="fly fly-diag-4" />

      {/* Flying geometric shapes */}
      <div className="fly fly-sq-1" />
      <div className="fly fly-sq-2" />
      <div className="fly fly-dm-1" />
      <div className="fly fly-dm-2" />
      <div className="fly fly-tri-1" />
      <div className="fly fly-tri-2" />

      {/* Sparkle dust */}
      <div className="dot dot-1" />
      <div className="dot dot-2" />
      <div className="dot dot-3" />
      <div className="dot dot-4" />
      <div className="dot dot-5" />
      <div className="dot dot-6" />
      <div className="dot dot-7" />
      <div className="dot dot-8" />
      <div className="dot dot-9" />
      <div className="dot dot-10" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
