import json
from unittest.mock import patch
import pytest

@pytest.fixture
def client():
    from app import app  # Asegúrate de importar tu app correctamente
    app.config['TESTING'] = True
    return app.test_client()

# Simulación de una solicitud exitosa con autenticación correcta
@patch("app.requiere_autenticacion")  # Simula el decorador 'requiere_autenticacion'
def test_obtener_contactos_exitosa(client, mock_requiere_autenticacion):
    # Configura el mock para que siempre pase la autenticación
    mock_requiere_autenticacion.return_value = lambda x: x  # No hace nada, deja pasar la función

    # Simula una consulta exitosa a la base de datos
    mock_contactos = [
        (1, "Juan", "Perez", "juan@example.com", "123456789", "1990-01-01", "Buenos Aires", "amigo"),
        (2, "Ana", "Lopez", "ana@example.com", "987654321", "1992-02-02", "CABA", "colega"),
    ]
    with patch("app.mysql.connection.cursor") as mock_cursor:
        mock_cursor.return_value.__enter__.return_value.fetchall.return_value = mock_contactos
        response = client.get("/api/contactos", headers={"Authorization": "Bearer fake_token"})

    assert response.status_code == 200
    contactos_json = [
        {"id": 1, "nombre": "Juan", "apellido": "Perez", "email": "juan@example.com", "telefono": "123456789", "fecha_nacimiento": "1990-01-01", "ubicacion": "Buenos Aires", "tags": "amigo"},
        {"id": 2, "nombre": "Ana", "apellido": "Lopez", "email": "ana@example.com", "telefono": "987654321", "fecha_nacimiento": "1992-02-02", "ubicacion": "CABA", "tags": "colega"},
    ]
    assert response.get_json() == contactos_json
