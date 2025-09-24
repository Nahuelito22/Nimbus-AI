import os
from dotenv import load_dotenv


# Cargar variables del archivo .env
load_dotenv()

class Config:
    OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
    NEWSDATA_API_KEY = os.getenv('NEWSDATA_API_KEY')
    
    # Ciudades de Mendoza que vamos a monitorear
    CITIES = {
        "mendoza": {"id": 3844421, "name": "Mendoza"},
        "san_rafael": {"id": 3836669, "name": "San Rafael"},
        "tunuyan": {"id": 3833520, "name": "Tunuyán"},
        "malargue": {"id": 3845181, "name": "Malargüe"},
        "las_heras": {"id": 3848354, "name": "Las Heras"},  
        "rivadavia": {"id": 3838759, "name": "Rivadavia"} 
    }
    
    NEWSDATA_URL = "https://newsdata.io/api/1/news"