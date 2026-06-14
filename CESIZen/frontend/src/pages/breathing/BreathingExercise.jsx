import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const PHASES = ['inhale', 'hold', 'exhale'];
const PHASE_LABEL = { inhale: 'Inspirez', hold: 'Retenez', exhale: 'Expirez' };
const PHASE_COLOR = {
  inhale: 'from-blue-200 to-sage-300',
  hold:   'from-sage-200 to-sage-400',
  exhale: 'from-purple-200 to-sage-300',
};
const PHASE_TEXT = {
  inhale: 'Inspirez lentement par le nez…',
  hold:   'Retenez doucement…',
  exhale: 'Expirez lentement par la bouche…',
};

const getPhaseDuration = (phaseIdx, ex) => {
  const key = PHASES[phaseIdx];
  if (key === 'inhale') return ex.inhale_duration;
  if (key === 'hold')   return ex.hold_duration;
  return ex.exhale_duration;
};

// Returns scale factor for the breathing circle based on phase progress
const getCircleScale = (phaseName, progress) => {
  if (phaseName === 'inhale') return 1 + (progress / 100) * 0.5;   // 1 → 1.5
  if (phaseName === 'hold')   return 1.5;                           // fixed at max
  if (phaseName === 'exhale') return 1.5 - (progress / 100) * 0.5; // 1.5 → 1
  return 1;
};

export default function BreathingExercise() {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading]   = useState(true);

  const [running, setRunning]         = useState(false);
  const [phase, setPhase]             = useState(0);
  const [countdown, setCountdown]     = useState(0);
  const [cycles, setCycles]           = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [finished, setFinished]       = useState(false);

  const intervalRef = useRef(null);
  // sessionRef tracks mutable timer state inside the interval to avoid stale closures
  const sessionRef = useRef({ phase: 0, countdown: 0, cycles: 0 });

  useEffect(() => {
    api.get(`/breathing/${id}`)
      .then(r => {
        setExercise(r.data.exercise);
        setCountdown(r.data.exercise.inhale_duration);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => clearInterval(intervalRef.current);
  }, [id]);

  const startExercise = (ex, total) => {
    clearInterval(intervalRef.current);
    setFinished(false);
    setRunning(true);

    const s = sessionRef.current;
    s.phase     = 0;
    s.cycles    = 0;
    s.countdown = ex.inhale_duration;

    setPhase(0);
    setCycles(0);
    setCountdown(ex.inhale_duration);

    intervalRef.current = setInterval(() => {
      s.countdown -= 1;

      if (s.countdown > 0) {
        setCountdown(s.countdown);
        return;
      }

      // Phase transition
      let next = (s.phase + 1) % 3;
      if (next === 1 && ex.hold_duration === 0) next = 2; // skip hold if 0s

      if (next === 0) {
        s.cycles += 1;
        setCycles(s.cycles);
        if (s.cycles >= total) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setFinished(true);
          return;
        }
      }

      s.phase     = next;
      s.countdown = getPhaseDuration(next, ex);
      setPhase(s.phase);
      setCountdown(s.countdown);
    }, 1000);
  };

  const stopExercise = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setFinished(false);
    const s = sessionRef.current;
    s.phase = 0;
    s.cycles = 0;
    s.countdown = exercise?.inhale_duration || 0;
    setPhase(0);
    setCycles(0);
    setCountdown(exercise?.inhale_duration || 0);
  };

  const phaseName    = PHASES[phase];
  const phaseDuration = exercise ? getPhaseDuration(phase, exercise) : 1;
  const progress      = phaseDuration > 0 ? ((phaseDuration - countdown) / phaseDuration) * 100 : 0;
  const circleScale   = running ? getCircleScale(phaseName, progress) : 1;

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center text-muted">Chargement…</div>
  );

  if (!exercise) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-muted mb-4">Exercice introuvable.</p>
      <Link to="/respiration" className="btn-secondary">← Retour</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link to="/respiration" className="hover:text-sage-500 transition-colors">Respiration</Link>
        <span>/</span>
        <span className="text-gray-700">{exercise.name}</span>
      </nav>

      <div className="card text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{exercise.name}</h1>
        <p className="text-muted text-sm mb-6">{exercise.description}</p>

        {/* Cycle selector */}
        {!running && !finished && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-sm text-muted">Nombre de cycles :</span>
            {[3, 5, 10, 15].map(n => (
              <button
                key={n}
                onClick={() => setTotalCycles(n)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                  totalCycles === n ? 'bg-sage-400 text-white' : 'bg-sage-50 text-sage-600 hover:bg-sage-100'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {/* Breathing circle */}
        <div className="flex items-center justify-center my-8">
          <div className="relative flex items-center justify-center">
            {/* Outer glow ring */}
            <div
              className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-sage-200 opacity-20"
              style={{
                transform: `scale(${circleScale})`,
                transition: 'transform 1s ease-in-out',
              }}
            />
            {/* Main circle */}
            <div
              className={`w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br ${
                running ? PHASE_COLOR[phaseName] : 'from-sage-100 to-sage-200'
              } flex items-center justify-center shadow-lg`}
              style={{
                transform: `scale(${circleScale})`,
                transition: 'transform 1s ease-in-out',
                opacity: running ? 1 : 0.6,
              }}
            >
              <div className="text-center">
                {running ? (
                  <>
                    <div className="text-4xl sm:text-5xl font-bold text-white drop-shadow-md">{countdown}</div>
                    <div className="text-white text-sm font-semibold drop-shadow mt-1">
                      {PHASE_LABEL[phaseName]}
                    </div>
                  </>
                ) : finished ? (
                  <div className="text-white text-2xl drop-shadow">🎉</div>
                ) : (
                  <div className="text-sage-600 text-sm font-medium">Prêt</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Phase hint */}
        {running && (
          <p className="text-muted text-sm mb-4 italic">{PHASE_TEXT[phaseName]}</p>
        )}

        {/* Progress dots */}
        {(running || finished) && (
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: totalCycles }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i < cycles ? 'bg-sage-400 scale-110' : 'bg-sage-100'
                }`}
              />
            ))}
          </div>
        )}

        {/* Finished message */}
        {finished && (
          <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 mb-6">
            <p className="text-sage-700 font-semibold">Excellent ! 🌿</p>
            <p className="text-sage-600 text-sm mt-1">
              Vous avez complété {cycles} cycle{cycles > 1 ? 's' : ''} de cohérence cardiaque.
              Prenez un moment pour observer votre calme intérieur.
            </p>
          </div>
        )}

        {/* Phase legend */}
        <div className="flex justify-center gap-4 mb-6 text-sm flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-300" />
            <span className="text-muted">Inspiration {exercise.inhale_duration}s</span>
          </div>
          {exercise.hold_duration > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-sage-300" />
              <span className="text-muted">Apnée {exercise.hold_duration}s</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-purple-300" />
            <span className="text-muted">Expiration {exercise.exhale_duration}s</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 flex-wrap">
          {!running ? (
            <button
              onClick={() => startExercise(exercise, totalCycles)}
              className="btn-primary px-10 py-3 text-base"
            >
              {finished ? '↺ Recommencer' : '▶ Démarrer'}
            </button>
          ) : (
            <button onClick={stopExercise} className="btn-secondary px-10 py-3 text-base">
              ⏹ Arrêter
            </button>
          )}
          <Link to="/respiration" className="btn-secondary py-3">
            ← Choisir un autre exercice
          </Link>
        </div>
      </div>
    </div>
  );
}
