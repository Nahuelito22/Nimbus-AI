from flask_mail import Message
from flask import current_app
from src.services.logger import app_logger

def send_verification_email(mail, user_email, verification_code):
    """
    Construye y envía un correo de verificación al usuario con su código.
    
    Args:
        mail: La instancia del objeto Mail de Flask-Mail.
        user_email (str): La dirección de correo del destinatario.
        verification_code (str): El código de 6 dígitos a enviar.
    """
    try:
        subject = "Tu código de verificación para Nimbus AI"
        sender = current_app.config.get('MAIL_DEFAULT_SENDER')
        
        # Creamos un cuerpo de correo en HTML para que se vea mejor.
        html_body = f"""
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
        
        msg = Message(subject, sender=sender, recipients=[user_email], html=html_body)
        
        mail.send(msg)
        app_logger.info(f"Correo de verificación enviado exitosamente a {user_email}.")
        return True
    except Exception as e:
        # Usamos current_app para acceder al logger de forma segura
        current_app.logger.error(f"Error al enviar correo de verificación a {user_email}: {str(e)}")
        return False
