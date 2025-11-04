# src/tests/test_email_service.py

from unittest.mock import MagicMock, patch
from flask import Flask
from src.services.email_service import send_verification_email

def test_send_verification_email_success():
    """Prueba simple: debe enviar el correo correctamente y devolver True"""

    # 1️⃣ Creamos una app Flask mínima
    app = Flask(__name__)
    app.config["MAIL_DEFAULT_SENDER"] = "nimbus@test.com"

    # 2️⃣ Creamos un mock de mail (no manda nada real)
    mock_mail = MagicMock()

    with app.app_context():  # Activamos el contexto de Flask
        with patch("src.services.email_service.app_logger") as mock_logger:
            # 3️⃣ Llamamos a la función
            result = send_verification_email(mock_mail, "user@test.com", "123456")

            # 4️⃣ Verificamos resultados
            assert result is True                     # Devuelve True si todo fue bien
            mock_mail.send.assert_called_once()        # mail.send() fue llamado una vez
            args, kwargs = mock_mail.send.call_args
            message = args[0]                          # El mensaje enviado
            assert "123456" in message.html             # El HTML contiene el código
            assert message.recipients == ["user@test.com"]
            mock_logger.info.assert_called_once()       # Registró el envío
