import matplotlib.pyplot as plt
import numpy as np
import os

# Definir la paleta y el rango de valores
palette = 'inferno'
vmin, vmax = -80, 40 # Rango en Celsius para la banda 13

# Crear una figura y un eje
fig, ax = plt.subplots(figsize=(1, 5), dpi=100) # Figura delgada y alta

# Crear un gradiente de colores
cmap = plt.get_cmap(palette)
norm = plt.Normalize(vmin=vmin, vmax=vmax)

cb = plt.colorbar(plt.cm.ScalarMappable(cmap=cmap, norm=norm), cax=ax)
cb.set_label('Temperatura (°C)', rotation=270, labelpad=15)

# Guardar la leyenda
output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'src', 'static', 'radar_images', 'inferno_legend.png'))
plt.savefig(output_path, bbox_inches='tight', transparent=True)
plt.close(fig)

print(f"Leyenda 'inferno' generada en: {output_path}")
