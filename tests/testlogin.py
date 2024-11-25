import pytest
import json
from unittest.mock import patch

import sys
import os

# Agrega el directorio raíz del proyecto al PATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from app import app  # Ahora debería encontrar `app.py` correctamente


@pytest.fixture
def client():
    """Fixture para crear un cliente de prueba."""
    app.config['TESTING'] = True
    return app.test_client()


def test_login_missing_email(client):
    """Test cuando falta el correo en la solicitud de login."""
    response = client.post("/login", json={"password": "password123"})
    assert response.status_code == 400
    assert response.get_json() == {"error": "El correo y la contraseña son obligatorios"}


def test_login_missing_password(client):
    """Test cuando falta la contraseña en la solicitud de login."""
    response = client.post("/login", json={"email": "user@example.com"})
    assert response.status_code == 400
    assert response.get_json() == {"error": "El correo y la contraseña son obligatorios"}


def test_login_user_not_found(client):
    """Test cuando el usuario no se encuentra en la base de datos."""
    with patch("app.mysql.connection.cursor") as mock_cursor:
        mock_cursor.return_value.__enter__.return_value.fetchone.return_value = None
        response = client.post("/login", json={"email": "user@example.com", "password": "password123"})
        assert response.status_code == 401
        assert response.get_json() == {"error": "Correo o contraseña incorrectos"}


def test_login_incorrect_password(client):
    """Test cuando la contraseña es incorrecta."""
    mock_user = (1, "username", "user@example.com", "$2b$12$invalidhash", 2)  # Contraseña hasheada falsa
    with patch("app.mysql.connection.cursor") as mock_cursor:
        mock_cursor.return_value.__enter__.return_value.fetchone.return_value = mock_user
        with patch("app.bcrypt.checkpw", return_value=False):
            response = client.post("/login", json={"email": "user@example.com", "password": "wrongpassword"})
            assert response.status_code == 401
            assert response.get_json() == {"error": "Correo o contraseña incorrectos"}


def test_login_successful(client):
    """Test cuando el login es exitoso y se genera el token."""
    mock_user = (1, "username", "user@example.com", "$2b$12$validhash", 2)
    with patch("app.mysql.connection.cursor") as mock_cursor:
        mock_cursor.return_value.__enter__.return_value.fetchone.return_value = mock_user
        with patch("app.bcrypt.checkpw", return_value=True):
            with patch("app.jwt.encode", return_value="fake_jwt_token"):
                response = client.post("/login", json={"email": "user@example.com", "password": "correctpassword"})
                assert response.status_code == 200
                assert response.get_json() == {
                    "message": "Inicio de sesión exitoso",
                    "token": "fake_jwt_token"
                }


def test_login_server_error(client):
    """Test cuando ocurre un error en el servidor (por ejemplo, error en la base de datos)."""
    with patch("app.mysql.connection.cursor", side_effect=Exception("DB connection failed")):
        response = client.post("/login", json={"email": "user@example.com", "password": "password123"})
        assert response.status_code == 500
        assert response.get_json() == {"error": "Error al autenticar el usuario: DB connection failed"}
