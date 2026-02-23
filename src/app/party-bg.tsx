export default function PartyBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="party-bg">
      {/* Floating orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />
      <div className="orb orb-6" />
      <div className="orb orb-7" />
      <div className="orb orb-8" />
      {/* Sparkles */}
      <div className="sparkle sparkle-1" />
      <div className="sparkle sparkle-2" />
      <div className="sparkle sparkle-3" />
      <div className="sparkle sparkle-4" />
      <div className="sparkle sparkle-5" />
      <div className="sparkle sparkle-6" />
      <div className="sparkle sparkle-7" />
      <div className="sparkle sparkle-8" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
