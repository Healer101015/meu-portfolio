import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiArrowRight, FiUpload, FiImage, FiVideo, FiDownload, FiCode, FiLayout, FiSmartphone, FiTerminal, FiGlobe, FiX } from 'react-icons/fi';
import { FaAws, FaGoogle } from 'react-icons/fa';

// ==========================================
// 📥 IMPORTAÇÃO DOS SEUS ARQUIVOS (ASSETS)
// ==========================================
import MinhaFoto from './assets/perfil.png';
import VideoBuilder from './assets/react builder.mp4';
import ImgBanco from './assets/banco.mp4';
import VideoNarrativa from './assets/eco_da_sinfonia.mp4';
import Videocontroledeestoque from './assets/cafeteria.mp4';
import CurriculoPDF from './assets/Joao_Brito.pdf'; // <-- FIX: Importando o PDF!

// --- CURSOR PERSONALIZADO ---
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => {
      if (document.getElementById('video-modal')) return;
      if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('.group')) setIsHovering(true);
      else setIsHovering(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[100] mix-blend-difference border border-white hidden md:flex items-center justify-center bg-white/10"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
      }}
      transition={{
        x: { type: "tween", duration: 0 },
        y: { type: "tween", duration: 0 },
        scale: { type: "spring", stiffness: 500, damping: 28 },
        backgroundColor: { duration: 0.2 }
      }}
    />
  );
};

// --- TELA DE CARREGAMENTO CINEMATOGRÁFICA ---
const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[999] bg-[#000000] flex flex-col items-center justify-center text-white"
    >
      <div className="overflow-hidden">
        <motion.h1
          initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-7xl font-black tracking-tighter"
        >
          JH<span className="text-accent">.</span>
        </motion.h1>
      </div>
      <div className="mt-8 flex flex-col items-center w-64">
        <div className="text-sm font-mono tracking-widest text-slate-500 mb-2 uppercase">Iniciando Sistema</div>
        <div className="h-[2px] w-full bg-white/10 relative overflow-hidden rounded-full">
          <motion.div className="absolute top-0 left-0 h-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-xs font-mono text-accent">{Math.min(progress, 100)}%</div>
      </div>
    </motion.div>
  );
};

// --- ROTAÇÃO DE TEXTO DINÂMICA ---
const RotatingText = () => {
  const words = ["Full-Stack", "Multiplataforma", "Inovador"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % words.length), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[1.2em] overflow-hidden relative inline-block align-bottom px-2">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={{ y: 40, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="block text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-400 to-accent"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// --- ANIMAÇÕES GERAIS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

// --- COMPONENTE 3D APRIMORADO ---
function GeometricCore() {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t / 4) * 0.2;
    meshRef.current.rotation.y = Math.cos(t / 4) * 0.2;
    if (!hovered) meshRef.current.position.y = Math.sin(t) * 0.05;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere
        ref={meshRef} args={[1, 128, 128]} scale={2.8}
        onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={hovered ? "#a78bfa" : "#3b82f6"}
          attach="material" distort={0.5} speed={3} roughness={0.1} metalness={0.8}
          emissive={hovered ? "#a78bfa" : "#3b82f6"} emissiveIntensity={0.2}
        />
      </Sphere>
    </Float>
  );
}

