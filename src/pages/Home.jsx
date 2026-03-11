import { useState, useEffect } from "react";
import { siteConfig } from "../siteConfig";
import ProjectCard from "../components/ProjectCard";
import projectData from "../data/projectdata.json";

export default function Home() {
  const projects = projectData.projects;
  const [gameActive, setGameActive] = useState(false);
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 10, y: 8 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gridSize = 15;
  const cellSize = 100 / gridSize;

  // Game loop
  useEffect(() => {
    if (!gameActive || gameOver) return;

    const moveSnake = () => {
      setSnake(prev => {
        const newHead = {
          x: (prev[0].x + direction.x + gridSize) % gridSize,
          y: (prev[0].y + direction.y + gridSize) % gridSize
        };

        // Check collision with self
        const hitSelf = prev.some(segment => segment.x === newHead.x && segment.y === newHead.y);
        if (hitSelf) {
          setGameOver(true);
          setGameActive(false);
          return prev;
        }

        // Check if ate food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          setFood({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
          });
          return [newHead, ...prev];
        }

        // Normal move
        return [newHead, ...prev.slice(0, -1)];
      });
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [gameActive, direction, food, gameOver]);

  // WASD controls
  useEffect(() => {
    const handleKey = (e) => {
      if (!gameActive || gameOver) return;
      
      const key = e.key.toLowerCase();
      if (key === 'w' && direction.y === 0) setDirection({ x: 0, y: -1 });
      if (key === 's' && direction.y === 0) setDirection({ x: 0, y: 1 });
      if (key === 'a' && direction.x === 0) setDirection({ x: -1, y: 0 });
      if (key === 'd' && direction.x === 0) setDirection({ x: 1, y: 0 });
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameActive, direction, gameOver]);

  const startGame = () => {
    setGameActive(true);
    setGameOver(false);
    setSnake([{ x: 5, y: 5 }]);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setFood({ x: 10, y: 8 });
  };

  const stopGame = () => {
    setGameActive(false);
    setGameOver(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ================= BACKGROUND SYSTEM ================= */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-size-24px_24px]" />
        <div className="absolute top-1/2 left-1/2 w-900 h-900 bg-(--accent) opacity-10 blur-[300px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* ================= TOP INTERACTIVE GAME ================= */}
      <section className="relative pt-24 pb-40 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">

          {/* LEFT — SNAKE GAME */}
          <div className="relative border border-(--accent)/30 rounded-2xl p-10 backdrop-blur-xl bg-black/40">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-light text-(--text)">
                  {gameOver ? "Game Over!" : gameActive ? "Catch the dots!" : "Mini Snake"}
                </h3>
                <p className="text-sm text-(--muted) mt-1">
                  {gameOver ? `Final score: ${score}` : gameActive ? "Use WASD keys" : "Click to play"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-light text-(--accent)">{score}</div>
                <div className="text-xs text-(--muted)">score</div>
              </div>
            </div>

            {/* Game board */}
            <div className="relative aspect-square mb-6 border border-(--accent)/20 rounded-lg overflow-hidden bg-black/30">
              {/* Food */}
              <div
                className="absolute w-[6%] h-[6%] rounded-full bg-(--accent) shadow-[0_0_20px_rgba(139,0,0,0.9)] transition-all duration-100"
                style={{
                  left: `${food.x * cellSize}%`,
                  top: `${food.y * cellSize}%`,
                }}
              />

              {/* Snake */}
              {snake.map((segment, i) => (
                <div
                  key={i}
                  className={`absolute w-[6%] h-[6%] rounded-sm transition-all duration-100
                    ${i === 0 ? "bg-(--accent) scale-110" : "bg-(--accent)/60"}
                  `}
                  style={{
                    left: `${segment.x * cellSize}%`,
                    top: `${segment.y * cellSize}%`,
                    opacity: 1 - (i / snake.length) * 0.3,
                  }}
                />
              ))}

              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full grid grid-cols-15 gap-px bg-(--accent)/20" />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {!gameActive ? (
                <button
                  onClick={startGame}
                  className="flex-1 px-5 py-3 text-sm
                           border border-(--accent)/40 rounded-lg
                           hover:bg-(--accent)/20 transition text-(--text)"
                >
                  {gameOver ? "Play Again" : "Start Game"}
                </button>
              ) : (
                <button
                  onClick={stopGame}
                  className="flex-1 px-5 py-3 text-sm
                           border border-(--accent)/40 rounded-lg
                           hover:bg-(--accent)/20 transition text-(--text)"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — PROFILE */}
<div className="relative">
  <div className="absolute inset-0 bg-(--accent) opacity-20 blur-3xl rounded-full" />

  <div className="relative aspect-square border border-(--accent)/40 rounded-full overflow-hidden backdrop-blur-xl bg-black/50 grid place-items-center">

    {/* Profile image */}
    <div className="relative w-100 h-100">
      <img 
        src="https://cdn.discordapp.com/attachments/1158864724788793407/1463839413439303814/Screenshot_20260122_111428_Photos.jpg?ex=69734a30&is=6971f8b0&hm=d5417a24df6bc4c2341cf9c3a7cd2204bccc9575dbc68f172ccb821d1661ad0f&" 
        alt="Profile"
        className="w-full h-full rounded-full object-cover border-2 border-(--accent)/40 shadow-[0_0_40px_rgba(139,0,0,0.3)]"
      />
      <div className="absolute inset-0 rounded-full bg-(--accent)/10 blur-xl -z-10" />
    </div>

    {/* Simple labels */}
    <div className="absolute top-4 left-4 text-xs text-(--accent)">
      IDENTITY CORE
    </div>
    <div className="absolute bottom-4 right-4 text-xs text-(--accent)">
      ONLINE
    </div>
  </div>
</div>

        </div>
      </section>

      {/* ================= PROJECT STREAM ================= */}
      <main className="relative px-6 pb-32 max-w-6xl mx-auto">

        {/* Timeline */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-(--accent)/20" />

        <div className="space-y-32">
          {projects.map((project, index) => (
            <div key={project.id} className="relative pl-20">

              <div className="absolute left-3 top-8 w-4 h-4 rounded-full bg-(--accent) shadow-[0_0_20px_rgba(139,0,0,0.8)]" />

              <div className={`${index % 2 ? "ml-12" : ""} max-w-3xl`}>
                <ProjectCard project={project} />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ================= HUD STATUS ================= */}
      <div className="fixed bottom-6 right-6 border border-(--accent)/30 rounded-xl px-5 py-3 backdrop-blur-xl bg-black/50 text-xs text-(--muted)">
        <span className="text-(--accent)">◉</span> NEURAL LINK ACTIVE
      </div>
    </div>
  );
}