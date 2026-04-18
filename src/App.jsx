import { useState, useEffect, useRef } from "react";
import "./App.css";

const isMobile = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const getMailHref = () =>
  isMobile()
    ? "mailto:gauravmali345@gmail.com"
    : "https://mail.google.com/mail/?view=cm&to=gauravmali345@gmail.com";

const NAV_LINKS = ["Home", "About", "Projects", "Skills", "Contact"];

const PROJECTS = [
  {
    id: 1,
    icon: "◈",
    title: "AI Customer support bot",
    tag: "Agentic AI · LangChain · Qdrant",
    desc: "Agentic system for automated customer interaction — detects context and replies intelligently.",
    bullets: [
      "Detects brand, sentiment, and intent",
      "Uses LangChain, OpenAI, and Qdrant",
      "Generates structured and human-like responses",
    ],
  },
  {
    id: 2,
    icon: "◎",
    title: "Social Media Data Automation",
    tag: "Selenium · Python · Analytics",
    desc: "Automated data scraping and processing pipeline for all major social media platforms.",
    bullets: [
      "Built using Selenium and Python",
      "Extracts and structures data from all social media platforms",
      "Enables analytics and insights generation",
    ],
  },
];

const SKILLS = [
  "LangChain","RAG","Agentic AI","LLMs APIs","Data Pipelines",
  "Dashboarding","Python","FastAPI","Vector Database",
];

/* ── Particle Canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.4 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x = (p.x + p.dx + W) % W;
        p.y = (p.y + p.dy + H) % H;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(127,255,180,${p.alpha})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(127,255,180,${0.06*(1-dist/120)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="particle-canvas" />;
}

/* ── Typed Text ── */
function TypedText({ words }) {
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [del, setDel] = useState(false);
  const [display, setDisplay] = useState("");
  useEffect(() => {
    const w = words[idx];
    let t;
    if (!del && char <= w.length) { setDisplay(w.slice(0, char)); t = setTimeout(() => setChar(c => c+1), 70); }
    else if (!del) { t = setTimeout(() => setDel(true), 1800); }
    else if (del && char >= 0) { setDisplay(w.slice(0, char)); t = setTimeout(() => setChar(c => c-1), 40); }
    else { setDel(false); setIdx(i => (i+1) % words.length); setChar(0); }
    return () => clearTimeout(t);
  }, [char, del, idx, words]);
  return <span className="typed-text">{display}<span className="typed-cursor">|</span></span>;
}

/* ── useReveal ── */
function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

/* ── Magnetic wrapper ── */
function Mag({ tag: Tag = "button", children, ...props }) {
  const ref = useRef(null);
  const move = e => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width/2)*0.28}px,${(e.clientY - r.top - r.height/2)*0.28}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  return <Tag ref={ref} {...props} onMouseMove={move} onMouseLeave={leave}>{children}</Tag>;
}

