import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from flask import current_app
from src.services.logger import app_logger

def send_verification_email(user_email, verification_code):
    """
    Construye y envía un correo de verificación al usuario usando Brevo.
    
    Args:
        user_email (str): La dirección de correo del destinatario.
        verification_code (str): El código de 6 dígitos a enviar.
    """
    api_key = current_app.config.get('BREVO_API_KEY')
    sender_email = current_app.config.get('BREVO_DEFAULT_SENDER')

    if not api_key or not sender_email:
        app_logger.error("BREVO_API_KEY o BREVO_DEFAULT_SENDER no están configurados.")
        return False

    # Configuración del cliente de Brevo
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = api_key
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

    subject = "Tu código de verificación para Nimbus AI"
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; color: #333;">
        <div style="max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
            <h2 style="color: #0056b3;">Verificación de Cuenta en Nimbus AI</h2>
            <p>¡Gracias por registrarte! Usa el siguiente código para activar tu cuenta:</p>
            <div style="background-color: #f2f2f2; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <p style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #0056b3; margin: 0;">
                    {verification_code}
                </p>
            </div>
            <p>Si no solicitaste este registro, puedes ignorar este correo de forma segura.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888;">&copy; Nimbus AI - Todos los derechos reservados</p>
        </div>
    </div>
    """
    
    # Usar las clases del SDK para definir remitente y destinatario
    sender = sib_api_v3_sdk.SendSmtpEmailSender(email=sender_email, name="Nimbus AI")
    to = [sib_api_v3_sdk.SendSmtpEmailTo(email=user_email)]
    
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        html_content=html_content,
        sender=sender,
        subject=subject
    )

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        app_logger.info(f"Correo de verificación enviado a {user_email} a través de Brevo. Response: {api_response}")
        return True
    except ApiException as e:
        # El cuerpo del error de Brevo suele tener más detalles
        app_logger.error(f"Excepción de la API de Brevo al enviar correo a {user_email}: {e.body}")
        return False
    except Exception as e:
        app_logger.error(f"Excepción general al enviar correo con Brevo: {str(e)}")
        return False