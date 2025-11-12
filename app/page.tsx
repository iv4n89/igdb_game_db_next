import ConsoleGrid from "./components/ConsoleGrid";
import { RETRO_CONSOLES } from "./lib/consoles";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black">
      <header className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text bg-linear-to-r from-purple-400 via-pink-500 to-red-500">
            Retro Games Explorer
          </h1>
          <p className="text-xl text-gray-400">
            Explora la historia de los videojuegos retro
          </p>
        </div>
      </header>

      <ConsoleGrid consoles={RETRO_CONSOLES} />
    </main>
  );
}
