import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoUrl from '../assets/logo.png';

/**
 * Genera e imprime un comprobante PDF de venta tipo ticket de farmacia.
 * @param {object} saleData - Datos de la venta registrada.
 * @param {Array} cartItems - Items del carrito con product, quantity, subtotal.
 * @param {number} total - Total de la venta.
 */
export const generateReceipt = (saleData, cartItems, total) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 200] // Ancho de ticket térmico estándar (80mm)
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 5;
  let y = 5;

  // ─── LOGO ────────────────────────────────────────────────────────────────────
  const logoSize = 18; // Tamaño del logo en mm
  const logoX = (pageWidth - logoSize) / 2;
  doc.addImage(logoUrl, 'PNG', logoX, y, logoSize, logoSize);
  y += logoSize + 3;

  // ─── CABECERA ───────────────────────────────────────────────────────────────
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('NOVA SALUD', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Farmacia y Botica', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('RUC: 20123456789', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('Tel: (01) 234-5678', pageWidth / 2, y, { align: 'center' });
  y += 5;

  // Línea separadora
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  // ─── TIPO DE COMPROBANTE ─────────────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BOLETA DE VENTA', pageWidth / 2, y, { align: 'center' });
  y += 5;

  // ─── DATOS DE LA VENTA ───────────────────────────────────────────────────────
  const now = new Date();
  const fecha = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hora = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha : ${fecha}`, margin, y);
  y += 4;
  doc.text(`Hora  : ${hora}`, margin, y);
  y += 4;
  doc.text(`Pago  : ${saleData?.paymentMethod || 'EFECTIVO'}`.toUpperCase(), margin, y);
  y += 4;

  // Línea separadora
  doc.line(margin, y, pageWidth - margin, y);
  y += 3;

  // ─── TABLA DE PRODUCTOS ───────────────────────────────────────────────────────
  const tableBody = cartItems.map(item => [
    item.product.name.length > 22 ? item.product.name.substring(0, 22) + '.' : item.product.name,
    item.quantity.toString(),
    `S/ ${item.product.price.toFixed(2)}`,
    `S/ ${item.subtotal.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Producto', 'Cant', 'P.U.', 'Total']],
    body: tableBody,
    theme: 'plain',
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      font: 'helvetica',
      textColor: [0, 0, 0],
    },
    headStyles: {
      fontStyle: 'bold',
      fillColor: false,
      lineWidth: { bottom: 0.3 },
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: 16, halign: 'right' },
      3: { cellWidth: 16, halign: 'right' },
    },
    margin: { left: margin, right: margin },
  });

  y = doc.lastAutoTable.finalY + 2;

  // Línea separadora
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  // ─── TOTALES ─────────────────────────────────────────────────────────────────
  const subtotalSinIgv = total / 1.18;
  const igv = total - subtotalSinIgv;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Op. Gravada:', margin, y);
  doc.text(`S/ ${subtotalSinIgv.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
  y += 4;

  doc.text('IGV (18%):', margin, y);
  doc.text(`S/ ${igv.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
  y += 3;

  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', margin, y);
  doc.text(`S/ ${total.toFixed(2)}`, pageWidth - margin, y, { align: 'right' });
  y += 7;

  // ─── PIE DE PÁGINA ────────────────────────────────────────────────────────────
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;
  doc.text('¡Gracias por su compra!', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('Conserve este comprobante', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('www.novasalud.pe', pageWidth / 2, y, { align: 'center' });

  // ─── ABRIR PDF EN NUEVA PESTAÑA ───────────────────────────────────────────────
  const pdfBlob = doc.output('bloburl');
  window.open(pdfBlob, '_blank');
};
