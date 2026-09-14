import { useState } from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../siteConfig";
import projectData from "../data/projectdata.json";

export default function Home() {
  const projects = projectData.projects;
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i - 1 + projects.length) % projects.length);
  const next = () => setActiveIndex((i) => (i + 1) % projects.length);

  // Returns the relative position from active: -2, -1, 0, 1, 2
  const getOffset = (index) => {
    let offset = index - activeIndex;
    if (offset > projects.length / 2) offset -= projects.length;
    if (offset < -projects.length / 2) offset += projects.length;
    return offset;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)]" style={{ backgroundSize: "24px 24px" }} />
        <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] bg-(--accent) opacity-10 blur-[300px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT — TEXT */}
          <div className="flex flex-col gap-6 z-10">
            <p className="text-(--muted) tracking-widest text-sm uppercase">Welcome</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {siteConfig.name} <br/>
              <span className="text-(--accent)">{siteConfig.role}</span>
            </h1>
            <p className="text-(--muted) max-w-lg mt-2 text-lg">
              {siteConfig.tagline}
            </p>
          </div>

          {/* RIGHT — PROFILE */}
          <div className="relative flex justify-center items-center lg:justify-end">
            <div className="absolute inset-0 bg-(--accent)/30 blur-[100px] rounded-full" />
            <div className="relative w-72 h-72 sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-2 border-(--bordercolor) z-10 bg-(--surface)">
              <img 
                src="/profile-chair.jpg" 
                alt="Profile"
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 rounded-full"
                style={{ objectPosition: "center top" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROJECT CAROUSEL ================= */}
      <section className="relative py-24 px-6 overflow-hidden">
        
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-(--muted) tracking-widest text-sm uppercase mb-2">Mijn werk</p>
          <h2 className="text-3xl md:text-4xl font-bold">Projects</h2>
        </div>

        {/* Carousel track */}
        <div className="relative h-[460px] flex items-center justify-center">

          {projects.map((project, index) => {
            const offset = getOffset(index);
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            // Calculate transform values
            const translateX = offset * 340;
            const scale = isActive ? 1 : Math.abs(offset) === 1 ? 0.78 : 0.58;
            const opacity = isActive ? 1 : Math.abs(offset) === 1 ? 0.65 : 0.35;
            const zIndex = isActive ? 30 : Math.abs(offset) === 1 ? 20 : 10;
            const blur = isActive ? 0 : Math.abs(offset) === 1 ? 0 : 2;

            return (
              <div
                key={project.id}
                onClick={() => !isActive && setActiveIndex(index)}
                style={{
                  position: "absolute",
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  filter: blur > 0 ? `blur(${blur}px)` : "none",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: isActive ? "default" : "pointer",
                  width: "340px",
                }}
              >
                <Link
                  to={isActive ? `/projects/${project.id}` : "#"}
                  onClick={(e) => { if (!isActive) e.preventDefault(); }}
                  className={`group block bg-(--surface) rounded-2xl overflow-hidden border transition-all duration-300 shadow-2xl
                    ${isActive
                      ? "border-(--accent)/60 shadow-(--accent)/20"
                      : "border-(--bordercolor) pointer-events-none"
                    }`}
                >
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-(--overlay) opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-(--text) font-semibold">Bekijk Project →</span>
                      </div>
                    )}
                    {/* Orange glow bar at bottom for active */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-(--accent) to-transparent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className={`text-lg font-semibold mb-1 transition-colors ${isActive ? "text-(--accent)" : "text-(--text)"}`}>
                      {project.title}
                    </h3>
                    <p className="text-sm text-(--muted) line-clamp-2">{project.tagline}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Navigation arrows + dots */}
        <div className="flex items-center justify-center gap-6 mt-8">
          
          {/* Left arrow */}
          <button
            onClick={prev}
            aria-label="Previous project"
            className="group w-12 h-12 rounded-full border border-(--bordercolor) flex items-center justify-center text-(--muted) hover:border-(--accent) hover:text-(--accent) hover:bg-(--accent)/10 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2 items-center">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to project ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width: i === activeIndex ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === activeIndex ? "var(--accent)" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            aria-label="Next project"
            className="group w-12 h-12 rounded-full border border-(--bordercolor) flex items-center justify-center text-(--muted) hover:border-(--accent) hover:text-(--accent) hover:bg-(--accent)/10 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Project counter */}
        <p className="text-center text-(--muted) text-sm mt-4">
          <span className="text-(--accent) font-semibold">{activeIndex + 1}</span>
          <span className="mx-1">/</span>
          {projects.length}
        </p>
      </section>

    </div>
  );
}