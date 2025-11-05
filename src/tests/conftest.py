import pytest
from src.app import app

@pytest.fixture
def client():
    """Fixture que proporciona cliente de testing con app context"""
    with app.test_client() as client:
        with app.app_context():
            yield client

@pytest.fixture(autouse=True)
def app_context():
    """Fixture que asegura app context automáticamente para todos los tests"""
    with app.app_context():
        yield