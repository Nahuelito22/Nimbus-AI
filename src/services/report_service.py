from fpdf import FPDF
from datetime import datetime
import io
import os

# --- Colores y Fuentes (Mantenemos los originales) ---
NIMBUS_BLUE = (37, 99, 235)
HEADER_GRAY = (243, 244, 246)
# Un gris más claro para filas alternas, mejora la legibilidad
ALTERNATE_ROW_GRAY = (249, 250, 251) 

class PDF(FPDF):
    def __init__(self):
        super().__init__()
        # --- CAMBIO: Márgenes más generosos para un look más limpio ---
        self.set_margins(15, 20, 15) # Izquierdo, Superior, Derecho

    def header(self):
        # --- CAMBIO: Header más moderno y centrado ---
        self.set_font('Helvetica', 'B', 20) # Usamos Helvetica, se ve más limpia
        self.set_text_color(*NIMBUS_BLUE)
        self.cell(0, 15, 'Reporte Meteorológico - Nimbus AI', 0, 1, 'C') # Título centrado
        self.set_text_color(0, 0, 0)
        self.ln(10) # Espacio después del header

    def footer(self):
        self.set_y(-15)
        # --- CAMBIO: Añadimos una línea superior para separar el contenido ---
        self.set_draw_color(200, 200, 200)
        self.line(15, self.y, self.w - 15, self.y)
        
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Página {self.page_no()}', 0, 0, 'C')

    def section_title(self, title):
        # --- CAMBIO: Títulos de sección más destacados ---
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(*NIMBUS_BLUE)
        self.cell(0, 12, title, 0, 1, 'L')
        self.set_text_color(0, 0, 0)
        self.ln(5) # Un poco más de espacio después del título

