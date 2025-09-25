import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './router/AppRoutes';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;

