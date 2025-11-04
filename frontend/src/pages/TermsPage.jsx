import React from 'react';

function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Térmimos y Condiciones de Uso</h1>
      <div className="space-y-6 text-gray-700">
        
        <p><strong>Última actualización:</strong> 4 de Noviembre, 2025 </p>
        
        <p>Bienvenido a Nimbus AI ("el Servicio"). Estos términos y condiciones rigen su acceso y uso de los servicios de predicción de granizo proporcionados. Al registrarse o utilizar nuestro servicio, usted acepta estar sujeto a estos términos en su totalidad.</p>

        <h2 className="text-2xl font-semibold text-gray-800 pt-4">1. Descripción del Servicio</h2>
        <p>Nimbus AI es un **proyecto académico y experimental** de pronóstico meteorológico. La Plataforma utiliza un modelo de inteligencia artificial multimodal que combina datos meteorológicos numéricos (de fuentes como Open-Meteo) e imágenes satelitales (de GOES) para generar una <strong>probabilidad</strong> de eventos de granizo en la provincia de Mendoza.</p>
        <p>El Servicio se proporciona "tal cual", con fines informativos y de investigación, y está sujeto a cambios o interrupciones sin previo aviso.</p>

        <h2 className="text-2xl font-semibold text-gray-800 pt-4">2. Cuentas de Usuario y Roles</h2>
        <p>Para acceder a la funcionalidad completa de la Plataforma, debe registrarse para obtener una cuenta. Usted es responsable de mantener la confidencialidad de su contraseña y de toda la actividad que ocurra bajo su cuenta.</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Verificación de Cuenta:</strong> Todas las cuentas de usuario requieren una verificación por correo electrónico para ser activadas.</li>
          <li><strong>Roles Profesionales:</strong> La Plataforma ofrece roles de usuario avanzados (ej. Meteorólogo, Defensa Civil). La asignación de estos roles no es automática y está sujeta a un proceso de verificación y aprobación manual por parte de los administradores del sistema.</li>
          <li><strong>Conducta del Usuario:</strong> Usted se compromete a no utilizar el servicio para fines ilícitos o para sobrecargar intencionalmente nuestros servidores (incluyendo la API del modelo en Hugging Face y los servicios de back-end).</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 pt-4">3. Limitación de Responsabilidad (Descargo de Responsabilidad)</h2>
        <p>Este es un proyecto académico y NO un servicio meteorológico comercial certificado. Las predicciones proporcionadas por Nimbus AI son el resultado de un modelo probabilístico y experimental y **NO constituyen una garantía** de las condiciones meteorológicas futuras.</p>
        <p>Los desarrolladores de Nimbus AI no se hacen responsables de ninguna manera por:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>La precisión, fiabilidad o disponibilidad de los datos provenientes de APIs externas (NOAA, Open-Meteo, GOES).</li>
          <li>Decisiones tomadas (financieras, agrícolas, de seguridad personal o de cualquier otra índole) basadas en la información o las predicciones de esta Plataforma.</li>
          <li>Cualquier daño directo o indirecto a cultivos, propiedades, vehículos o personas que pueda ocurrir como resultado de un evento meteorológico, independientemente de si la Plataforma lo predijo o no.</li>
        </ul>
        <p><strong>Usted utiliza este servicio bajo su propio y absoluto riesgo.</strong></p>

        <h2 className="text-2xl font-semibold text-gray-800 pt-4">4. Propiedad Intelectual</h2>
        <p>El modelo de inteligencia artificial, la arquitectura del software, el código fuente del back-end y front-end, y la marca "Nimbus AI" son propiedad intelectual de los desarrolladores del proyecto. Se permite el uso de la aplicación según estos términos, pero no se otorga licencia para replicar, modificar o distribuir el software sin permiso explícito.</p>

        <h2 className="text-2xl font-semibold text-gray-800 pt-4">5. Modificación de los Términos</h2>
        <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Se notificará a los usuarios de cambios significativos. El uso continuado del servicio después de dichas modificaciones constituirá su aceptación de los nuevos términos.</p>
      </div>
    </div>
  );
}

export default TermsPage;