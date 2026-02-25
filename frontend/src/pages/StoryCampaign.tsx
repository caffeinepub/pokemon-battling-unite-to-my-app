import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { STORY_ARCS, OPPONENT_POKEMON } from '../data/pokemonData';
import { ArrowLeft, ChevronRight, Lock, CheckCircle, Play } from 'lucide-react';

export default function StoryCampaign() {
  const navigate = useNavigate();
  const [selectedArc, setSelectedArc] = useState<string | null>(null);
  const [showCinematic, setShowCinematic] = useState(false);
  const [cinematicArc, setCinematicArc] = useState<(typeof STORY_ARCS)[0] | null>(null);

  const getCompleted = (arcId: string): number[] => {
    try {
      const s = sessionStorage.getItem(`arc_${arcId}`);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  };

  const markCompleted = (arcId: string, episodeId: number) => {
    const completed = getCompleted(arcId);
    if (!completed.includes(episodeId)) {
      sessionStorage.setItem(`arc_${arcId}`, JSON.stringify([...completed, episodeId]));
    }
  };

  const handleStartEpisode = (arc: (typeof STORY_ARCS)[0], episodeIdx: number) => {
    const episode = arc.episodes[episodeIdx];
    const isLastEpisode = episodeIdx === arc.episodes.length - 1;

    if (isLastEpisode) {
      setCinematicArc(arc);
      setShowCinematic(true);
      return;
    }

    const opponentIdx = episodeIdx % OPPONENT_POKEMON.length;
    markCompleted(arc.id, episode.id);
    navigate({
      to: '/battle',
      search: {
        opponentId: String(opponentIdx),
        bgType: arc.id === 'johto' ? 'forest' : arc.id === 'master' ? 'stadium' : 'gym',
      },
    });
  };

  const arc = selectedArc ? STORY_ARCS.find((a) => a.id === selectedArc) : null;

  if (showCinematic && cinematicArc) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1A0A0A 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute star-twinkle text-yellow-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              ✦
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-lg mx-4 fade-in-up">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="font-anime text-4xl text-electric-yellow mb-2 tracking-wide">
            THE FINAL BATTLE!
          </h1>
          <p className="text-white text-xl mb-2">{cinematicArc.name}</p>
          <div className="bg-black/60 border-2 border-electric-yellow/50 rounded-2xl p-6 mb-6">
            <p className="text-white/80 text-lg leading-relaxed">
              This is it, Ash! The moment you've been training for your whole life!
              The World Championship Final is here. Everything comes down to this battle!
            </p>
            <p className="text-electric-yellow font-bold text-xl mt-4">
              "I choose you, Pikachu!"
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setShowCinematic(false);
                navigate({
                  to: '/battle',
                  search: { opponentId: '7', bgType: 'stadium' },
                });
              }}
              className="bg-electric-yellow text-dark-navy font-anime text-xl px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all hover:scale-105 anime-btn"
            >
              ⚡ BATTLE NOW!
            </button>
            <button
              onClick={() => setShowCinematic(false)}
              className="bg-white/10 text-white font-anime text-xl px-6 py-4 rounded-xl hover:bg-white/20 transition-colors"
            >
              BACK
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (arc) {
    const completed = getCompleted(arc.id);
    return (
      <div
        className="min-h-screen"
        style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #1A1A2E 100%)' }}
      >
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button
            onClick={() => setSelectedArc(null)}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Story</span>
          </button>

          <div
            className="rounded-2xl p-4 mb-6 border-2"
            style={{ background: arc.color + '22', borderColor: arc.color + '66' }}
          >
            <h1 className="font-anime text-3xl text-white mb-1">{arc.name}</h1>
            <p className="text-white/60 text-sm">{arc.subtitle}</p>
            <p className="text-white/80 text-sm mt-2">{arc.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(completed.length / arc.episodes.length) * 100}%`,
                    background: arc.color,
                  }}
                />
              </div>
              <span className="text-white/60 text-xs font-bold">
                {completed.length}/{arc.episodes.length}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {arc.episodes.map((episode, idx) => {
              const isCompleted = completed.includes(episode.id);
              const isLocked = idx > 0 && !completed.includes(arc.episodes[idx - 1].id);
              const isLast = idx === arc.episodes.length - 1;

              return (
                <div
                  key={episode.id}
                  className={`anime-card p-4 flex items-center gap-4 transition-all ${
                    isLocked ? 'opacity-50' : 'hover:border-white/40'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                    style={{ background: isCompleted ? arc.color + '44' : '#ffffff11' }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-white/30" />
                    ) : isLast ? (
                      '🏆'
                    ) : (
                      <span className="text-white/60 font-bold text-sm">{idx + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate">{episode.title}</h3>
                    <p className="text-white/50 text-xs mt-0.5">{episode.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/40 text-xs">vs.</span>
                      <span className="text-white/60 text-xs font-bold">{episode.opponent}</span>
                    </div>
                  </div>

                  {!isLocked && (
                    <button
                      onClick={() => handleStartEpisode(arc, idx)}
                      className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: isLast ? '#FFD700' : arc.color + '44',
                        color: isLast ? '#0D1B2A' : 'white',
                        border: `1px solid ${arc.color}66`,
                      }}
                    >
                      <Play className="w-3 h-3" />
                      {isCompleted ? 'REPLAY' : isLast ? 'FINALE!' : 'BATTLE'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #0D1B2A 0%, #1A1A2E 100%)' }}
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate({ to: '/game' })}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-anime text-3xl text-electric-yellow tracking-wide">STORY MODE</h1>
        </div>

        <p className="text-white/60 text-sm mb-6">
          Follow Ash's journey across three epic story arcs!
        </p>

        <div className="space-y-4">
          {STORY_ARCS.map((storyArc, idx) => {
            const completed = getCompleted(storyArc.id);
            const isLocked =
              idx > 0 &&
              getCompleted(STORY_ARCS[idx - 1].id).length < STORY_ARCS[idx - 1].episodes.length;

            return (
              <button
                key={storyArc.id}
                onClick={() => !isLocked && setSelectedArc(storyArc.id)}
                disabled={isLocked}
                className={`w-full anime-card p-5 text-left transition-all ${
                  isLocked
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-white/40 hover:scale-[1.02] active:scale-[0.99]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-bold text-white"
                        style={{ background: storyArc.color + '88' }}
                      >
                        {storyArc.subtitle}
                      </span>
                      {isLocked && <Lock className="w-4 h-4 text-white/40" />}
                    </div>
                    <h2 className="font-anime text-2xl text-white mb-1">{storyArc.name}</h2>
                    <p className="text-white/60 text-sm">{storyArc.description}</p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(completed.length / storyArc.episodes.length) * 100}%`,
                            background: storyArc.color,
                          }}
                        />
                      </div>
                      <span className="text-white/50 text-xs font-bold whitespace-nowrap">
                        {completed.length}/{storyArc.episodes.length} episodes
                      </span>
                    </div>
                  </div>

                  {!isLocked && (
                    <ChevronRight className="w-6 h-6 text-white/40 shrink-0 mt-2" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Ash image */}
        <div className="flex justify-center mt-8">
          <img
            src="/assets/generated/ash-trainer.dim_300x400.png"
            alt="Ash"
            className="w-32 h-44 object-contain opacity-60 pokemon-idle"
          />
        </div>
      </div>
    </div>
  );
}
