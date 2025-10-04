const API_URL = '/api';

const getAuthToken = () => {
    return localStorage.getItem('authToken');
};
const apiRequest = async (url, method = 'GET', body = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
    };

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error en la petición a la API');
    }

    return response.json();
};

export const getAllUsers = async () => {
    return await apiRequest(`${API_URL}/admin/users`);
};

export const approveUser = async (userId) => {
    return await apiRequest(`${API_URL}/admin/approve/${userId}`, 'POST');
};

export const rejectUser = async (userId) => {
    return await apiRequest(`${API_URL}/admin/reject/${userId}`, 'POST');
};

export const suspendUser = async (userId) => {
    return await apiRequest(`${API_URL}/admin/suspend/${userId}`, 'POST');
};

export const unbanUser = async (userId) => {
    return await apiRequest(`${API_URL}/admin/unban/${userId}`, 'POST');
};

export const changeUserRole = async (userId, newRole) => {
    return await apiRequest(`${API_URL}/admin/role/${userId}`, 'PUT', { role: newRole });
};

export const getLogs = async () => {
    return await apiRequest(`${API_URL}/admin/logs`);
};

export const testOpenMeteo = async () => {
    return await apiRequest(`${API_URL}/admin/test/open-meteo`);
};

export const testGoesSatellite = async () => {
    return await apiRequest(`${API_URL}/admin/test/goes-satellite`);
};
