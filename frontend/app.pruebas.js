// Paso 1: seleccionar elementos del HTML usando ID
const titulo = document.getElementById('titulo-principal');
const parrafo = document.querySelector('.parrafo');

// Paso 2: cambiar el contenido de esos elementos
titulo.textContent = '¡Hola, Nimbus con JS!';
parrafo.textContent = 'Este texto fue cambiado dinámicamente usando JavaScript.';

// Paso 3: crear un botón y agregarlo al HTML
const boton = document.createElement('button');
boton.textContent = 'Haz clic aquí';
boton.className = 'btn btn-primary mt-3'; // clase de Bootstrap
document.body.appendChild(boton);

// Paso 4: agregar un evento al botón
boton.addEventListener('click', () => {
  alert('¡Botón clickeado! Aquí podemos mostrar datos de la API más adelante.');
});
