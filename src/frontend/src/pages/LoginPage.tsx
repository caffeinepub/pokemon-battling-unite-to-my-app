import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import NinjaSilhouette from "../components/NinjaSilhouette";
import type { ElementType } from "../data/ninjaData";
import { ELEMENT_ORDER, NINJAS } from "../data/ninjaData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetTotalPlayers, useRecordPlayerLogin } from "../hooks/useQueries";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: totalPlayers } = useGetTotalPlayers();
  const recordLogin = useRecordPlayerLogin();
  const [hoveredElement, setHoveredElement] = useState<ElementType | null>(
    null,
  );
  const [loginDone, setLoginDone] = useState(false);

  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    if (identity && !loginDone) {
      setLoginDone(true);
      recordLogin.mutate(undefined, {
        onSettled: () => {
          void navigate({ to: "/game" });
        },
      });
    }
  }, [identity, loginDone, navigate, recordLogin]);

  const handleLogin = () => {
    void login();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, oklch(0.14 0.04 270 / 0.9) 0%, oklch(0.06 0.01 270) 70%)",
      }}
    >
      {/* Atmospheric grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: [
            "linear-gradient(oklch(0.78 0.17 85) 1px, transparent 1px)",
            "linear-gradient(90deg, oklch(0.78 0.17 85) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "60px 60px",
        }}
      />

      {/* Hero image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/assets/generated/elemental-ninja-splash.dim_1200x600.jpg"
          alt="Elemental Ninja Warriors"
          className="w-full h-full object-cover opacity-20"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.06 0.01 270 / 0.4) 0%, oklch(0.06 0.01 270) 80%)",
          }}
        />
      </div>

      {/* Vertical kanji accents */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 opacity-15 pointer-events-none select-none">
        {["火", "水", "風", "土"].map((k) => (
          <span
            key={k}
            className="text-2xl font-bold"
            style={{ color: "oklch(0.78 0.17 85)" }}
          >
            {k}
          </span>
        ))}
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 opacity-15 pointer-events-none select-none">
        {["忍", "者", "道", "元"].map((k) => (
          <span
            key={k}
            className="text-2xl font-bold"
            style={{ color: "oklch(0.78 0.17 85)" }}
          >
            {k}
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 w-full max-w-3xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <div className="jp-accent text-muted-foreground mb-1 tracking-[0.4em]">
            忍者格闘ゲーム
          </div>
          <h1
            className="text-5xl md:text-7xl font-display font-black leading-none"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.17 85) 0%, oklch(0.70 0.21 38) 50%, oklch(0.62 0.23 30) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.03em",
            }}
          >
            ELEMENTAL
            <br />
            NINJA
          </h1>
          <p className="mt-3 text-muted-foreground text-sm md:text-base font-body tracking-wider">
            Master Your Element. Conquer All.
          </p>
        </motion.div>

        {/* Ninja silhouette lineup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-end justify-center gap-4 md:gap-8"
        >
          {ELEMENT_ORDER.map((el, i) => {
            const ninja = NINJAS[el];
            const isHovered = hoveredElement === el;
            return (
              <motion.div
                key={el}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 + i * 0.12,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                onHoverStart={() => setHoveredElement(el)}
                onHoverEnd={() => setHoveredElement(null)}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <motion.div
                  animate={{
                    scale: isHovered ? 1.12 : 1,
                    y: isHovered ? -8 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <NinjaSilhouette
                    element={el}
                    size={isHovered ? 88 : 72}
                    animate={true}
                    facing="right"
                  />
                </motion.div>
                <div className="text-center">
                  <div
                    className="text-xs font-display font-bold tracking-wide"
                    style={{ color: ninja.color }}
                  >
                    {ninja.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-body">
                    {ninja.element}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Login area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col items-center gap-4 w-full max-w-sm"
        >
          {/* Gold divider */}
          <div className="flex items-center gap-3 w-full">
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(0.78 0.17 85 / 0.4))",
              }}
            />
            <span className="text-xs font-body tracking-[0.3em] text-muted-foreground">
              BEGIN YOUR JOURNEY
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to left, transparent, oklch(0.78 0.17 85 / 0.4))",
              }}
            />
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn || isInitializing || loginDone}
            size="lg"
            className="w-full h-14 text-base font-display font-black tracking-wider relative overflow-hidden group"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.23 30) 0%, oklch(0.70 0.21 38) 50%, oklch(0.62 0.23 30) 100%)",
              border: "none",
              boxShadow:
                "0 0 30px oklch(0.62 0.23 30 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.15)",
              color: "oklch(0.97 0.01 85)",
            }}
          >
            {isLoggingIn || loginDone ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Entering the Realm…
              </span>
            ) : (
              <span>⚡ ENTER THE ARENA</span>
            )}
          </Button>

          <p className="text-xs text-muted-foreground font-body text-center">
            Login with Internet Identity — free, secure, no password
          </p>
        </motion.div>

        {/* Player counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: "oklch(0.11 0.018 270 / 0.8)",
            border: "1px solid oklch(0.78 0.17 85 / 0.2)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "oklch(0.78 0.17 85)",
              boxShadow: "0 0 6px oklch(0.78 0.17 85)",
            }}
          />
          <span className="text-xs font-body text-muted-foreground">
            {totalPlayers != null
              ? `${totalPlayers.toString()} ninja warriors have entered`
              : "Loading player count…"}
          </span>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-xs text-muted-foreground/50 font-body">
          {"© "}
          {new Date().getFullYear()}
          {" Elemental Ninja · Built with "}
          <span style={{ color: "#ef4444" }}>{"♥"}</span>
          {" using "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
