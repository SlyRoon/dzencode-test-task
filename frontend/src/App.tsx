import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './layouts/Layout';
import OrdersPage from './pages/OrdersPage';
import StubPage from './pages/StubPage';
import NotFoundPage from './pages/NotFoundPage';

// Анимация перехода между роутами (требование ТЗ — transitions)
const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.28, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Layout />}>
          <Route index element={<Navigate to='/income' replace />} />
          {/* ПРИХОД -> список приходов */}
          <Route path='income' element={<PageTransition><OrdersPage /></PageTransition>} />
          {/* Alias from the task wording: Orders & Products */}
          <Route path='orders' element={<PageTransition><OrdersPage /></PageTransition>} />
          {/* ГРУППЫ -> приходы (split-вид: список приходов + продукты выбранного) */}
          <Route path='groups' element={<PageTransition><OrdersPage /></PageTransition>} />
          <Route path='products' element={<Navigate to='/income' replace />} />
          <Route path='users' element={<PageTransition><StubPage titleKey='nav.users' /></PageTransition>} />
          <Route path='settings' element={<PageTransition><StubPage titleKey='nav.settings' /></PageTransition>} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
