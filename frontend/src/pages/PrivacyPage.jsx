import React from 'react';

function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Política de Privacidad de Nimbus AI</h1>
      <div className="space-y-6 text-gray-700">
        
        <p><strong>Última actualización:</strong> 4 de Noviembre, 2025</p>
        
        <p>Su privacidad es fundamental para nosotros. Nimbus AI es un proyecto académico y experimental. Esta política explica qué información recopilamos y cómo la utilizamos para proveer nuestro servicio de predicción de granizo.</p>

        <h2 className="text-2xl font-semibold text-gray-800 pt-4">1. Información que Recopilamos</h2>
        <p>Para operar la plataforma, recopilamos los siguientes tipos de información:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            <strong>Información de Registro:</strong> Cuando crea una cuenta, solicitamos su nombre, dirección de correo electrónico y una contraseña. Su contraseña se almacena siempre de forma encriptada (hashed) y nunca tenemos acceso a ella en texto plano.
          </li>
          <li>
            <strong>Información de Verificación de Cuenta:</strong> Para activar su cuenta, gestionamos un código de verificación temporal enviado a su correo electrónico.
          </li>
          <li>
            <strong>Información de Roles Profesionales (Opcional):</strong> Si solicita un rol avanzado (como Meteorólogo o Defensa Civil), recopilamos la información adicional que nos proporciona (ej. institución, matrícula) con el único fin de realizar la verificación manual de dicho rol.
          </li>
          <li>
            <strong>Información de Ubicación:</strong> Para generar una predicción, recopilamos las coordenadas (latitud y longitud) de la ubicación que usted selecciona en el mapa.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 pt-4">2. Cómo Usamos su Información</h2>
        <p>Utilizamos la información recopilada exclusivamente para los siguientes propósitos:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Para crear, verificar y mantener la seguridad de su cuenta de usuario.</li>
          <li>Para gestionar y validar su rol de usuario (en caso de solicitar un rol profesional).</li>
          <li>Para obtener los datos de pronóstico (de APIs externas como Open-Meteo) y las imágenes satelitales (de AWS GOES) correspondientes a la ubicación que usted solicita.</li>
          <li>Para comunicarnos con usted sobre actualizaciones importantes del servicio o de su cuenta.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 pt-4">3. Cómo NO Usamos su Información</h2>
        <p>Como proyecto académico, nuestra prioridad es la investigación y la prestación de un servicio útil. Por lo tanto:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            <strong>No vendemos, alquilamos ni compartimos</strong> su información personal identificable con terceros con fines de marketing o publicidad.
          </li>
          <li>
            Los datos de ubicación que solicita para una predicción se utilizan de forma anónima para consultar las APIs externas y no se almacenan de forma permanente asociados a su perfil.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 pt-4">4. Seguridad de los Datos</h2>
        <p>Tomamos medidas técnicas razonables para proteger su información. Las contraseñas se almacenan utilizando técnicas modernas de hashing (Bcrypt). Toda la comunicación entre su navegador y nuestros servidores se realiza a través de conexiones seguras (HTTPS).</p>

        <h2 className="text-2xl font-semibold text-gray-800 pt-4">5. Gestión de su Información y Contacto</h2>
        <p>Usted tiene derecho a solicitar la eliminación de su cuenta y de toda la información personal asociada en cualquier momento. Si tiene alguna pregunta o inquietud sobre nuestra política de privacidad, no dude en ponerse en contacto con nosotros.</p>
        <p>Email de Contacto: <strong>nimbus.ai.mdz@gmail.com</strong></p>
      </div>
    </div>
  );
}

export default PrivacyPage;