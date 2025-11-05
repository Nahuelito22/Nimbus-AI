import React from 'react';

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        </div>
    </div>
);

const SiteStats = ({ users }) => {
    if (!users || users.length === 0) {
        return null; // No renderizar nada si no hay usuarios
    }

    const totalUsers = users.length;
    const roles = ['user', 'admin', 'superadmin', 'defensa_civil', 'meteorologo', 'cientifico_datos'];
    const usersByRole = roles.reduce((acc, role) => {
        acc[role] = users.filter(u => u.role === role).length;
        return acc;
    }, {});

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Estadísticas del Sitio</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <StatCard title="Usuarios Totales" value={totalUsers} />
                {roles.map(role => (
                    usersByRole[role] > 0 && (
                        <StatCard 
                            key={role} 
                            title={`Rol: ${role.replace('_', ' ')}`}
                            value={usersByRole[role]} 
                        />
                    )
                ))}
            </div>
        </div>
    );
};

export default SiteStats;
