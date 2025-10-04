
from src.database import db
from src.models.user import User
from src.services.logger import app_logger
from flask_jwt_extended import get_jwt_identity

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
                'is_suspended': user.is_suspended,
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
        current_admin_email = get_jwt_identity()
        admin_user = User.query.filter_by(email=current_admin_email).first()
        if admin_user and admin_user.id == user_id:
            return {"success": False, "error": "Un administrador no puede aprobarse a sí mismo."}

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
    """Rechaza la solicitud de un rol profesional, degradando al usuario a rol 'user'."""
    try:
        current_admin_email = get_jwt_identity()
        admin_user = User.query.filter_by(email=current_admin_email).first()
        if admin_user and admin_user.id == user_id:
            return {"success": False, "error": "Un administrador no puede rechazarse a sí mismo."}

        app_logger.info(f"Servicio de rechazo de rol invocado para user_id: {user_id}")
        user = User.query.get(user_id)
        if not user:
            app_logger.warning(f"Intento de rechazar rol a usuario no encontrado con id: {user_id}")
            return {"success": False, "error": "Usuario no encontrado"}
        
        email = user.email
        user.role = 'user'
        user.is_verified = False # Se revoca la verificación si la tuvo
        db.session.commit()
        
        app_logger.info(f"Usuario {email} (ID: {user_id}) ha sido degradado a rol 'user'.")
        return {"success": True, "msg": f"La solicitud del usuario {email} ha sido rechazada y su rol ha sido establecido como 'user'."}
    except Exception as e:
        app_logger.error(f"Error en reject_user_service para user_id {user_id}: {str(e)}")
        db.session.rollback()
        return {"success": False, "error": str(e)}

def change_user_role_service(user_id, new_role):
    """Cambia el rol de un usuario."""
    try:
        current_admin_email = get_jwt_identity()
        admin_user = User.query.filter_by(email=current_admin_email).first()
        if admin_user and admin_user.id == user_id:
            return {"success": False, "error": "Un administrador no puede cambiar su propio rol."}

        app_logger.info(f"Servicio de cambio de rol invocado para user_id: {user_id} a nuevo rol: {new_role}")
        user_to_modify = User.query.get(user_id)
        if not user_to_modify:
            app_logger.warning(f"Intento de cambiar rol a usuario no encontrado con id: {user_id}")
            return {"success": False, "error": "Usuario no encontrado"}

        # Lógica de Superadmin: Un admin no puede modificar a otro admin
        if user_to_modify.role == 'admin' and admin_user.role != 'superadmin':
            app_logger.warning(f"El admin '{admin_user.email}' intentó modificar al admin '{user_to_modify.email}' sin ser superadmin.")
            return {"success": False, "error": "Los administradores no pueden modificar a otros administradores."}

        # Aquí podrías añadir validación para los roles permitidos
        allowed_roles = ['user', 'admin', 'defensa_civil', 'meteorologo', 'cientifico_datos']
        if new_role not in allowed_roles:
            app_logger.warning(f"Intento de asignar un rol no válido '{new_role}' al usuario {user_to_modify.email}")
            return {"success": False, "error": "Rol no válido"}

        user_to_modify.role = new_role
        db.session.commit()
        
        app_logger.info(f"El rol del usuario {user_to_modify.email} (ID: {user_id}) ha sido cambiado a '{new_role}'.")
        return {"success": True, "msg": f"Rol del usuario {user_to_modify.email} actualizado a '{new_role}'."}
    except Exception as e:
        app_logger.error(f"Error en change_user_role_service para user_id {user_id}: {str(e)}")
        db.session.rollback()
        return {"success": False, "error": str(e)}

def suspend_user_service(user_id):
    """Suspende a un usuario estableciendo is_suspended a True."""
    try:
        current_admin_email = get_jwt_identity()
        admin_user = User.query.filter_by(email=current_admin_email).first()
        if admin_user and admin_user.id == user_id:
            return {"success": False, "error": "Un administrador no puede suspenderse a sí mismo."}

        user_to_suspend = User.query.get(user_id)
        if not user_to_suspend:
            app_logger.warning(f"Intento de suspender usuario no encontrado con id: {user_id}")
            return {"success": False, "error": "Usuario no encontrado"}

        # Lógica de Superadmin: Un admin no puede suspender a otro admin
        if user_to_suspend.role == 'admin' and admin_user.role != 'superadmin':
            app_logger.warning(f"El admin '{admin_user.email}' intentó suspender al admin '{user_to_suspend.email}' sin ser superadmin.")
            return {"success": False, "error": "Los administradores no pueden suspender a otros administradores."}

        app_logger.info(f"Servicio de suspensión de usuario invocado para user_id: {user_id}")
        user_to_suspend.is_suspended = True
        db.session.commit()
        
        app_logger.info(f"Usuario {user_to_suspend.email} (ID: {user_id}) ha sido suspendido exitosamente.")
        return {"success": True, "msg": f"Usuario {user_to_suspend.email} ha sido suspendido."}
    except Exception as e:
        app_logger.error(f"Error en suspend_user_service para user_id {user_id}: {str(e)}")
        db.session.rollback()
        return {"success": False, "error": str(e)}

def unban_user_service(user_id):
    """Levanta la suspensión de un usuario estableciendo is_suspended a False."""
    try:
        current_admin_email = get_jwt_identity()
        admin_user = User.query.filter_by(email=current_admin_email).first()
        if admin_user and admin_user.id == user_id:
            return {"success": False, "error": "Un administrador no puede quitarse la suspensión a sí mismo."}

        user_to_unban = User.query.get(user_id)
        if not user_to_unban:
            app_logger.warning(f"Intento de anular suspensión a usuario no encontrado con id: {user_id}")
            return {"success": False, "error": "Usuario no encontrado"}

        # Lógica de Superadmin: Un admin no puede quitar suspensión a otro admin
        if user_to_unban.role == 'admin' and admin_user.role != 'superadmin':
            app_logger.warning(f"El admin '{admin_user.email}' intentó quitar la suspensión al admin '{user_to_unban.email}' sin ser superadmin.")
            return {"success": False, "error": "Los administradores no pueden modificar a otros administradores."}

        app_logger.info(f"Servicio de anulación de suspensión invocado para user_id: {user_id}")
        user_to_unban.is_suspended = False
        db.session.commit()
        
        app_logger.info(f"La suspensión del usuario {user_to_unban.email} (ID: {user_id}) ha sido levantada.")
        return {"success": True, "msg": f"La suspensión de {user_to_unban.email} ha sido levantada."}
    except Exception as e:
        app_logger.error(f"Error en unban_user_service para user_id {user_id}: {str(e)}")
        db.session.rollback()
        return {"success": False, "error": str(e)}
