from src.database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'user'  # Forzar el nombre de la tabla
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(80), nullable=False, default='user')
    is_verified = db.Column(db.Boolean, default=False)
    verification_code = db.Column(db.String(6), nullable=True)
    
    # Campos para Defensa Civil
    institution = db.Column(db.String(200), nullable=True)
    employee_id = db.Column(db.String(50), nullable=True)
    institutional_email = db.Column(db.String(120), nullable=True)
    
    # Campos para Meteorólogo
    license_number = db.Column(db.String(50), nullable=True)
    workplace = db.Column(db.String(200), nullable=True)
    linkedin_profile = db.Column(db.String(255), nullable=True)
    
    # Campos para Científico de Datos
    organization = db.Column(db.String(200), nullable=True)
    github_profile = db.Column(db.String(255), nullable=True)
    interest_description = db.Column(db.Text, nullable=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.email}>'