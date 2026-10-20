"use client";

import { useEffect, useMemo, useState } from "react";
import { chapters } from "@/lib/content";
import { loadProgress, saveProgress } from "@/lib/storage";
import type { ProgressState } from "@/types/content";

const navigation = [
  ["⌂", "Tableau de bord"],
  ["◇", "Apprendre"],
  ["✦", "Pratiquer"],
  ["▣", "Cartes éclair"],
  ["◷", "Examens"],
  ["↗", "Progression"]
];

export function Dashboard() {
  const [progress, setProgress] = useState<ProgressState>({ completedLessons: [], xp: 0, streak: 0 });
  const [activeNav, setActiveNav] = useState("Tableau de bord");

  useEffect(() => setProgress(loadProgress()), []);

  const totalLessons = useMemo(() => chapters.reduce((total, chapter) => total + chapter.lessons.length, 0), []);
  const completed = progress.completedLessons.length;
  const completionPercent = Math.round((completed / totalLessons) * 100);
  const nextLesson = chapters.flatMap((chapter) => chapter.lessons).find((lesson) => !progress.completedLessons.includes(lesson.id));

  function completeNextLesson() {
    if (!nextLesson) return;
    const next: ProgressState = {
      completedLessons: [...progress.completedLessons, nextLesson.id],
      xp: progress.xp + 20,
      streak: Math.max(progress.streak, 1),
      lastActivityDate: new Date().toISOString().slice(0, 10)
    };
    setProgress(next);
    saveProgress(next);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">o</span><span>orthly</span></div>
        <p className="sidebar-label">TON ESPACE</p>
        <nav className="nav-list" aria-label="Navigation principale">
          {navigation.map(([icon, label]) => (
            <button className={`nav-item ${activeNav === label ? "active" : ""}`} key={label} onClick={() => setActiveNav(label)}>
              <span className="nav-icon">{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="mini-profile"><span className="avatar">ML</span><span><strong>Mon profil</strong><small>Objectif TFLM</small></span><span className="chevron">›</span></div>
          <p className="offline-note">● Progression sauvegardée sur cet appareil</p>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><p className="eyebrow">MARDI 20 OCTOBRE</p><h1>Bonjour, prêt à progresser?</h1></div>
          <div className="top-actions"><button className="icon-button" aria-label="Notifications">♢</button><span className="avatar">ML</span></div>
        </header>

        <div className="dashboard-grid">
          <section className="main-column">
            <div className="hero-card">
              <div><p className="eyebrow light">TON PROCHAIN PAS</p><h2>{nextLesson ? "Continue ton apprentissage" : "Parcours terminé!"}</h2><p>{nextLesson ? `Reprends avec « ${nextLesson.title} » et garde ton élan.` : "Bravo, tu as parcouru toutes les leçons disponibles."}</p><button className="primary-button" onClick={completeNextLesson}>{nextLesson ? "Commencer la leçon" : "Revoir mes notions"} <span>→</span></button></div>
              <div className="hero-orbit"><span>✦</span><strong>{completionPercent}%</strong><small>parcours</small></div>
            </div>

            <div className="section-heading"><div><p className="eyebrow">TON PARCOURS</p><h2>Apprendre le français</h2></div><button className="text-button" onClick={() => setActiveNav("Apprendre")}>Voir tout <span>→</span></button></div>
            <div className="learning-path">
              {chapters.map((chapter) => {
                const chapterCompleted = chapter.lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
                const isCurrent = chapter.lessons.some((lesson) => lesson.id === nextLesson?.id);
                return <article className={`chapter-row ${isCurrent ? "current" : ""}`} key={chapter.id}>
                  <div className="chapter-number" style={{ backgroundColor: chapter.color }}>{String(chapter.number).padStart(2, "0")}</div>
                  <div className="chapter-copy"><span className="chapter-kicker">CHAPITRE {chapter.number}</span><h3>{chapter.title}</h3><p>{chapter.description}</p><div className="progress-line"><span style={{ width: `${(chapterCompleted / chapter.lessons.length) * 100}%`, backgroundColor: chapter.color }} /></div><small>{chapterCompleted} / {chapter.lessons.length} étapes</small></div>
                  <div className="chapter-action">{isCurrent ? <button className="small-button" onClick={completeNextLesson}>Continuer</button> : <span className={chapterCompleted === chapter.lessons.length ? "check" : "chapter-arrow"}>{chapterCompleted === chapter.lessons.length ? "✓" : "→"}</span>}</div>
                </article>;
              })}
            </div>
          </section>

          <aside className="right-column">
            <div className="stats-card"><div className="card-heading"><h3>Cette semaine</h3><span className="trend">+12%</span></div><div className="weekly-chart">{[35, 55, 42, 78, 62, 88, 48].map((height, index) => <div className="chart-day" key={index}><div className="bar-wrap"><span className={index === 5 ? "bar highlight" : "bar"} style={{ height: `${height}%` }} /></div><small>{["L", "M", "M", "J", "V", "S", "D"][index]}</small></div>)}</div><p className="muted">4 jours actifs · 86 XP gagnés</p></div>
            <div className="goal-card"><div className="card-heading"><h3>Objectif du jour</h3><span className="fire">✦</span></div><div className="goal-progress"><div className="goal-ring"><strong>{Math.min(completed, 3)}</strong><span>/ 3</span></div><div><strong>Garde ton rythme!</strong><p>Une petite session suffit pour avancer.</p></div></div><button className="outline-button" onClick={completeNextLesson}>Faire une session <span>→</span></button></div>
            <div className="review-card"><div className="card-heading"><h3>À revoir aujourd’hui</h3><span className="review-count">8</span></div><div className="review-topic"><span className="topic-icon purple">Aa</span><div><strong>Les accords</strong><small>4 cartes · 5 min</small></div><span>→</span></div><div className="review-topic"><span className="topic-icon blue">?</span><div><strong>Les homophones</strong><small>4 cartes · 5 min</small></div><span>→</span></div></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
