import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    // Campos para Defensa Civil
    institution: '',
    employeeId: '',
    institutionalEmail: '',
    // Campos para Meteorólogo
    licenseNumber: '',
    workplace: '',
    linkedinProfile: '',
    // Campos para Científico de Datos
    organization: '',
    githubProfile: '',
    interestDescription: ''
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Preparamos los datos a enviar según el rol
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      // Agregar campos específicos según el rol
      if (formData.role === 'defensa_civil') {
        dataToSend.institution = formData.institution;
        dataToSend.employeeId = formData.employeeId;
        dataToSend.institutionalEmail = formData.institutionalEmail;
      } else if (formData.role === 'meteorologo') {
        dataToSend.licenseNumber = formData.licenseNumber;
        dataToSend.workplace = formData.workplace;
        dataToSend.linkedinProfile = formData.linkedinProfile;
      } else if (formData.role === 'cientifico_datos') {
        dataToSend.organization = formData.organization;
        dataToSend.githubProfile = formData.githubProfile;
        dataToSend.interestDescription = formData.interestDescription;
      }

      await registerUser(dataToSend);

      setSuccess('¡Usuario creado exitosamente! Redirigiendo al login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center pt-10">
      <section className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <span>{success}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={success}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={success}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={success}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="role">Tipo de cuenta</label>
            <select
              id="role"
              name="role"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.role}
              onChange={handleChange}
              disabled={success}
            >
              <option value="user">Usuario normal</option>
              <option value="defensa_civil">Defensa Civil</option>
              <option value="meteorologo">Meteorólogo</option>
              <option value="cientifico_datos">Científico de Datos</option>
            </select>
          </div>

          {/* Campos adicionales según el rol */}
          {formData.role === 'defensa_civil' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="institution">Institución/Municipio</label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.institution}
                  onChange={handleChange}
                  disabled={success}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="employeeId">Legajo o N° de Identificación (opcional)</label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.employeeId}
                  onChange={handleChange}
                  disabled={success}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="institutionalEmail">Email Institucional</label>
                <input
                  type="email"
                  id="institutionalEmail"
                  name="institutionalEmail"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.institutionalEmail}
                  onChange={handleChange}
                  disabled={success}
                />
              </div>
            </>
          )}

          {formData.role === 'meteorologo' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="licenseNumber">Matrícula Profesional</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  disabled={success}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="workplace">Institución/Empresa</label>
                <input
                  type="text"
                  id="workplace"
                  name="workplace"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.workplace}
                  onChange={handleChange}
                  disabled={success}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="linkedinProfile">Perfil de LinkedIn (opcional)</label>
                <input
                  type="text"
                  id="linkedinProfile"
                  name="linkedinProfile"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.linkedinProfile}
                  onChange={handleChange}
                  disabled={success}
                />
              </div>
            </>
          )}

          {formData.role === 'cientifico_datos' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="organization">Institución/Empresa</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.organization}
                  onChange={handleChange}
                  disabled={success}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="githubProfile">Perfil de LinkedIn o GitHub</label>
                <input
                  type="text"
                  id="githubProfile"
                  name="githubProfile"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.githubProfile}
                  onChange={handleChange}
                  disabled={success}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="interestDescription">Descripción del Interés</label>
                <textarea
                  id="interestDescription"
                  name="interestDescription"
                  rows="3"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.interestDescription}
                  onChange={handleChange}
                  disabled={success}
                ></textarea>
              </div>
            </>
          )}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition" disabled={success}>
            Crear Cuenta
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia Sesión</Link></p>
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;