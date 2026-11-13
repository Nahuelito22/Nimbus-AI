import pytest


@pytest.mark.parametrize("role", ["admin", "superadmin", "cualquier_cosa"])
def test_register_rechaza_roles_no_registrables(client, role):
    response = client.post("/api/register", json={
        "email": f"{role}@example.com",
        "password": "secreta123",
        "name": "Atacante",
        "role": role,
    })
    assert response.status_code == 400
    assert response.json == {"msg": "Tipo de cuenta no válido"}
