from fpdf import FPDF
from datetime import datetime
import io
import os

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Reporte Meteorológico - Nimbus AI', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Página {self.page_no()}', 0, 0, 'C')

def generate_report_pdf(weather_data, image_path):
    """
    Genera un reporte en PDF con datos meteorológicos y una imagen satelital.

    :param weather_data: Diccionario con los datos del clima.
    :param image_path: Ruta al archivo de la imagen satelital.
    :return: El contenido del PDF en bytes.
    """
    pdf = PDF()
    pdf.add_page()
    pdf.set_font('Arial', '', 12)
    
    # --- Título y Metadatos ---
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, f"Reporte para Ubicación ({weather_data.get('latitude', 'N/A'):.4f}, {weather_data.get('longitude', 'N/A'):.4f})", 0, 1, 'L')
    pdf.set_font('Arial', '', 10)
    pdf.cell(0, 8, f"Fecha de Generación: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC", 0, 1, 'L')
    pdf.ln(10)

    # --- Sección de Imagen Satelital ---
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Imagen Satelital (Banda 13)', 0, 1, 'L')
    if image_path and os.path.exists(image_path):
        pdf.image(image_path, x=pdf.get_x(), y=pdf.get_y(), w=180)
        pdf.ln(125) # Ajustar el espacio después de la imagen
    else:
        pdf.set_font('Arial', 'I', 10)
        pdf.cell(0, 10, 'No se pudo generar o encontrar la imagen satelital.', 0, 1, 'L')
        pdf.ln(5)

    # --- Sección de Datos Diarios ---
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Resumen de Datos Diarios', 0, 1, 'L')
    pdf.set_font('Arial', '', 10)
    
    daily_data = weather_data.get('daily', {})
    if daily_data:
        for key, value in daily_data.items():
            # Formatear el valor si es una lista
            display_value = str(value[0]) if isinstance(value, list) and value else str(value)
            pdf.cell(0, 8, f"- {key.replace('_', ' ').title()}: {display_value}", 0, 1, 'L')
    else:
        pdf.cell(0, 8, 'No hay datos diarios disponibles.', 0, 1, 'L')
    
    pdf.ln(10)

    # --- Sección de Datos Horarios (muestra) ---
    pdf.add_page()
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Muestra de Datos por Hora (primeras 6 horas)', 0, 1, 'L')
    pdf.set_font('Arial', '', 10)

    hourly_data = weather_data.get('hourly', {})
    if hourly_data and 'time' in hourly_data:
        # Encabezados de la tabla
        pdf.set_font('Arial', 'B', 9)
        pdf.cell(40, 8, 'Hora', 1, 0, 'C')
        pdf.cell(50, 8, 'Temperatura (C)', 1, 0, 'C')
        pdf.cell(50, 8, 'Humedad Relativa (%)', 1, 0, 'C')
        pdf.cell(50, 8, 'Presión (hPa)', 1, 1, 'C')

        # Contenido de la tabla
        pdf.set_font('Arial', '', 9)
        limit = min(6, len(hourly_data['time']))
        for i in range(limit):
            time_str = hourly_data['time'][i].split('T')[1]
            temp = hourly_data.get('temperature_2m', ['N/A'])[i]
            humidity = hourly_data.get('relative_humidity_2m', ['N/A'])[i]
            pressure = hourly_data.get('pressure_msl', ['N/A'])[i]
            
            pdf.cell(40, 8, str(time_str), 1, 0, 'C')
            pdf.cell(50, 8, str(temp), 1, 0, 'C')
            pdf.cell(50, 8, str(humidity), 1, 0, 'C')
            pdf.cell(50, 8, str(pressure), 1, 1, 'C')
    else:
        pdf.cell(0, 8, 'No hay datos horarios disponibles.', 0, 1, 'L')

    # --- Guardar el PDF en memoria ---
    pdf_buffer = io.BytesIO()
    pdf.output(pdf_buffer)
    pdf_buffer.seek(0)
    
    return pdf_buffer.getvalue()
