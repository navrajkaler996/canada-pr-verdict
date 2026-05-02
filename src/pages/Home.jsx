import { useRef, useEffect, useState } from "react";
import { ArrowRight, MapleLeaf } from "../components/icons";
import { FEATURES, CRS_BARS } from "../constants/crsData";
import { useNavigate } from "react-router-dom";

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.2 + 0.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      a: Math.random() * 0.5 + 0.15,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,38,38,${p.a * 0.45})`;
        ctx.fill();
      });
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach((b) => {
          const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(220,38,38,${(1 - d / 110) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }),
      );
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function AnimatedBar({ value, max, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth((value / max) * 100), 600 + delay);
    return () => clearTimeout(t);
  }, [value, max, delay]);
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-[1200ms]`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MapleLeaf />
            <span className="font-medium text-gray-900 text-[15px]">
              Canadian <span className="text-red-600">PR</span> Verdict
            </span>
          </div>
          <button
            onClick={() => navigate("/select-path")}
            className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white text-sm font-medium px-5 py-2.5 rounded-full">
            Check eligibility
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[520px] flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        {/* <ParticleCanvas /> */}
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 mb-7">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            Updated with latest Express Entry draws
          </div>
          <h1
            className="text-5xl md:text-6xl font-semibold text-gray-900 leading-[1.07] mb-5"
            style={{ fontFamily: "'Georgia', serif" }}>
            Your real shot at
            <br />
            <span className="text-red-600">Canadian PR</span>
            <br />— no sugarcoating
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-9">
            Your immigration agent is optimistic. We're not.
            <br />
            Get an honest, data-driven verdict on your permanent residency
            chances.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/select-path")}
              className="group flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all text-white font-medium text-[15px] px-7 py-3.5 rounded-2xl">
              Check my chances
              <span className="group-hover:translate-x-1 transition-transform">
                <ArrowRight />
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium text-[15px] px-7 py-3.5 rounded-2xl transition-all">
              How it works ↗
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div className="max-w-2xl mx-auto px-6 py-14">
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-5">
          What we actually tell you
        </p>
        <div className="flex flex-col gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group flex items-start gap-4 border border-gray-100 hover:border-red-200 hover:bg-red-50/30 rounded-xl px-5 py-4 cursor-pointer transition-all duration-200">
              <div
                className={`${f.iconBg} w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {f.title}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CRS SNAPSHOT */}
      <div className="max-w-2xl mx-auto px-6 pb-16">
        <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-5">
          Recent Express Entry landscape
        </p>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-gray-900">
              CRS draw history snapshot
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />{" "}
              Live data
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {CRS_BARS.map((bar, i) => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>{bar.label}</span>
                  <span className="font-medium text-gray-700">
                    {bar.value} / {bar.max}
                  </span>
                </div>
                <AnimatedBar
                  value={bar.value}
                  max={bar.max}
                  color={bar.color}
                  delay={i * 100}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-5 pt-4 border-t border-gray-200 leading-relaxed">
            PNP rounds require a provincial nomination (+600 pts added
            automatically). Trades draws are category-based — NOC codes apply.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-6 text-center">
        <p className="text-sm font-medium text-gray-900 mb-1">
          Canadian <span className="text-red-600">PR</span> Verdict
        </p>
        <p className="text-xs text-gray-400">
          Not legal advice. For informational purposes only.
        </p>
      </footer>
    </div>
  );
}
