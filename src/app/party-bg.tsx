export default function PartyBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="party-bg">
      {/* Huge atmospheric blobs */}
      <div className="blob blob-huge-1" />
      <div className="blob blob-huge-2" />
      <div className="blob blob-huge-3" />

      {/* Large blobs */}
      <div className="blob blob-lg-1" />
      <div className="blob blob-lg-2" />
      <div className="blob blob-lg-3" />
      <div className="blob blob-lg-4" />

      {/* Medium blobs */}
      <div className="blob blob-md-1" />
      <div className="blob blob-md-2" />
      <div className="blob blob-md-3" />
      <div className="blob blob-md-4" />
      <div className="blob blob-md-5" />

      {/* Small balls */}
      <div className="ball ball-1" />
      <div className="ball ball-2" />
      <div className="ball ball-3" />
      <div className="ball ball-4" />
      <div className="ball ball-5" />
      <div className="ball ball-6" />
      <div className="ball ball-7" />
      <div className="ball ball-8" />
      <div className="ball ball-9" />
      <div className="ball ball-10" />

      {/* Sparkle dots */}
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
      <div className="dot dot-11" />
      <div className="dot dot-12" />

      {/* Geometric shapes */}
      <div className="shape shape-sq-1" />
      <div className="shape shape-sq-2" />
      <div className="shape shape-dm-1" />
      <div className="shape shape-dm-2" />
      <div className="shape shape-tri-1" />
      <div className="shape shape-tri-2" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
