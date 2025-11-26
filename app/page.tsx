import ConsoleGrid from "./components/ConsoleGrid";
import { RETRO_CONSOLES } from "./lib/consoles";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <header className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-16">
          <h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 glitch uppercase tracking-widest"
            data-text="RETRO GAMES EXPLORER"
            style={{ textShadow: "4px 4px 0px #bc13fe" }}
          >
            Retro Games Explorer
          </h1>
          <p className="text-xl md:text-2xl text-cyan-400 font-mono tracking-wider">
            INSERT COIN TO START
          </p>
          <div className="mt-4 animate-pulse text-pink-500 text-sm">
            PRESS ANY KEY
          </div>
        </div>
      </header>

      <ConsoleGrid consoles={RETRO_CONSOLES} />
    </main>
  );
}
