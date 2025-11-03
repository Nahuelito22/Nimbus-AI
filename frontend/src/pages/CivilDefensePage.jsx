import React, { useState, useEffect } from 'react';
import AlertPanel from '../components/civil_defense/AlertPanel';
import RiskMap from '../components/civil_defense/RiskMap';
import QuickReportGenerator from '../components/civil_defense/QuickReportGenerator';
import { useAuth } from '../context/AuthContext'; // Asegúrate que la ruta sea correcta

const CivilDefensePage = () => {
  const [alerts, setAlerts] = useState([]);
  const [riskZones, setRiskZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        setError("No estás autenticado.");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/civil-defense/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setAlerts(data.alerts || []);
        setRiskZones(data.risk_zones || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener los datos de Defensa Civil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Portal de Comando de Defensa Civil
      </h1>
      
      {loading && <p className="text-center">Cargando datos...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <AlertPanel alerts={alerts} />
            <QuickReportGenerator />
          </div>
          
          <div className="lg:col-span-2">
            <RiskMap riskZones={riskZones} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CivilDefensePage;
