
import React, { useState, useEffect } from 'react';
import {
    getAllUsers,
    approveUser,
    rejectUser,
    changeUserRole,
    getLogs,
    testOpenMeteo,
    testGoesSatellite,
    suspendUser,
    unbanUser
} from '../api/admin';
import { useAuth } from '../context/AuthContext';

function AdminPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [logs, setLogs] = useState('');
    const [systemStatus, setSystemStatus] = useState({ openMeteo: null, goesSatellite: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const usersData = await getAllUsers();
            setUsers(usersData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApprove = async (userId) => {
        try {
            await approveUser(userId);
            fetchUsers(); // Refresh users after action
        } catch (err) {
            setError(err.message);
        }
    };

    const handleReject = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres rechazar esta solicitud y degradar al usuario a rol normal?')) {
            try {
                await rejectUser(userId);
                fetchUsers(); // Refresh users after action
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleSuspend = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres suspender a este usuario? No podrá iniciar sesión.')) {
            try {
                await suspendUser(userId);
                fetchUsers();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleUnban = async (userId) => {
        try {
            await unbanUser(userId);
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const openChangeRoleModal = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setIsModalOpen(true);
    };

    const handleRoleChange = async () => {
        if (!selectedUser || !selectedRole) return;
        try {
            await changeUserRole(selectedUser.id, selectedRole);
            fetchUsers(); // Refresh users after action
            setIsModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleFetchLogs = async () => {
        try {
            const logsData = await getLogs();
            setLogs(logsData.logs);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleTestOpenMeteo = async () => {
        try {
            const result = await testOpenMeteo();
            setSystemStatus(prev => ({ ...prev, openMeteo: result }));
        } catch (err) {
            setSystemStatus(prev => ({ ...prev, openMeteo: { status: 'error', message: err.message } }));
        }
    };

    const handleTestGoesSatellite = async () => {
        try {
            const result = await testGoesSatellite();
            setSystemStatus(prev => ({ ...prev, goesSatellite: result }));
        } catch (err) {
            setSystemStatus(prev => ({ ...prev, goesSatellite: { status: 'error', message: err.message } }));
        }
    };

    const renderUserStatus = (user) => {
        if (user.is_suspended) {
            return <span className="bg-red-200 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Suspendido</span>;
        }
        if (user.is_verified) {
            return <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Aprobado</span>;
        } else {
            return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Pendiente</span>;
        }
    };

    const renderUserActions = (user) => {
    // Nadie puede modificarse a sí mismo
    if (currentUser && currentUser.id === user.id) {
        return <span className="text-xs text-gray-500">No se puede modificar a sí mismo</span>;
    }

    // Un admin no puede modificar a otro admin o a un superadmin
    if ([ 'admin', 'superadmin' ].includes(user.role) && currentUser.role !== 'superadmin') {
        return <span className="text-xs text-gray-500">Solo un Superadmin puede modificar a un Admin</span>;
    }

    return (
        <>
            {/* El botón de aprobar solo aparece si el usuario no está verificado */}
            {!user.is_verified && (
                <button onClick={() => handleApprove(user.id)} className="text-green-600 hover:text-green-800 mr-2 text-sm font-semibold">Aprobar</button>
            )}

            {/* El botón de rechazar solo aparece para roles que no son ni user, ni admin, ni superadmin */}
            {![ 'user', 'admin', 'superadmin' ].includes(user.role) && (
                <button onClick={() => handleReject(user.id)} className="text-gray-600 hover:text-gray-800 mr-2 text-sm">Rechazar</button>
            )}

            {user.is_suspended ? (
                <button onClick={() => handleUnban(user.id)} className="text-green-600 hover:text-green-800 mr-2 text-sm font-semibold">Quitar Suspensión</button>
            ) : (
                <button onClick={() => handleSuspend(user.id)} className="text-red-600 hover:text-red-800 text-sm">Suspender</button>
            )}
            
            <button onClick={() => openChangeRoleModal(user)} className="text-blue-600 hover:text-blue-800 ml-2 text-sm">Editar Rol</button>
        </>
    );
};

    const filteredUsers = users.filter(user => {
        if (roleFilter === 'all') {
            return true;
        }
        return user.role === roleFilter;
    });

    return (
        <div className="p-6 bg-gray-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Panel de Administración</h2>

                {/* User Management Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Gestión de Usuarios</h3>
                        <div>
                            <label htmlFor="role-filter" className="mr-2 font-medium text-sm">Filtrar por rol:</label>
                            <select
                                id="role-filter"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-3 py-1 border rounded-md text-sm"
                            >
                                <option value="all">Todos</option>
                                <option value="user">Usuario</option>
                                <option value="admin">Administrador</option>
                                <option value="defensa_civil">Defensa Civil</option>
                                <option value="meteorologo">Meteorólogo</option>
                                <option value="cientifico_datos">Científico de Datos</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="w-full bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                    <th className="py-2 px-4 border-b">Nombre</th>
                                    <th className="py-2 px-4 border-b">Email</th>
                                    <th className="py-2 px-4 border-b">Rol</th>
                                    <th className="py-2 px-4 border-b">Estado</th>
                                    <th className="py-2 px-4 border-b">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">Cargando usuarios...</td>
                                    </tr>
                                )}
                                {error && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-red-600">Error: {error}</td>
                                    </tr>
                                )}
                                {!loading && !error && filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td className="py-2 px-4 border-b">{user.name}</td>
                                        <td className="py-2 px-4 border-b">{user.email}</td>
                                        <td className="py-2 px-4 border-b">{user.role}</td>
                                        <td className="py-2 px-4 border-b">
                                            {renderUserStatus(user)}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {renderUserActions(user)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Status Section */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Estado del Sistema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <button onClick={handleTestOpenMeteo} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Probar Open-Meteo</button>
                            {systemStatus.openMeteo && (
                                <div className={`mt-2 p-2 rounded-md ${systemStatus.openMeteo.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <p><strong>Estado:</strong> {systemStatus.openMeteo.status}</p>
                                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(systemStatus.openMeteo.data || systemStatus.openMeteo.message, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                        <div>
                            <button onClick={handleTestGoesSatellite} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Probar GOES Satellite</button>
                            {systemStatus.goesSatellite && (
                                <div className={`mt-2 p-2 rounded-md ${systemStatus.goesSatellite.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <p><strong>Estado:</strong> {systemStatus.goesSatellite.status}</p>
                                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(systemStatus.goesSatellite.data || systemStatus.goesSatellite.message, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* System Logs Section */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Logs del Sistema</h3>
                    <button onClick={handleFetchLogs} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md mb-4">Cargar Logs</button>
                    <div className="bg-gray-100 p-4 rounded-md max-h-80 overflow-y-auto">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">{logs || 'No se han cargado logs.'}</pre>
                    </div>
                </div>
            </div>

            {/* Change Role Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Cambiar Rol de {selectedUser?.name}</h3>
                        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full px-3 py-2 border rounded-md mb-4">
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                            <option value="defensa_civil">Defensa Civil</option>
                            <option value="meteorologo">Meteorólogo</option>
                            <option value="cientifico_datos">Científico de Datos</option>
                        </select>
                        <div className="flex justify-end">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md mr-2">Cancelar</button>
                            <button onClick={handleRoleChange} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPage;
