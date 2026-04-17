document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     CONFIGURATION
  ============================================================ */
  var FECHA_SORTEO = new Date('2026-05-15T20:00:00');  // ← Cambia esta fecha
  var PRECIO_BOLETO = 5;
  var TOTAL_BOLETOS = 100;
  // Boletos ya vendidos (números del 1 al 100). Actualiza este arreglo
  // con los boletos que ya tienen dueño.
  var BOLETOS_VENDIDOS = [3, 7, 12, 18, 22, 25, 34, 41, 50, 57, 63, 71, 80, 88, 95];

  /* ============================================================
     COUNTDOWN
  ============================================================ */
  function actualizarContador() {
    var ahora = new Date();
    var diferencia = FECHA_SORTEO - ahora;

    if (diferencia <= 0) {
      document.getElementById('cd-dias').textContent = '00';
      document.getElementById('cd-horas').textContent = '00';
      document.getElementById('cd-minutos').textContent = '00';
      document.getElementById('cd-segundos').textContent = '00';
      return;
    }

    var dias     = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    var horas    = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutos  = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    var segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    document.getElementById('cd-dias').textContent     = String(dias).padStart(2, '0');
    document.getElementById('cd-horas').textContent    = String(horas).padStart(2, '0');
    document.getElementById('cd-minutos').textContent  = String(minutos).padStart(2, '0');
    document.getElementById('cd-segundos').textContent = String(segundos).padStart(2, '0');
  }

  actualizarContador();
  setInterval(actualizarContador, 1000);

  /* ============================================================
     FECHA SORTEO LEGIBLE
  ============================================================ */
  var opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  var fechaTexto = FECHA_SORTEO.toLocaleDateString('es-ES', opcionesFecha);
  var elFechaTexto = document.getElementById('fecha-sorteo-texto');
  if (elFechaTexto) elFechaTexto.textContent = fechaTexto;

  /* ============================================================
     AÑO ACTUAL EN EL FOOTER
  ============================================================ */
  var elAnio = document.getElementById('anio-actual');
  if (elAnio) elAnio.textContent = new Date().getFullYear();

  /* ============================================================
     BARRA DE PROGRESO
  ============================================================ */
  var vendidos    = BOLETOS_VENDIDOS.length;
  var porcentaje  = Math.round((vendidos / TOTAL_BOLETOS) * 100);

  var elVendidosNum = document.getElementById('vendidos-num');
  var elTotalNum    = document.getElementById('total-num');
  var elBarra       = document.getElementById('barra-progreso');
  var elPie         = document.getElementById('progreso-pie');

  if (elVendidosNum) elVendidosNum.textContent = vendidos;
  if (elTotalNum)    elTotalNum.textContent    = TOTAL_BOLETOS;
  if (elPie)         elPie.textContent         = '¡Solo quedan ' + (TOTAL_BOLETOS - vendidos) + ' boletos disponibles!';

  // Animar la barra al cargar
  setTimeout(function () {
    if (elBarra) elBarra.style.width = porcentaje + '%';
  }, 300);

  /* ============================================================
     GRID DE BOLETOS
  ============================================================ */
  var grid = document.getElementById('grid-boletos');
  var boletosBtnEl = {};
  var seleccionados = [];

  if (grid) {
    for (var i = 1; i <= TOTAL_BOLETOS; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'boleto-num';
      btn.textContent = String(i).padStart(2, '0');
      btn.dataset.num = i;

      if (BOLETOS_VENDIDOS.indexOf(i) !== -1) {
        btn.classList.add('vendido');
        btn.disabled = true;
        btn.title = 'Boleto vendido';
      } else {
        btn.addEventListener('click', toggleBoleto);
        btn.title = 'Boleto #' + String(i).padStart(2, '0') + ' \u2014 disponible';
      }

      grid.appendChild(btn);
      boletosBtnEl[i] = btn;
    }
  }

  function toggleBoleto(e) {
    var num = parseInt(e.currentTarget.dataset.num, 10);
    var idx = seleccionados.indexOf(num);

    if (idx === -1) {
      seleccionados.push(num);
      e.currentTarget.classList.add('seleccionado');
    } else {
      seleccionados.splice(idx, 1);
      e.currentTarget.classList.remove('seleccionado');
    }

    actualizarSeleccion();
  }

  function actualizarSeleccion() {
    var count = seleccionados.length;
    var total = count * PRECIO_BOLETO;

    var elSel   = document.getElementById('stat-seleccionados');
    var elDisp  = document.getElementById('stat-disponibles');
    var elVend  = document.getElementById('stat-vendidos');
    var elTot   = document.getElementById('stat-total');
    var elTexto = document.getElementById('seleccionados-texto');
    var elCampo = document.getElementById('boletos-seleccionados-campo');

    if (elSel)  elSel.textContent  = count;
    if (elDisp) elDisp.textContent = TOTAL_BOLETOS - BOLETOS_VENDIDOS.length - count;
    if (elVend) elVend.textContent = BOLETOS_VENDIDOS.length;
    if (elTot)  elTot.textContent  = '$' + total;

    var nums = seleccionados.slice().sort(function (a, b) { return a - b; });
    var numsStr = nums.map(function (n) { return '#' + String(n).padStart(2, '0'); }).join(', ');

    if (elTexto) {
      if (count === 0) {
        elTexto.innerHTML = '';
      } else {
        elTexto.innerHTML = 'Has seleccionado <strong>' + count + '</strong> boleto(s): ' + numsStr +
          ' \u2014 Total: <strong>$' + total + '</strong>';
      }
    }

    if (elCampo) {
      elCampo.textContent = count === 0
        ? 'Ninguno \u2014 elige tus n\u00fameros arriba'
        : numsStr + '  (Total: $' + total + ')';
    }
  }

  // Inicializar stats
  actualizarSeleccion();

  /* ============================================================
     FORMULARIO
  ============================================================ */
  var form = document.getElementById('registroRifa');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nombre   = document.getElementById('nombre').value.trim();
      var correo   = document.getElementById('correo').value.trim();
      var telefono = document.getElementById('telefono').value.trim();
      var metodo   = document.getElementById('metodo-pago').value;

      if (!nombre || !correo || !telefono || !metodo) {
        alert('Por favor, completa todos los campos obligatorios antes de continuar.');
        return;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        alert('Por favor, introduce un correo electrónico válido.');
        return;
      }

      var phoneRegex = /^\+?[\d\s\-().]{7,20}$/;
      if (!phoneRegex.test(telefono)) {
        alert('Por favor, introduce un número de teléfono/WhatsApp válido.');
        return;
      }

      if (seleccionados.length === 0) {
        alert('Por favor, selecciona al menos un boleto en la cuadrícula antes de continuar.');
        return;
      }

      var nums = seleccionados.slice().sort(function (a, b) { return a - b; });
      var numsStr = nums.map(function (n) { return '#' + String(n).padStart(2, '0'); }).join(', ');
      var total = seleccionados.length * PRECIO_BOLETO;

      var mensaje = '\u2705 \u00a1Reserva recibida!\n\n' +
        'Nombre: ' + nombre + '\n' +
        'Boletos: ' + numsStr + '\n' +
        'Total a pagar: $' + total + '\n\n' +
        'Por favor env\u00edanos tu comprobante de pago por WhatsApp para confirmar tu participaci\u00f3n. \u00a1Buena suerte!';

      alert(mensaje);

      // Limpiar selección visual
      seleccionados.forEach(function (num) {
        if (boletosBtnEl[num]) boletosBtnEl[num].classList.remove('seleccionado');
      });
      seleccionados = [];
      actualizarSeleccion();
      form.reset();
    });
  }

});