def generate_report_pdf(weather_data, image_path):
    pdf = PDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=25)
    
    # --- Título y Metadatos ---
    pdf.set_font('Helvetica', 'B', 16)
    pdf.cell(0, 10, f"Reporte para Ubicación ({weather_data.get('latitude', 'N/A'):.4f}, {weather_data.get('longitude', 'N/A'):.4f})", 0, 1, 'C')
    pdf.set_font('Helvetica', '', 11)
    pdf.cell(0, 8, f"Fecha de Generación: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC", 0, 1, 'C')
    pdf.ln(15)

    # --- Sección de Imagen Satelital ---
    pdf.section_title('Imagen Satelital (Banda 13)')
    if image_path and os.path.exists(image_path):
        pdf.set_draw_color(150, 150, 150)
        x_center = (pdf.w - pdf.l_margin - pdf.r_margin) / 2 + pdf.l_margin
        img_width = 180
        try:
            from PIL import Image
            with Image.open(image_path) as img:
                w, h = img.size
            aspect_ratio = h / w
            img_height = img_width * aspect_ratio
            pdf.image(image_path, x=x_center - img_width/2, y=pdf.get_y(), w=img_width)
            pdf.ln(img_height + 10)
        except Exception:
            pdf.image(image_path, x=x_center - img_width/2, y=pdf.get_y(), w=img_width)
            pdf.ln(130)
    else:
        pdf.set_font('Helvetica', 'I', 10)
        pdf.cell(0, 10, 'No se pudo generar o encontrar la imagen satelital.', 0, 1, 'L')
        pdf.ln(5)

        # --- Sección de Datos Diarios (CORREGIDO Y SIMPLIFICADO) ---
    daily_data = weather_data.get('daily', {})
    if daily_data:
        # --- CORRECCIÓN: Calcular la altura total de la sección antes de dibujarla ---
        items = list(daily_data.items())
        num_rows = (len(items) + 1) // 2
        row_height = 9
        section_title_height = 12 + 5
        table_height = num_rows * row_height
        total_section_height = section_title_height + table_height + 15

        # Verificar si la sección cabe en la página actual
        if pdf.get_y() + total_section_height > pdf.page_break_trigger:
            pdf.add_page()

        # Ahora dibujamos la sección con la seguridad de que no se cortará
        pdf.section_title('Resumen de Datos Diarios')
        
        # --- NUEVA LÓGICA: Definimos los anchos aquí para que sea fácil modificarlos ---
        label_width = 65  # Ancho para la etiqueta (ej: "Time:")
        value_width = 25  # Ancho para el valor (ej: "2025-10-25")
        space_between_columns = 15 # <--- AQUÍ CONTROLAS EL ESPACIO ENTRE COLUMNAS
        
        # Calculamos la posición X de la segunda columna
        col1_x = pdf.l_margin
        col2_x = col1_x + label_width + value_width + space_between_columns

        is_fill = False
        for i in range(0, len(items), 2):
            y_start = pdf.get_y() # Guardamos la posición Y de la fila
            
            # Color de fondo para la fila
            pdf.set_fill_color(*ALTERNATE_ROW_GRAY) if is_fill else pdf.set_fill_color(255, 255, 255)

            # --- Dibujamos la Primera Columna (Etiqueta + Valor) ---
            pdf.set_font('Helvetica', 'B', 10)
            pdf.set_xy(col1_x, y_start) # Posicionamos el cursor
            pdf.cell(label_width, row_height, f"{items[i][0].replace('_', ' ').title()}:", 0, 0, 'L', fill=is_fill)
            pdf.set_font('Helvetica', '', 10)
            display_value1 = str(items[i][1][0]) if isinstance(items[i][1], list) and items[i][1] else str(items[i][1])
            pdf.cell(value_width, row_height, display_value1, 0, 0, 'L', fill=is_fill)

            # --- Dibujamos la Segunda Columna (si existe) ---
            if i + 1 < len(items):
                pdf.set_font('Helvetica', 'B', 10)
                pdf.set_xy(col2_x, y_start) # Reposicionamos el cursor para la segunda columna
                pdf.cell(label_width, row_height, f"{items[i+1][0].replace('_', ' ').title()}:", 0, 0, 'L', fill=is_fill)
                pdf.set_font('Helvetica', '', 10)
                display_value2 = str(items[i+1][1][0]) if isinstance(items[i+1][1], list) and items[i+1][1] else str(items[i+1][1])
                pdf.cell(value_width, row_height, display_value2, 0, 0, 'L', fill=is_fill)
            
            # Movemos el cursor hacia abajo para la siguiente fila
            pdf.set_y(y_start + row_height)
            is_fill = not is_fill
            
        pdf.ln(15) # Espacio final de la sección
    else:
        pdf.cell(0, 8, 'No hay datos diarios disponibles.', 0, 1, 'L')
        pdf.ln(15)

    # --- Sección de Datos Horarios ---
    # Esta sección ya está en una nueva página, pero añadimos la misma lógica por si acaso
    hourly_data = weather_data.get('hourly', {})
    if hourly_data:
        # Calcular altura de la tabla horaria
        headers = ['Hora', 'Temp. (C)', 'Humedad Rel. (%)', 'Presión (hPa)', 'Punto de Rocío (C)']
        row_height = 10
        limit = min(12, len(hourly_data['time']))
        section_title_height = 12 + 5
        header_height = row_height + 3 # Altura del encabezado + línea separadora
        table_height = limit * row_height
        total_section_height = section_title_height + header_height + table_height

        if pdf.get_y() + total_section_height > pdf.page_break_trigger:
            pdf.add_page()

        pdf.section_title('Muestra de Datos por Hora (primeras 12 horas)')
        
        widths = [35, 35, 40, 40, 40]

        def draw_table_header():
            pdf.set_font('Helvetica', 'B', 10)
            pdf.set_fill_color(*HEADER_GRAY)
            pdf.set_text_color(0, 0, 0)
            for i, header in enumerate(headers):
                pdf.cell(widths[i], row_height, header, 0, 0, 'C', fill=True)
            pdf.ln(row_height)
            pdf.set_draw_color(*HEADER_GRAY)
            pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
            pdf.ln(3)
            pdf.set_font('Helvetica', '', 9)

        draw_table_header()

        for i in range(limit):
            if pdf.get_y() + row_height > pdf.page_break_trigger:
                pdf.add_page()
                draw_table_header()

            is_fill = i % 2 == 0
            pdf.set_fill_color(*ALTERNATE_ROW_GRAY) if is_fill else pdf.set_fill_color(255, 255, 255)
            
            time_str = hourly_data['time'][i].split('T')[1]
            temp = hourly_data.get('temperature_2m', ['N/A'])[i]
            humidity = hourly_data.get('relative_humidity_2m', ['N/A'])[i]
            pressure = hourly_data.get('pressure_msl', ['N/A'])[i]
            dew_point = hourly_data.get('dew_point_2m', ['N/A'])[i]
            
            pdf.set_x(pdf.l_margin)
            pdf.cell(widths[0], row_height, str(time_str), 0, 0, 'C', fill=is_fill)
            pdf.cell(widths[1], row_height, str(temp), 0, 0, 'C', fill=is_fill)
            pdf.cell(widths[2], row_height, str(humidity), 0, 0, 'C', fill=is_fill)
            pdf.cell(widths[3], row_height, str(pressure), 0, 0, 'C', fill=is_fill)
            pdf.cell(widths[4], row_height, str(dew_point), 0, 1, 'C', fill=is_fill)
    else:
        pdf.cell(0, 8, 'No hay datos horarios disponibles.', 0, 1, 'L')

    # --- Guardar en memoria ---
    pdf_buffer = io.BytesIO()
    pdf.output(pdf_buffer)
    pdf_buffer.seek(0)
    return pdf_buffer.getvalue()