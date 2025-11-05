from src.database import db

class SystemSetting(db.Model):
    __tablename__ = 'system_setting'
    
    key = db.Column(db.String(50), primary_key=True)
    value = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f'<SystemSetting {self.key}={self.value}>'
