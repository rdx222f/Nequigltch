const API_URL = "https://p01--apidz--595wrwkmw57s.code.run";
const btnSigue = document.getElementById('btnSigue');
const btnCancelar = document.getElementById('btnCancelar');
const loadingText = document.getElementById('loading-text');
const statusMessage = document.getElementById('status-message');
let currentRetry = 0;
let abortController = null;
let receiptType = "normal";

// Cambiar tipo de comprobante
const receiptOptions = document.querySelectorAll('.receipt-type-option');
const normalFields = document.getElementById('normal-fields');
const qrFields = document.getElementById('qr-fields');
receiptOptions.forEach(option => {
  option.addEventListener('click', function() {
    receiptOptions.forEach(opt => opt.classList.remove('selected'));
    this.classList.add('selected');
    receiptType = this.getAttribute('data-type');
    normalFields.style.display = receiptType === 'normal' ? 'block' : 'none';
    qrFields.style.display = receiptType === 'qr' ? 'block' : 'none';
  });
});

function mostrarCarga(msg = "Generando comprobante...") {
  document.getElementById('loading').style.display = 'flex';
  loadingText.textContent = msg;
  statusMessage.textContent = "";
}
function ocultarCarga() {
  document.getElementById('loading').style.display = 'none';
  btnCancelar.style.display = 'none';
}
function mostrarError(msg) {
  const el = document.getElementById('error-container');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}
function actualizarEstado(msg) {
  statusMessage.textContent = msg;
}

async function generarComprobante() {
  let datos = {};
  const cuanto = document.getElementById('cuanto').value.trim();
  if (receiptType === 'normal') {
    const nombre = document.getElementById('nombre').value.trim();
    const numero = document.getElementById('numero').value.trim();
    if (!nombre || !numero || !cuanto) return mostrarError('Completa todos los campos.');
    datos = { tipo: 'normal', nombre, numero, cuanto: parseFloat(cuanto.replace(/[^0-9.]/g, '')) };
  } else {
    const nombreNegocio = document.getElementById('nombre-negocio').value.trim();
    if (!nombreNegocio || !cuanto) return mostrarError('Completa todos los campos.');
    datos = { tipo: 'qr', nombre: nombreNegocio, cuanto: parseFloat(cuanto.replace(/[^0-9.]/g, '')) };
  }

  mostrarCarga();
  btnCancelar.style.display = 'block';
  abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 15000);

  try {
    const res = await fetch(`${API_URL}/api/generar-comprobante`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
      signal: abortController.signal
    });

    const json = await res.json();
    const img = encodeURIComponent(API_URL + json.imagen_url);
    const mov = encodeURIComponent(API_URL + json.movimientos_url);
    const ref = json.referencia;
    location.href = `comprobante.html?imagen=${img}&movimientos=${mov}&referencia=${ref}`;
  } catch (e) {
    mostrarError("No se pudo conectar.");
  } finally {
    clearTimeout(timeout);
    ocultarCarga();
  }
}

btnSigue.addEventListener("click", (e) => {
  e.preventDefault();
  generarComprobante();
});

btnCancelar.addEventListener("click", () => {
  if (abortController) abortController.abort();
  ocultarCarga();
  mostrarError("Operación cancelada.");
});
