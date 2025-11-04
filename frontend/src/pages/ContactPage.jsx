import React from 'react';

function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Contacto</h1>
      <div className="space-y-6 text-gray-700">
        <p>Si tiene alguna pregunta o desea ponerse en contacto con nosotros, no dude en utilizar la información a continuación.</p>
        
        <div className="mt-6 bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-800">Información de Contacto</h3>
          <ul className="mt-4 space-y-2">
            <li><strong>Email:</strong> <a href="mailto:contacto@nimbus-ai.com" className="text-blue-600 hover:underline">contacto@nimbus-ai.com</a></li>
            <li><strong>Teléfono:</strong> +54 9 261 123 4567</li>
            <li><strong>Dirección:</strong> Mendoza, Argentina</li>
          </ul>
        </div>

        <p className="pt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.</p>

      </div>
    </div>
  );
}

export default ContactPage;
