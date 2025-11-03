import React, { useState, useEffect, useMemo } from 'react';
import AlertPanel from '../components/civil_defense/AlertPanel';
import RiskMap from '../components/civil_defense/RiskMap';
import QuickReportGenerator from '../components/civil_defense/QuickReportGenerator';
import ManualAlertForm from '../components/civil_defense/ManualAlertForm';
import { useAuth } from '../context/AuthContext';

const CivilDefensePage = () => {
  // Estado para datos de la API
  const [apiAlerts, setApiAlerts] = useState([]);
  const [apiRiskZones, setApiRiskZones] = useState([]);
  
  // Estado para datos creados manualmente
  const [manualAlerts, setManualAlerts] = useState([]);
  const [manualZones, setManualZones] = useState([]);

  // Estado para el flujo de creación manual
  const [newZone, setNewZone] = useState(null); // Almacena coordenadas de la zona dibujada
  const [drawKey, setDrawKey] = useState(0); // Key para forzar el reseteo del componente de dibujo

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
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setApiAlerts(data.alerts || []);
        setApiRiskZones(data.risk_zones || []);
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

  // Combina alertas de la API y manuales
  const combinedAlerts = useMemo(() => [...apiAlerts, ...manualAlerts].sort((a, b) => (b.id.toString().startsWith('manual') ? 1 : 0) - (a.id.toString().startsWith('manual') ? 1 : 0) || b.id - a.id), [apiAlerts, manualAlerts]);
  const combinedRiskZones = useMemo(() => [...apiRiskZones, ...manualZones], [apiRiskZones, manualZones]);

  const highestAlert = useMemo(() => {
    if (!combinedAlerts || combinedAlerts.length === 0) return null;
    const alertsWithProb = combinedAlerts.filter(a => a.probability !== null);
    if (alertsWithProb.length === 0) return null;
    return alertsWithProb.sort((a, b) => b.probability - a.probability)[0];
  }, [combinedAlerts]);

  const handleManualZoneDrawn = (coordinates) => {
    setNewZone({ bounds: coordinates });
  };

  const handleCreateManualAlert = ({ title, color }) => {
    const newManualAlert = {
      id: `manual-${Date.now()}`,
      title: title,
      region: 'Zona Manual',
      probability: null,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      color: color,
      isManual: true
    };
    const newManualZone = {
      name: title,
      color: color,
      bounds: newZone.bounds,
      isManual: true
    };
    setManualAlerts(prev => [newManualAlert, ...prev]);
    setManualZones(prev => [newManualZone, ...prev]);
    setNewZone(null);
    setDrawKey(prev => prev + 1);
  };

  const handleCancelManualAlert = () => {
    setNewZone(null);
    setDrawKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {newZone && (
        <ManualAlertForm 
          onSubmit={handleCreateManualAlert} 
          onCancel={handleCancelManualAlert} 
        />
      )}

      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Portal de Comando de Defensa Civil
      </h1>
      
      {loading && <p className="text-center">Cargando datos automáticos...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <AlertPanel alerts={combinedAlerts} />
          <QuickReportGenerator highestAlert={highestAlert} />
        </div>
        
        <div className="lg:col-span-2">
          <RiskMap 
            riskZones={combinedRiskZones} 
            onManualZoneDrawn={handleManualZoneDrawn} 
            drawKey={drawKey}
          />
        </div>
      </div>
    </div>
  );
};

export default CivilDefensePage;

