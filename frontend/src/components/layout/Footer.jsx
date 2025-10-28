function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <img src="/logo_no_letras.png" alt="Logo Nimbus AI" className="h-8 w-12" />
              <div>
                <h3 className="text-lg font-bold">NIMBUS AI</h3>
                <p className="text-gray-300 text-sm">HAIL-PREDICTION MENDOZA PROVINCE</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-300 transition-colors">Términos</a>
            <a href="#" className="hover:text-blue-300 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-300 transition-colors">Contacto</a>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-300 text-sm">
          <p>© 2025 NIMBUS AI - HAIL-PREDICTION MENDOZA PROVINCE. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;