/* ── Project card ── */
function ProjectCard({ p }) {
  const [ref, vis] = useReveal();
  const [hov, setHov] = useState(false);
  const move = e => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX-r.left)/r.width)*100}%`);
    el.style.setProperty("--my", `${((e.clientY-r.top)/r.height)*100}%`);
  };
  return (
    <div
      ref={ref}
      className={`project-card${hov ? " hovered" : ""}${vis ? " card-visible" : ""}`}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onMouseMove={move}
      style={{ transitionDelay: `${p.id * 80}ms` }}
    >
      <div className="card-spotlight" />
      <div className="project-icon">{p.icon}</div>
      <div className="project-body">
        <div className="project-tag">{p.tag}</div>
        <h3 className="project-title">{p.title}</h3>
        <p className="project-desc">{p.desc}</p>
        <ul className="project-bullets">{p.bullets.map((b,i) => <li key={i}>{b}</li>)}</ul>
      </div>
      <div className="project-number">0{p.id}</div>
    </div>
  );
}

/* ── Skill pill ── */
function SkillPill({ skill, index }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`skill-pill${vis ? " skill-visible" : ""}`} style={{ transitionDelay: `${index*60}ms` }}>
      <span className="skill-dot" />{skill}
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const sectionsRef = useRef({});
  const [heroRef, heroVis] = useReveal();
  const [aboutRef, aboutVis] = useReveal();
  const [contactRef, contactVis] = useReveal();

  useEffect(() => {
    const upd = () => setTime(new Date().toLocaleTimeString("en-IN", { timeZone:"Asia/Kolkata", hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    upd(); const id = setInterval(upd, 1000); return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.dataset.section); }), { threshold: 0.4 });
    Object.values(sectionsRef.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = section => { sectionsRef.current[section]?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };

  return (
    <div className="app">
      <div className="grain" />
      <ParticleCanvas />
      <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />

      <nav className={`nav${scrolled ? " nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <span className="nav-logo" onClick={() => scrollTo("Home")}>gaurav<span className="accent">.</span></span>
          <ul className={`nav-links${menuOpen ? " open" : ""}`}>
            {NAV_LINKS.map(l => (
              <li key={l}>
                <button className={activeSection === l ? "active" : ""} onClick={() => scrollTo(l)}>
                  {l}{activeSection === l && <span className="nav-active-bar" />}
                </button>
              </li>
            ))}
          </ul>
          <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="section hero" data-section="Home"
        ref={el => { sectionsRef.current["Home"] = el; heroRef.current = el; }}>
        <div className={`hero-meta${heroVis ? " reveal-up" : " pre-reveal"}`} style={{ animationDelay:"0ms" }}>
          <span className="timezone">Asia/Kolkata · {time}</span>
          <span className="location-dot" /><span className="location">India</span>
        </div>
        <div className={`hero-content${heroVis ? " reveal-up" : " pre-reveal"}`} style={{ animationDelay:"120ms" }}>
          <div className="hero-badge"><span className="badge-pulse" />AI & Data Engineer</div>
          <h1 className="hero-title">Hi, I'm<br /><span className="name-gradient">Gaurav</span></h1>
          <p className="hero-sub">
            I build <TypedText words={["AI-powered systems.","agentic AI workflows.","RAG pipelines.","LangChain apps."]} /><br />
            Solving real-world data and business problems.
          </p>
          <div className="hero-cta">
            <Mag className="btn-primary" onClick={() => scrollTo("Projects")}>View AI Projects</Mag>
            <Mag className="btn-ghost" onClick={() => scrollTo("Contact")}>Get in Touch</Mag>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orbit-glow" />
          <div className="orbit-ring r1">
            {["RAG","LLM","Agentic AI"].map((t,i) => <span key={i} className="orbit-tag" style={{"--i":i}}>{t}</span>)}
          </div>
          <div className="orbit-ring r2">
            {["Python","LangChain","Vector DB","FastAPI"].map((t,i) => <span key={i} className="orbit-tag" style={{"--i":i}}>{t}</span>)}
          </div>
          <div className="core-dot"><div className="core-ring" /><div className="core-ring core-ring-2" /></div>
        </div>
        <div className="scroll-hint">scroll ↓</div>
      </section>

      {/* About */}
      <section className="section about" data-section="About"
        ref={el => { sectionsRef.current["About"] = el; aboutRef.current = el; }}>
        <div className={`section-label${aboutVis ? " reveal-left" : " pre-reveal"}`}>01 — About</div>
        <div className="about-grid">
          <div className={`about-left${aboutVis ? " reveal-up" : " pre-reveal"}`} style={{ animationDelay:"80ms" }}>
            <h2 className="section-title">About Me</h2>
            <p className="about-text">I'm a Computer Science Engineer based in India, specializing in AI and data systems.</p>
            <p className="about-text">I build intelligent applications that combine LLMs, data pipelines, and agentic AI to automate workflows and generate insights.</p>
            <p className="about-text">My work includes dashboards, data processing, and AI systems powered by RAG, LangChain, and vector databases.</p>
          </div>
          <div className={`about-right${aboutVis ? " reveal-up" : " pre-reveal"}`} style={{ animationDelay:"180ms" }}>
            <div className="spec-card glass-card">
              <div className="spec-title">I specialize in</div>
              <ul className="spec-list">
                <li>Turning raw data into actionable insights</li>
                <li>Building AI-driven applications</li>
                <li>Automating workflows using LLMs</li>
                <li>Designing Agentic AI workflows with autonomous agents</li>
              </ul>
            </div>
            <div className="enjoy-card glass-card">
              <div className="enjoy-title">💡 What I Enjoy</div>
              <p>Building Agentic AI systems and automation pipelines, exploring how LLMs can solve real-world business problems. I constantly experiment with new tools and frameworks to stay updated in the AI space.</p>
              <p style={{ marginTop:"0.75rem" }}>Focused on building agentic AI systems that can reason, act, and automate workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section projects" data-section="Projects" ref={el => sectionsRef.current["Projects"] = el}>
        <div className="section-label">02 — Projects</div>
        <h2 className="section-title">Selected Work</h2>
        <div className="projects-grid">{PROJECTS.map(p => <ProjectCard key={p.id} p={p} />)}</div>
      </section>

      {/* Skills */}
      <section className="section skills" data-section="Skills" ref={el => sectionsRef.current["Skills"] = el}>
        <div className="section-label">03 — Skills</div>
        <h2 className="section-title">Tech Stack</h2>
        <div className="skills-wrap">{SKILLS.map((s,i) => <SkillPill key={i} skill={s} index={i} />)}</div>
      </section>

      {/* Contact */}
      <section className="section contact" data-section="Contact"
        ref={el => { sectionsRef.current["Contact"] = el; contactRef.current = el; }}>
        <div className="section-label">04 — Contact</div>
        <div className={`contact-inner${contactVis ? " reveal-up" : " pre-reveal"}`}>
          <h2 className="section-title contact-title">Let's Connect</h2>
          <p className="contact-sub">Feel free to connect with me for opportunities, collaborations, or just to discuss AI and tech!</p>
          <Mag tag="a" className="btn-primary contact-btn" href={getMailHref()} target="_blank" rel="noreferrer">Say Hello →</Mag>
          <div className="connect-socials">
            <Mag tag="a" className="connect-social-btn" href="https://github.com/gaurav7519" target="_blank" rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              GitHub
            </Mag>
            <Mag tag="a" className="connect-social-btn" href="https://www.linkedin.com/in/gauravmali75/" target="_blank" rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </Mag>
            <Mag tag="a" className="connect-social-btn" href={getMailHref()} target="_blank" rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
              Mail
            </Mag>
          </div>
        </div>
      </section>

      <footer className="footer"><span>© 2026 /Gaurav/ AI & Data Engineer</span></footer>
    </div>
  );
}
