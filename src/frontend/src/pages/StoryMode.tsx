import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import NinjaSilhouette from "../components/NinjaSilhouette";
import { NINJAS, STORY_CHAPTERS, loadProgress } from "../data/ninjaData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function StoryMode() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [sceneIndex, setSceneIndex] = useState(0);

  if (!identity) {
    void navigate({ to: "/" });
    return null;
  }

  const isChapterUnlocked = (chapterIndex: number) => {
    if (chapterIndex === 0) return true;
    const prevChapter = STORY_CHAPTERS[chapterIndex - 1];
    const progress = loadProgress(prevChapter.element);
    return progress.victories >= 3;
  };

  const chapter = STORY_CHAPTERS.find((c) => c.id === activeChapter);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 20%, oklch(0.13 0.03 270 / 0.9) 0%, oklch(0.08 0.015 270) 70%)",
      }}
    >
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="jp-accent text-muted-foreground mb-1">物語</div>
          <h1
            className="text-3xl md:text-4xl font-display font-black"
            style={{ color: "oklch(0.70 0.21 38)" }}
          >
            STORY MODE
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-2">
            Four chapters. Four elements. One destiny.
          </p>
        </motion.div>

        {/* Chapter cards */}
        {!activeChapter ? (
          <div className="grid grid-cols-1 gap-4">
            {STORY_CHAPTERS.map((ch, i) => {
              const ninja = NINJAS[ch.element];
              const unlocked = isChapterUnlocked(i);
              const progress = loadProgress(ch.element);

              return (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={[
                    "rounded-2xl overflow-hidden cursor-pointer transition-all",
                    !unlocked ? "opacity-60" : "hover:scale-[1.01]",
                  ].join(" ")}
                  style={{
                    background: `linear-gradient(135deg, ${ninja.colorDark}44 0%, oklch(0.11 0.018 270) 60%)`,
                    border: `1px solid ${unlocked ? `${ninja.color}40` : "oklch(0.22 0.025 270)"}`,
                  }}
                  onClick={() => unlocked && setActiveChapter(ch.id)}
                >
                  <div className="flex items-center gap-5 p-5">
                    {/* Chapter number */}
                    <div
                      className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center font-display font-black text-2xl"
                      style={{
                        background: unlocked
                          ? `${ninja.color}22`
                          : "oklch(0.15 0.02 270)",
                        border: `2px solid ${unlocked ? ninja.color : "oklch(0.25 0.03 270)"}`,
                        color: unlocked ? ninja.color : "oklch(0.40 0.04 270)",
                      }}
                    >
                      {!unlocked ? <Lock size={18} /> : ch.number}
                    </div>

                    {/* Ninja */}
                    <div className="shrink-0">
                      <NinjaSilhouette
                        element={ch.element}
                        size={60}
                        animate={unlocked}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground font-body mb-0.5">
                        {ch.subtitle}
                      </div>
                      <div
                        className="font-display font-black text-lg"
                        style={{
                          color: unlocked
                            ? ninja.color
                            : "oklch(0.40 0.04 270)",
                        }}
                      >
                        {ch.title}
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-1 line-clamp-2">
                        {ch.description}
                      </p>

                      {!unlocked && (
                        <div className="text-[10px] text-muted-foreground mt-1 font-body">
                          Need 3 victories in previous chapter to unlock
                        </div>
                      )}

                      {unlocked && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-[10px] text-muted-foreground font-body">
                            Progress: {Math.min(progress.victories, 3)}/3
                            victories
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 3 }).map((_, j) => (
                              <div
                                key={`dot-${ch.id}-${j}`}
                                className="w-2 h-2 rounded-full"
                                style={{
                                  background:
                                    j < Math.min(progress.victories, 3)
                                      ? ninja.color
                                      : "oklch(0.25 0.03 270)",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {unlocked && (
                      <ChevronRight
                        size={18}
                        className="shrink-0 text-muted-foreground"
                      />
                    )}
                  </div>

                  {/* Final chapter indicator */}
                  {ch.isFinal && (
                    <div className="px-5 pb-3">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-body"
                        style={{
                          background: "oklch(0.78 0.17 85 / 0.15)",
                          color: "oklch(0.78 0.17 85)",
                          border: "1px solid oklch(0.78 0.17 85 / 0.3)",
                        }}
                      >
                        ★ FINAL CHAPTER
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Story cutscene reader */
          chapter && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-6"
              >
                {/* Chapter header */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: `linear-gradient(135deg, ${NINJAS[chapter.element].colorDark}44 0%, oklch(0.11 0.018 270) 70%)`,
                    border: `1px solid ${NINJAS[chapter.element].color}40`,
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <NinjaSilhouette
                      element={chapter.element}
                      size={80}
                      animate={true}
                    />
                    <div>
                      <div className="text-xs text-muted-foreground font-body">
                        {chapter.subtitle}
                      </div>
                      <h2
                        className="text-2xl font-display font-black"
                        style={{ color: NINJAS[chapter.element].color }}
                      >
                        {chapter.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm font-body text-muted-foreground leading-relaxed">
                    {chapter.description}
                  </p>
                </div>

                {/* Scene reader */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "oklch(0.10 0.018 270)",
                    border: "1px solid oklch(0.22 0.025 270)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={14} className="text-muted-foreground" />
                    <span className="text-xs font-body text-muted-foreground">
                      Scene {sceneIndex + 1} of {chapter.scenes.length}
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sceneIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-base md:text-lg font-body leading-relaxed mb-6 min-h-[4rem]"
                      style={{ color: "oklch(0.85 0.02 270)" }}
                    >
                      &ldquo;{chapter.scenes[sceneIndex]}&rdquo;
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress dots */}
                  <div className="flex gap-2 mb-4">
                    {chapter.scenes.map((scene, j) => (
                      <div
                        key={`scene-dot-${j}-${scene.slice(0, 8)}`}
                        className="w-2 h-2 rounded-full transition-all"
                        style={{
                          background:
                            j <= sceneIndex
                              ? NINJAS[chapter.element].color
                              : "oklch(0.25 0.03 270)",
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {sceneIndex < chapter.scenes.length - 1 ? (
                      <Button
                        type="button"
                        onClick={() => setSceneIndex((s) => s + 1)}
                        className="gap-2"
                        style={{
                          background: NINJAS[chapter.element].color,
                          border: "none",
                          color: "oklch(0.06 0.01 270)",
                        }}
                      >
                        Next <ChevronRight size={14} />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => void navigate({ to: "/battle" })}
                        className="gap-2 font-display font-black"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.62 0.23 30), oklch(0.70 0.21 38))",
                          border: "none",
                          color: "oklch(0.97 0.01 85)",
                        }}
                      >
                        ⚔ Battle Begins!
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setActiveChapter(null);
                        setSceneIndex(0);
                      }}
                      className="text-muted-foreground"
                    >
                      Back
                    </Button>
                  </div>
                </div>

                {/* Boss preview */}
                <div
                  className="rounded-xl p-4 flex items-center gap-4"
                  style={{
                    background: "oklch(0.12 0.02 270)",
                    border: "1px solid oklch(0.20 0.025 270)",
                  }}
                >
                  <NinjaSilhouette
                    element={chapter.isFinal ? "fire" : chapter.element}
                    size={52}
                    animate={false}
                    facing="left"
                    isRaging={chapter.isFinal}
                  />
                  <div>
                    <div className="text-xs text-muted-foreground font-body mb-0.5">
                      Chapter Boss
                    </div>
                    <div
                      className="font-display font-black"
                      style={{
                        color: chapter.isFinal
                          ? "oklch(0.78 0.17 85)"
                          : NINJAS[chapter.element].color,
                      }}
                    >
                      {chapter.bossName}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )
        )}
      </div>
    </div>
  );
}
