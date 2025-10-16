
import React, { useState, useEffect } from 'react';
import {
    getAllUsers,
    approveUser,
    rejectUser,
    changeUserRole,
    suspendUser,
    unbanUser
} from '../api/admin';
import { useAuth } from '../context/AuthContext';
import ServiceStatusDashboard from '../components/ServiceStatusDashboard';

function AdminPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for role change modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    
    // State for details modal
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);

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

    const openDetailsModal = (user) => {
        setSelectedUserForDetails(user);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedUserForDetails(null);
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
        if (currentUser && currentUser.id === user.id) {
            return <span className="text-xs text-gray-500">No se puede modificar a sí mismo</span>;
        }

        if (['admin', 'superadmin'].includes(user.role) && currentUser.role !== 'superadmin') {
            return <span className="text-xs text-gray-500">Solo un Superadmin puede modificar a un Admin</span>;
        }

        return (
            <div className="flex items-center">
                <button onClick={() => openDetailsModal(user)} className="text-indigo-600 hover:text-indigo-800 mr-3 text-sm font-semibold">Ver Detalles</button>
                
                {!user.is_verified && (
                    <button onClick={() => handleApprove(user.id)} className="text-green-600 hover:text-green-800 mr-3 text-sm font-semibold">Aprobar</button>
                )}

                {![ 'user', 'admin', 'superadmin' ].includes(user.role) && (
                    <button onClick={() => handleReject(user.id)} className="text-gray-600 hover:text-gray-800 mr-3 text-sm">Rechazar</button>
                )}

                {user.is_suspended ? (
                    <button onClick={() => handleUnban(user.id)} className="text-green-600 hover:text-green-800 mr-3 text-sm font-semibold">Quitar Suspensión</button>
                ) : (
                    <button onClick={() => handleSuspend(user.id)} className="text-red-600 hover:text-red-800 mr-3 text-sm">Suspender</button>
                )}
                
                <button onClick={() => openChangeRoleModal(user)} className="text-blue-600 hover:text-blue-800 text-sm">Editar Rol</button>
            </div>
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

                <ServiceStatusDashboard />

            </div>

            {/* Change Role Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
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

            {/* User Details Modal */}
            {isDetailsModalOpen && selectedUserForDetails && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">Detalles de {selectedUserForDetails.name}</h3>
                        <div className="space-y-2 text-sm">
                            <p><strong>Email:</strong> {selectedUserForDetails.email}</p>
                            <p><strong>Rol Solicitado:</strong> {selectedUserForDetails.role}</p>
                            <hr className="my-3"/>
                            
                            {selectedUserForDetails.role === 'defensa_civil' && (
                                <>
                                    <h4 className="text-md font-semibold mt-2">Información de Defensa Civil</h4>
                                    <p><strong>Institución:</strong> {selectedUserForDetails.institution || 'No especificado'}</p>
                                    <p><strong>Legajo:</strong> {selectedUserForDetails.employee_id || 'No especificado'}</p>
                                </>
                            )}

                            {selectedUserForDetails.role === 'meteorologo' && (
                                <>
                                    <h4 className="text-md font-semibold mt-2">Información de Meteorólogo</h4>
                                    <p><strong>Matrícula Profesional:</strong> {selectedUserForDetails.license_number || 'No especificado'}</p>
                                    <p><strong>Lugar de Trabajo:</strong> {selectedUserForDetails.workplace || 'No especificado'}</p>
                                    <p><strong>Perfil de LinkedIn:</strong> {selectedUserForDetails.linkedin_profile ? <a href={selectedUserForDetails.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedUserForDetails.linkedin_profile}</a> : 'No especificado'}</p>
                                </>
                            )}

                            {selectedUserForDetails.role === 'cientifico_datos' && (
                                <>
                                    <h4 className="text-md font-semibold mt-2">Información de Científico de Datos</h4>
                                    <p><strong>Organización:</strong> {selectedUserForDetails.organization || 'No especificado'}</p>
                                    <p><strong>Perfil de GitHub:</strong> {selectedUserForDetails.github_profile ? <a href={selectedUserForDetails.github_profile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedUserForDetails.github_profile}</a> : 'No especificado'}</p>
                                </>
                            )}
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={closeDetailsModal} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPage;
