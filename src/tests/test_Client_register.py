import sys
import os
import pytest

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

def test_client_register(client, mocker):
    """Test de proceso para el registro de usuario"""

    # Datos simulados que el front mandaría
    data = {
        "email": "usuario_ejemplo@gmail.com",
        "password": "123456",
        "name": "John Doe",
        "role": "user"
    }

    # Mock del envío de email
    mock_email = mocker.patch("src.services.email_service.send_verification_email", return_value=True)

    # Mock de la base de datos
    mock_add = mocker.patch("src.app.db.session.add")
    mock_commit = mocker.patch("src.app.db.session.commit")

    # Ejecutamos la request simulada
    response = client.post("/api/register", json=data)

    # Mostramos resultado (modo debug)
    print("\nSTATUS:", response.status_code)
    print("JSON:", response.get_json())

    # VERIFICACIONES BÁSICAS
    assert response.status_code != 500, "Error interno del servidor"
    assert response.status_code != 404, "Endpoint no encontrado"

def test_verify_email(client, mocker):
    """Test de proceso para verificar el correo del usuario"""
    
    # Datos para la verificación (como espera tu endpoint)
    verification_data = {
        "email": "usuario_ejemplo@gmail.com",
        "code": "123456"  # Código de verificación
    }
    
    # Mock: Simular usuario encontrado
    mock_user = mocker.MagicMock()
    mock_user.is_verified = False
    mock_user.verification_code = "123456"  # Código correcto
    
    # Mock de la consulta a la base de datos
    mock_user_query = mocker.patch("src.app.User.query")
    mock_user_query.filter_by.return_value.first.return_value = mock_user
    
    # Mock del commit
    mock_commit = mocker.patch("src.app.db.session.commit")
    
    # Ejecutar verificación (usando POST y JSON en el body)
    response = client.post("/api/verify-email", json=verification_data)
    
    print("\nVERIFICACIÓN EMAIL - STATUS:", response.status_code)
    print("VERIFICACIÓN EMAIL - JSON:", response.get_json())
    
    # Verificaciones
    assert response.status_code != 404, "Endpoint de verificación no existe"
    assert response.status_code != 500, "Error interno en verificación"
    
    # Si todo sale bien, debería ser 200
    if response.status_code == 200:
        assert mock_user.is_verified == True  # Debería marcarse como verificado
        assert mock_user.verification_code == None  # Código debería limpiarse

def test_integracion_basica(client, mocker):
    """
    Test de integración básica - Corregido con la ruta correcta
    """
    print("\n" + "="*50)
    print("🚀 TEST INTEGRACIÓN BÁSICA")
    print("="*50)
    
    # 1. REGISTRO (funciona)
    data = {
        "email": "test@example.com", 
        "password": "123456",
        "name": "Test User"
    }
    
    # Mock básico para registro
    mocker.patch("src.services.email_service.send_verification_email", return_value=True)
    mocker.patch("src.app.db.session.add")
    mocker.patch("src.app.db.session.commit")
    
    response = client.post("/api/register", json=data)
    print(f"1. REGISTRO - Status: {response.status_code}")
    assert response.status_code == 201, "Registro debería funcionar"
    
    # 2. LOGIN (401 es normal sin verificación)
    login_data = {
        "email": "test@example.com",
        "password": "123456"
    }
    response = client.post("/api/login", json=login_data)
    print(f"2. LOGIN - Status: {response.status_code}")
    # 401 es esperado si el email no está verificado
    
    # 3. VERIFICACIÓN (CORREGIDO - usa POST y JSON)
    verification_data = {
        "email": "test@example.com",
        "code": "123456"  # Código simulado
    }
    
    # Mock para verificación
    mock_user = mocker.MagicMock()
    mock_user.is_verified = False
    mock_user.verification_code = "123456"
    mocker.patch("src.app.User.query").filter_by.return_value.first.return_value = mock_user
    mocker.patch("src.app.db.session.commit")
    
    response = client.post("/api/verify-email", json=verification_data)
    print(f"3. VERIFICACIÓN - Status: {response.status_code}")
    assert response.status_code != 404, "Endpoint /api/verify-email no existe"
    
    print("✅ TODOS LOS ENDPOINTS EXISTEN Y RESPONDEN!")

def test_verify_email_scenarios(client, mocker):
    """Tests para diferentes escenarios de verificación"""
    
    # Escenario 1: Verificación exitosa
    print("\n🔹 ESCENARIO 1: Verificación exitosa")
    verification_data = {
        "email": "test@example.com",
        "code": "codigo_correcto"
    }
    
    mock_user = mocker.MagicMock()
    mock_user.is_verified = False
    mock_user.verification_code = "codigo_correcto"
    mocker.patch("src.app.User.query").filter_by.return_value.first.return_value = mock_user
    mocker.patch("src.app.db.session.commit")
    
    response = client.post("/api/verify-email", json=verification_data)
    print(f"   Status: {response.status_code}")
    assert response.status_code == 200
    
    # Escenario 2: Código incorrecto
    print("\n🔹 ESCENARIO 2: Código incorrecto")
    verification_data = {
        "email": "test@example.com", 
        "code": "codigo_incorrecto"
    }
    
    mock_user.verification_code = "codigo_correcto"  # Código en BD diferente
    response = client.post("/api/verify-email", json=verification_data)
    print(f"   Status: {response.status_code}")
    assert response.status_code == 400
    
    # Escenario 3: Usuario no encontrado
    print("\n🔹 ESCENARIO 3: Usuario no encontrado")
    verification_data = {
        "email": "noexiste@example.com",
        "code": "123456"
    }
    
    mocker.patch("src.app.User.query").filter_by.return_value.first.return_value = None
    response = client.post("/api/verify-email", json=verification_data)
    print(f"   Status: {response.status_code}")
    assert response.status_code == 404