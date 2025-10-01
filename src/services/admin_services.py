
from src.database import db
from src.models.user import User
from src.services.logger import app_logger

def get_all_users_service():
    """Obtiene todos los usuarios de la base de datos."""
    try:
        app_logger.info("Servicio de obtención de todos los usuarios invocado.")
        users = User.query.all()
        users_data = [
            {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'is_verified': user.is_verified,
                'institution': user.institution,
                'employee_id': user.employee_id,
                'license_number': user.license_number,
                'workplace': user.workplace,
                'organization': user.organization,
                'github_profile': user.github_profile
            } for user in users
        ]
        app_logger.info(f"{len(users_data)} usuarios recuperados exitosamente.")
        return {"success": True, "users": users_data}
    except Exception as e:
        app_logger.error(f"Error en get_all_users_service: {str(e)}")
        return {"success": False, "error": str(e)}

def approve_user_service(user_id):
    """Aprueba a un usuario estableciendo is_verified a True."""
    try:
        app_logger.info(f"Servicio de aprobación de usuario invocado para user_id: {user_id}")
        user = User.query.get(user_id)
        if not user:
            app_logger.warning(f"Intento de aprobar usuario no encontrado con id: {user_id}")
            return {"success": False, "error": "Usuario no encontrado"}
        
        user.is_verified = True
        db.session.commit()
        
        app_logger.info(f"Usuario {user.email} (ID: {user_id}) ha sido aprobado exitosamente.")
        return {"success": True, "msg": f"Usuario {user.email} ha sido aprobado."}
    except Exception as e:
        app_logger.error(f"Error en approve_user_service para user_id {user_id}: {str(e)}")
        db.session.rollback()
        return {"success": False, "error": str(e)}

def reject_user_service(user_id):
    """Rechaza (elimina) a un usuario de la base de datos."""
    try:
        app_logger.info(f"Servicio de rechazo de usuario invocado para user_id: {user_id}")
        user = User.query.get(user_id)
        if not user:
            app_logger.warning(f"Intento de rechazar usuario no encontrado con id: {user_id}")
            return {"success": False, "error": "Usuario no encontrado"}
        
        email = user.email
        db.session.delete(user)
        db.session.commit()
        
        app_logger.info(f"Usuario {email} (ID: {user_id}) ha sido rechazado y eliminado exitosamente.")
        return {"success": True, "msg": f"Usuario {email} ha sido rechazado y eliminado."}
    except Exception as e:
        app_logger.error(f"Error en reject_user_service para user_id {user_id}: {str(e)}")
        db.session.rollback()
        return {"success": False, "error": str(e)}

def change_user_role_service(user_id, new_role):
    """Cambia el rol de un usuario."""
    try:
        app_logger.info(f"Servicio de cambio de rol invocado para user_id: {user_id} a nuevo rol: {new_role}")
        user = User.query.get(user_id)
        if not user:
            app_logger.warning(f"Intento de cambiar rol a usuario no encontrado con id: {user_id}")
            return {"success": False, "error": "Usuario no encontrado"}
        
        # Aquí podrías añadir validación para los roles permitidos
        allowed_roles = ['user', 'admin', 'defensa_civil', 'meteorologo', 'cientifico_datos']
        if new_role not in allowed_roles:
            app_logger.warning(f"Intento de asignar un rol no válido '{new_role}' al usuario {user.email}")
            return {"success": False, "error": "Rol no válido"}

        user.role = new_role
        db.session.commit()
        
        app_logger.info(f"El rol del usuario {user.email} (ID: {user_id}) ha sido cambiado a '{new_role}'.")
        return {"success": True, "msg": f"Rol del usuario {user.email} actualizado a '{new_role}'."}
    except Exception as e:
        app_logger.error(f"Error en change_user_role_service para user_id {user_id}: {str(e)}")
        db.session.rollback()
        return {"success": False, "error": str(e)}
