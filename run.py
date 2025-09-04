from src.api.app import app

if __name__ == '__main__':
    print("🚀 Iniciando servidor Nimbus API...")
    print("📡 Endpoints disponibles:")
    print("   • http://localhost:5000/api/clima/mendoza")
    print("   • http://localhost:5000/api/clima")
    print("   • http://localhost:5000/api/health")
    print("⏹️  Presiona Ctrl+C para detener el servidor")
    app.run(debug=True, host='0.0.0.0', port=5000)