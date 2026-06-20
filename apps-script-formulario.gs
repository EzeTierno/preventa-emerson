/**
 * Omnigro — Canopy Master PRO · Receptor de formulario de pre-venta
 * Recibe los datos del formulario de la landing y los envía por Gmail.
 *
 * Campos que llegan desde la landing: nombre, contacto, cantidad, cuando
 */

// ⬇️ PONÉ ACÁ EL GMAIL DONDE QUERÉS RECIBIR LOS LEADS
const DESTINO = 'omnigromarketing@gmail.com';

function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};

    const cuandoMap = {
      inmediato: 'De inmediato (ya tengo sala)',
      '1mes':    'En el próximo mes',
      '2a3meses':'En 2 a 3 meses',
      evaluando: 'Todavía estoy evaluando'
    };

    const fecha = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    const cuerpo =
      'Nuevo lead — Canopy Master PRO (pre-venta)\n' +
      '------------------------------------------\n\n' +
      'Nombre:               ' + (p.nombre   || '-') + '\n' +
      'WhatsApp / Email:     ' + (p.contacto || '-') + '\n' +
      'Cantidad de equipos:  ' + (p.cantidad || '-') + '\n' +
      'Cuándo compra:        ' + (cuandoMap[p.cuando] || p.cuando || '-') + '\n\n' +
      'Fecha:                ' + fecha + '\n';

    const esEmail = p.contacto && p.contacto.indexOf('@') > -1;

    MailApp.sendEmail({
      to: DESTINO,
      subject: '🌱 Nuevo lead pre-venta: ' + (p.nombre || 'sin nombre'),
      body: cuerpo,
      replyTo: esEmail ? p.contacto : DESTINO
    });

    /* OPCIONAL — guardar cada lead en una Google Sheet.
       1) Creá una planilla, copiá su ID de la URL.
       2) Descomentá las 3 líneas y reemplazá TU_SHEET_ID.
    const ss = SpreadsheetApp.openById('TU_SHEET_ID');
    const sh = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
    sh.appendRow([fecha, p.nombre, p.contacto, p.cantidad, p.cuando]);
    */

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Permite probar el deploy abriendo la URL en el navegador
function doGet() {
  return ContentService.createTextOutput('Omnigro form endpoint OK');
}
