document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('registroRifa');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var nombre = document.getElementById('nombre').value.trim();
    var correo = document.getElementById('correo').value.trim();
    var telefono = document.getElementById('telefono').value.trim();
    var premio = document.getElementById('premio').value;

    if (!nombre || !correo || !telefono || !premio) {
      alert('Por favor, completa todos los campos antes de continuar.');
      return;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      alert('Por favor, introduce un correo electrónico válido.');
      return;
    }

    var phoneRegex = /^\+?[\d\s\-().]{7,20}$/;
    if (!phoneRegex.test(telefono)) {
      alert('Por favor, introduce un número de teléfono válido.');
      return;
    }

    alert('¡Gracias por participar! Nos pondremos en contacto contigo pronto.');

    form.reset();
  });
});
