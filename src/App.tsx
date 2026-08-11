import { useEffect } from 'react';
import { useHash } from './hooks/useHash';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Programs } from './pages/Programs';
import { Academy } from './pages/Academy';
import { Gallery } from './pages/Gallery';
import { Events } from './pages/Events';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { Donate } from './pages/Donate';
import { AdminLayout } from './pages/AdminLayout';

function App() {
  const hash = useHash();

  // Scroll to top on hash route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [hash]);

  const normalizedHash = hash.split('?')[0];
  const isAdminRoute = normalizedHash.startsWith('#/admin');

  // Routing Controller
  const renderRoute = () => {
    if (normalizedHash === '#/' || normalizedHash === '#/home' || !normalizedHash) {
      return <Home />;
    }

    if (normalizedHash.startsWith('#/about/')) {
      const sub = normalizedHash.replace('#/about/', '');
      return <About sub={sub} />;
    }

    if (normalizedHash.startsWith('#/programs/')) {
      const sub = normalizedHash.replace('#/programs/', '');
      return <Programs sub={sub} />;
    }

    if (normalizedHash.startsWith('#/academy/')) {
      const sub = normalizedHash.replace('#/academy/', '');
      return <Academy sub={sub} />;
    }

    if (normalizedHash.startsWith('#/gallery/')) {
      const sub = normalizedHash.replace('#/gallery/', '');
      return <Gallery activeTag={sub} />;
    }

    if (normalizedHash.startsWith('#/events/')) {
      const sub = normalizedHash.replace('#/events/', '');
      return <Events sub={sub} />;
    }

    if (normalizedHash.startsWith('#/blog/')) {
      const sub = normalizedHash.replace('#/blog/', '');
      return <Blog category={sub} />;
    }

    if (normalizedHash === '#/contact') {
      return <Contact />;
    }

    if (normalizedHash === '#/donate') {
      return <Donate />;
    }

    // Default Fallback
    return <Home />;
  };

  if (isAdminRoute) {
    return <AdminLayout />;
  }

  return (
    <div className="flex flex-col min-h-screen font-main bg-white">
      {/* Header Utilities + Navigation */}
      <Header />

      {/* Main Single Page View Container */}
      <main id="app" className="flex-1 bg-white">
        {renderRoute()}
      </main>

      {/* Footer Block */}
      <Footer />
    </div>
  );
}

export default App;