// --- SITE PRINCIPAL ---
function App() {
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  const { scrollYProgress } = useScroll();
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (loading || activeVideo) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [loading, activeVideo]);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches && !activeVideo) document.body.style.cursor = 'none';
    else document.body.style.cursor = 'auto';
  }, [activeVideo]);

  const projects = [
    {
      title: "Internet Banking Medieval",
      tech: "React, Node.js, MySQL",
      desc: "Arquitetura financeira completa, do back-end robusto à interface React elegante, com foco em segurança e UX fluida, Faz pix e transações, tudo com um toque de fantasia medieval.",
      mediaType: 'video',
      mediaSrc: ImgBanco
    },
    {
      title: "React Builder Pro",
      tech: "TypeScript, Dnd-kit",
      desc: "Construtor No-Code de sites em react avançado focando em manipulação severa de DOM e estado.",
      mediaType: 'video',
      mediaSrc: VideoBuilder
    },
    {
      title: "Controle de Estoque Cafeteria",
      tech: "Java, Node.js, MongoDB",
      desc: "Plataforma de gestão de inventário e fluxo com interface dinâmica e responsiva.",
      mediaType: 'video',
      mediaSrc: Videocontroledeestoque
    },
    {
      title: "Eco da Sinfonia - Narrativa",
      tech: "React, Three.js",
      desc: "Storytelling imersivo estruturado em atos, focando em narrativa envolvente.",
      mediaType: 'video',
      mediaSrc: VideoNarrativa
    }
  ];

  const certificacoes = [
    { icon: FiCode, title: "Desenvolvedor Back-End", org: "Fatec Itaquera", info: "Nível Profissional" },
    { icon: FiLayout, title: "Desenvolvedor Front-End", org: "Fatec Itaquera", info: "Nível Profissional" },
    { icon: FiSmartphone, title: "Desenvolvedor Mobile", org: "Fatec Itaquera", info: "Nível Profissional" },
    { icon: FaAws, title: "AWS Cloud Foundations", org: "Amazon Web Services", info: "Conclusão: 06/2025" },
    { icon: FaGoogle, title: "Cloud Computing Foundations", org: "Google", info: "Conclusão: 06/2025" },
    { icon: FaGoogle, title: "Secure Cloud Network", org: "Google", info: "Conclusão: 06/2025" },
    { icon: FiTerminal, title: "Lógica da Programação", org: "SENAI", info: "25 horas • 2018" },
    { icon: FiGlobe, title: "Inglês com Certificação", org: "FATEC Itaquera", info: "Conclusão: 06/2024" }
  ];

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* --- MODAL DE VÍDEO (CINEMA MODE) --- */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            id="video-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-auto"
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-white/10 hover:bg-accent hover:text-white rounded-full flex items-center justify-center text-white transition-colors z-50 shadow-xl"
            >
              <FiX size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.3)] border border-white/10"
            >
              <video src={activeVideo} controls autoPlay className="w-full h-full object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-accent/30 selection:text-white relative overflow-x-hidden font-sans">

        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-accent/15 rounded-full blur-[180px] pointer-events-none z-0" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[180px] pointer-events-none z-0" />

        {/* Navbar */}
        <motion.nav
          initial={{ y: -100 }} animate={{ y: loading ? -100 : 0 }} transition={{ delay: 0.2, duration: 1 }}
          className="fixed top-0 left-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5"
        >
          <div className="flex justify-between items-center p-6 md:p-8 max-w-[90rem] mx-auto">
            <div className="text-3xl font-black tracking-tighter text-white flex items-center gap-1">
              JH<span className="w-2.5 h-2.5 rounded-full bg-accent mt-2.5 animate-pulse"></span>
            </div>
            <ul className="flex gap-12 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] hidden md:flex">
              {['Trajetória', 'Projetos', 'Contato'].map(item => (
                <li key={item} className="cursor-none relative group overflow-hidden">
                  <a href={`#${item.toLowerCase()}`} className="inline-block transition-transform duration-300 group-hover:-translate-y-full hover:text-white">{item}</a>
                  <a href={`#${item.toLowerCase()}`} className="absolute top-0 left-0 text-accent transition-transform duration-300 translate-y-full group-hover:translate-y-0">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="relative flex items-center min-h-screen px-6 pt-20 z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40 md:opacity-60 md:translate-x-[20%] pointer-events-none flex items-center justify-center">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <ambientLight intensity={0.6} /><directionalLight position={[10, 10, 5]} intensity={1.8} />
              <GeometricCore />
            </Canvas>
          </div>

          <motion.div style={{ y: yHeroText, opacity: opacityHero }} className="relative z-10 max-w-[90rem] mx-auto w-full flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 text-left mt-10 md:mt-0">
              <motion.div variants={fadeInUp} initial="hidden" animate={!loading ? "visible" : "hidden"} className="overflow-hidden mb-6">
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-200 text-xs md:text-sm font-mono backdrop-blur-md shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  Disponível para novos desafios
                </div>
              </motion.div>

              <h1 className="text-6xl md:text-[8rem] font-black text-white mb-6 tracking-tighter leading-[0.85] flex flex-col">
                <motion.span variants={fadeInUp} initial="hidden" animate={!loading ? "visible" : "hidden"} custom={1}>João</motion.span>
                <motion.span variants={fadeInUp} initial="hidden" animate={!loading ? "visible" : "hidden"} custom={2} className="ml-0 md:ml-12 text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-400 to-accent bg-[length:200%_auto] animate-gradient-x shadow-text-glow">Henrique</motion.span>
              </h1>

              <motion.div variants={fadeInUp} initial="hidden" animate={!loading ? "visible" : "hidden"} custom={3} className="text-xl md:text-4xl font-light text-slate-300 mb-12 flex items-center flex-wrap">
                Desenvolvedor <RotatingText />
              </motion.div>

              <motion.div variants={fadeInUp} initial="hidden" animate={!loading ? "visible" : "hidden"} custom={4} className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                <a href="#projetos" className="cursor-pointer md:cursor-none w-full sm:w-auto text-center px-12 py-5 bg-accent text-white font-bold rounded-2xl hover:bg-blue-500 transition-all duration-500 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                  Explorar Obras <FiArrowRight className="text-lg" />
                </a>

                {/* FIX DO DOWNLOAD NO HERO: Adicionado o import CurriculoPDF */}
                <a href={CurriculoPDF} download="JoaoBrito.pdf" className="cursor-pointer md:cursor-none w-full sm:w-auto text-center px-12 py-5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-500 backdrop-blur-md uppercase tracking-widest text-xs flex items-center justify-center gap-3 group">
                  Baixar CV <FiDownload className="group-hover:translate-y-1 transition-transform" />
                </a>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} initial="hidden" animate={!loading ? "visible" : "hidden"} custom={5} className="relative flex-shrink-0 hidden lg:block">
              <div className="w-[400px] h-[500px] bg-[#0f172a] rounded-3xl border border-slate-700/60 flex items-center justify-center shadow-2xl relative overflow-hidden group hover:border-accent/70 transition-colors duration-500">
                {MinhaFoto ? (
                  <img src={MinhaFoto} alt="João Henrique" className="absolute inset-0 w-full h-full object-cover transition-all duration-700 z-0 group-hover:scale-105" />
                ) : (
                  <div className="flex flex-col items-center text-slate-500 z-20 group-hover:text-accent transition-colors duration-500">
                    <FiUpload className="text-5xl mb-4" />
                    <span className="text-xs font-mono tracking-widest uppercase">Sem Foto</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-700 z-10 pointer-events-none" />
                {!MinhaFoto && <div className="absolute top-0 left-0 w-full h-[2px] bg-accent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite] z-30" />}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Projetos */}
        <section id="projetos" className="py-24 md:py-40 px-6 max-w-[90rem] mx-auto relative z-10 border-t border-white/5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-16 md:mb-24 flex justify-between items-end border-b border-white/10 pb-10">
            <div>
              <h2 className="text-accent font-mono tracking-widest uppercase mb-3 text-sm">Portfólio</h2>
              <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Projetos.</h3>
            </div>
            <a href="https://github.com/Healer101015" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest pb-3 group hidden md:flex cursor-none">
              Ver GitHub <FiGithub size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-24">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
                className="group cursor-pointer md:cursor-none bg-[#0f172a]/70 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-slate-800 hover:border-accent/60 transition-colors duration-500 shadow-xl"
              >
                <div
                  onClick={() => project.mediaSrc && setActiveVideo(project.mediaSrc)}
                  className="relative aspect-[4/3] bg-[#020617] rounded-2xl overflow-hidden mb-6 md:mb-8 border border-slate-700/50 group-hover:border-accent/40 transition-colors duration-700 flex items-center justify-center group/video"
                >
                  {project.mediaSrc ? (
                    project.mediaType === 'video' ? (
                      <video
                        src={project.mediaSrc} autoPlay loop={false} muted playsInline
                        onTimeUpdate={(e) => { if (e.target.currentTime >= 5) e.target.currentTime = 0; }}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 z-10"
                      />
                    ) : (
                      <img src={project.mediaSrc} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 z-10" />
                    )
                  ) : (
                    <div className="text-slate-600 group-hover:text-accent group-hover:scale-110 transition-all duration-700 z-10">
                      {project.mediaType === 'video' ? <FiVideo className="text-5xl md:text-6xl mx-auto mb-4" /> : <FiImage className="text-5xl md:text-6xl mx-auto mb-4" />}
                      <span className="text-xs font-mono tracking-widest uppercase">Sem Mídia</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-colors duration-500 z-20 flex items-center justify-center">
                    <span className="bg-black/60 text-white px-4 py-2 rounded-full font-mono text-xs uppercase opacity-0 group-hover/video:opacity-100 backdrop-blur-sm transition-opacity duration-300">
                      Clique para Ampliar
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3 group-hover:text-accent transition-colors duration-300">{project.title}</h4>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{project.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.split(',').map((t, i) => (
                      <span key={i} className="text-[10px] md:text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-1 md:px-3 md:py-1 rounded-full uppercase text-center break-words">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Expertise */}
        <section id="trajetória" className="py-24 md:py-40 px-6 max-w-[90rem] mx-auto relative z-10 border-t border-white/5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-20 md:mb-32 border-b border-white/10 pb-10">
            <h2 className="text-accent font-mono tracking-widest uppercase mb-3 text-sm">Carreira</h2>
            <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Expertise.</h3>
          </motion.div>

          <div className="mb-20 md:mb-32">
            <motion.h4 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-slate-400 font-mono tracking-widest uppercase text-xs md:text-sm mb-10 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-slate-700"></span> Base & Stack
            </motion.h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { title: "Graduação - Análise e Desenvolvimento de Software", desc: "Formação ensino superior Fatec itaquera", color: "accent", icon: FiCode },
                { title: " Programador Multiplataforma Mobile", desc: "C, Java, Kotlin", color: "purple-400", icon: FiLayout },
                { title: "Bootcamp Generation", desc: "Imersão hardcore em JS e metodologias ágeis de mercado.", color: "green-400", icon: FiTerminal }
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-[#0f172a]/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 flex flex-col items-start shadow-xl group cursor-pointer md:cursor-none hover:border-slate-600 transition-colors">
                  <div className={`w-14 h-14 bg-${item.color}/10 text-${item.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner`}><item.icon /></div>
                  <h4 className="text-2xl font-bold text-white mb-4 tracking-tight leading-tight group-hover:text-white transition-colors">{item.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <motion.h4 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-slate-400 font-mono tracking-widest uppercase text-xs md:text-sm mb-10 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-slate-700"></span> Licenças & Certificações
            </motion.h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {certificacoes.map((cert, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="p-6 bg-[#0f172a]/50 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col gap-4 group hover:border-accent/50 transition-colors duration-500 cursor-pointer md:cursor-none h-full shadow-lg">
                  <div className="text-3xl text-slate-600 group-hover:text-accent transition-colors duration-500"><cert.icon /></div>
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <h5 className="text-lg font-bold text-white group-hover:text-white transition-colors duration-500 mb-2 leading-snug">{cert.title}</h5>
                      <p className="text-slate-400 text-xs mb-4">{cert.org}</p>
                    </div>
                    <p className="text-accent/80 font-mono text-[10px] uppercase bg-accent/10 w-max px-2 py-1 rounded-md">{cert.info}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contato" className="py-24 md:py-32 px-6 bg-[#0f172a]/50 border-t border-slate-800 backdrop-blur-xl text-center cursor-pointer md:cursor-none group">
          <h2 className="text-5xl md:text-[7rem] font-black tracking-tighter text-white mb-10 md:mb-16">Vamos Criar?</h2>
          <div className="flex justify-center gap-10 md:gap-16 text-3xl md:text-4xl text-slate-500">
            <a href="https://github.com/Healer101015" target="_blank" rel="noopener noreferrer" className="hover:scale-125 hover:text-accent transition-all"><FiGithub /></a>
            <a href="https://www.linkedin.com/in/jo%C3%A3o-henrique-brito-b583b61a2/" target="_blank" rel="noopener noreferrer" className="hover:scale-125 hover:text-accent transition-all"><FiLinkedin /></a>

            {/* FIX: Link do Currículo no Footer também atualizado */}
            <a href={CurriculoPDF} download="JoaoBrito.pdf" className="hover:scale-125 hover:text-accent transition-all"><FiDownload /></a>
          </div>
          <p className="mt-16 text-xs font-mono text-slate-600">© {new Date().getFullYear()} João Henrique. Programador Java.</p>
        </footer>

      </div>
    </>
  );
}

export default App;