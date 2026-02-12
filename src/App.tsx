import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RoundCoding from './pages/RoundCoding';
import RoundReact from './pages/RoundReact';
import Round3Java from './pages/Round3Java';
import Round2Selection from './pages/Round2Selection';
import Leaderboard from './pages/Leaderboard';
import BootScreen from './components/BootScreen';
import StatusScreen from './components/StatusScreen';
import AdminPanel from './components/AdminPanel';
import CheatScreen from './components/CheatScreen';

const App: React.FC = () => {
  const { phase, competitionStatus, round2Mode, cheated } = useGameStore();

  // Sync with Supabase removed. Using LocalStorage only.
  // useSupabaseSync();
  const [booted, setBooted] = React.useState(false);
  const [showAdmin, setShowAdmin] = React.useState(false);



  // Admin Shortcut: Ctrl + Shift + X
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;

  if (cheated) return <CheatScreen />;

  // 1. ALWAYS show Login first if phase is 'login'
  if (phase === 'login') {
    return (
      <>
        <Login />
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </>
    );
  }

  // 2. THEN check Status Override (Waiting, Eliminated, Promoted)
  if (competitionStatus !== 'playing') {
    return (
      <Layout>
        <StatusScreen />
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </Layout>
    );
  }

  // Provide smooth page transitions
  const variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  };

  const renderPhase = () => {
    switch (phase) {

      case 'dashboard': return <Dashboard />;
      case 'coding': return <RoundCoding />;
      case 'react': // This is now "Round 2" Container
        if (!round2Mode) return <Round2Selection />;
        if (round2Mode === 'java') return <Round3Java />; // Swapped back
        return <RoundReact />; // Swapped back
      case 'leaderboard': return <Leaderboard />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout>
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="w-full h-full flex items-center justify-center relative z-10"
        >
          {renderPhase()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default App;
