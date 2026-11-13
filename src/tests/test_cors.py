import pytest


@pytest.mark.parametrize("origin", ["https://nimbusai.com.ar", "https://www.nimbusai.com.ar"])
def test_preflight_acepta_dominio_propio(client, origin):
    response = client.options("/api/login", headers={
        "Origin": origin,
        "Access-Control-Request-Method": "POST",
    })
    assert response.headers.get("Access-Control-Allow-Origin") == origin


def test_preflight_rechaza_origen_desconocido(client):
    response = client.options("/api/login", headers={
        "Origin": "https://sitio-ajeno.example",
        "Access-Control-Request-Method": "POST",
    })
    assert "Access-Control-Allow-Origin" not in response.headers
