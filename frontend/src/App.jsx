import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './router/AppRoutes';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'red', color: 'white', padding: '10px', zIndex: 9999, fontSize: '12px', textAlign: 'center' }}>
        DEBUG_API_URL: {import.meta.env.VITE_API_URL || 'VARIABLE NOT SET'}
      </div>
      <Navbar />
      <main className="flex-grow" style={{ paddingTop: '50px' }}>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;

