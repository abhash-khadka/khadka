import { SiteData } from "@/lib/data";

export default function Quote({ data }: { data: SiteData['landing'] }) {
  const { images } = data;
  return (
    <section className="relative py-32 px-6 flex items-center justify-center text-center" style={{ background: "var(--bg-primary)" }}>
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed opacity-30"
        style={images?.quoteBg ? { backgroundImage: `url('${images.quoteBg}')` } : {}}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-background/20" />
      
      <div className="relative z-20 max-w-4xl mx-auto">
        <p className="font-semibold tracking-widest text-xs uppercase mb-6" style={{ color: "var(--color-accent)" }}>
          My Philosophy
        </p>
        <h2 className="text-3xl md:text-5xl font-medium leading-tight mb-8" style={{ color: "var(--text-primary)" }}>
          &quot;First, solve the problem. Then, write the code.&quot;
        </h2>
        <p className="italic" style={{ color: "var(--text-secondary)" }}>
          — John Johnson
        </p>
      </div>
    </section>
  );
}
