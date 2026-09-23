import { Skeleton } from "@/components/ui/Skeleton";

function SkeletonCard() {
  return (
    <div style={{
      background: "var(--surface-2)",
      border: "0.5px solid var(--sep)",
      borderRadius: "16px",
      overflow: "hidden",
    }}>
      <div style={{ aspectRatio: "3/4", padding: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="w-full h-full" style={{ background: "var(--surface-3)", borderRadius: "12px" }} />
      </div>
      <div style={{ padding: "12px 12px 16px" }}>
        <div style={{ height: 14, borderRadius: 4, background: "var(--surface-3)", width: "60%", marginBottom: 8 }} />
        <div style={{ height: 10, borderRadius: 4, background: "var(--surface-3)", width: "80%", marginBottom: 12 }} />
        <div style={{ height: 20, borderRadius: 9999, background: "var(--surface-3)", width: 64 }} />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="glass-header">
        <div className="header-inner">
          <div className="gradient-text font-bold text-base">iin house</div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: 48, height: 28, borderRadius: 8, background: "var(--surface-3)" }} />
            <div style={{ width: 64, height: 28, borderRadius: 8, background: "var(--surface-3)" }} />
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 16px 8px" }}>
        <div style={{ background: "var(--surface-3)", border: "0.5px solid var(--sep)", borderRadius: "12px", padding: "10px 14px" }}>
          <div style={{ height: 14, borderRadius: 4, background: "rgba(255,255,255,0.04)", width: 192 }} />
        </div>
      </div>

      <div style={{ padding: "4px 16px 12px", display: "flex", gap: "8px" }}>
        {[48, 40, 56, 52, 44].map((w, i) => (
          <div key={i} style={{ width: w, height: 30, borderRadius: 20, background: "var(--surface-3)" }} />
        ))}
      </div>

      <main className="container" style={{ paddingTop: "8px", paddingBottom: "60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "14px" }}>
          {[0, 1, 2].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
