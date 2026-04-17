document.getElementById('registroRifa').addEventListener('submit', function (event) {
  event.preventDefault();

  var nombre = document.getElementById('nombre').value.trim();
  var correo = document.getElementById('correo').value.trim();
  var telefono = document.getElementById('telefono').value.trim();
  var premio = document.getElementById('premio').value;

  if (!nombre || !correo || !telefono || !premio) {
    alert('Por favor, completa todos los campos antes de continuar.');
    return;
  }

  alert('¡Gracias por participar! Nos pondremos en contacto contigo pronto.');

  this.reset();
});
