from src.api.app import app

if __name__ == '__main__':
    print("🚀 Iniciando servidor Nimbus API...")
    print("🌤️  Endpoints de Clima:")
    print("   • http://localhost:5000/api/clima/mendoza")
    print("   • http://localhost:5000/api/clima")
    print("📰 Endpoints de Noticias:")
    print("   • http://localhost:5000/api/noticias/general")
    print("   • http://localhost:5000/api/noticias/deportes")
    print("   • http://localhost:5000/api/noticias/clima")
    print("   • http://localhost:5000/api/noticias")
    print("🩺 Health Check:")
    print("   • http://localhost:5000/api/health")
    print("⏹️  Presiona Ctrl+C para detener el servidor")
    app.run(debug=True, host='0.0.0.0', port=5000)