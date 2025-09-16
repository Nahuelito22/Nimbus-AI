from src.api.app import app

if __name__ == '__main__':
    print("🚀 Iniciando servidor Nimbus API...")

    print("\n🌤️  Endpoints de Clima (OpenWeather):")
    print("   • http://localhost:5000/api/clima/mendoza")
    print("   • http://localhost:5000/api/clima")

    print("\n🌦️  Endpoints de Meteo (Open-Meteo):")
    print("   • http://localhost:5000/api/meteo/ip")
    print("   • http://localhost:5000/api/meteo/coords?lat=-32.889&lon=-68.845")
    print("   • http://localhost:5000/api/meteo/ciudad/mendoza")

    print("\n📰 Endpoints de Noticias:")
    print("   • http://localhost:5000/api/noticias/general")
    print("   • http://localhost:5000/api/noticias/deportes")
    print("   • http://localhost:5000/api/noticias/clima")
    print("   • http://localhost:5000/api/noticias")

    print("\n🩺 Health Check:")
    print("   • http://localhost:5000/api/health")

    print("\n⏹️  Presiona Ctrl+C para detener el servidor")
    app.run(debug=True, host='0.0.0.0', port=5000)
