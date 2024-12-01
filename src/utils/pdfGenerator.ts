import { jsPDF } from 'jspdf';

interface PDFConfig {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  qrSize: number;
  spacing: number;
  codesPerRow: number;
  codesPerPage: number;
}

const config: PDFConfig = {
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  margin: 20,
  qrSize: 30,
  spacing: 15,
  codesPerRow: 4,
  codesPerPage: 20 // Limit to 20 QR codes per page
};

function addHeaderToPage(pdf: jsPDF) {
  // Add Enquesta.cat text
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(37, 99, 235); // Blue color
  pdf.text('Enquesta.cat', config.margin, config.margin + 8);

  // Add separator line
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.5);
  pdf.line(config.margin, config.margin + 15, config.pageWidth - config.margin, config.margin + 15);
}

export async function generateVoteCodesPDF(
  codes: string[],
  pollId: string,
  qrRefs: { [key: string]: HTMLDivElement | null }
) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set default font to a sans-serif font
  pdf.setFont('helvetica');

  // Add header to first page
  addHeaderToPage(pdf);

  // Calculate layout
  const usableWidth = config.pageWidth - (2 * config.margin);
  const columnWidth = usableWidth / config.codesPerRow;
  const rowsPerPage = Math.floor(config.codesPerPage / config.codesPerRow);
  const startY = config.margin + 25;

  // Reset text color for codes
  pdf.setTextColor(0, 0, 0);

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const pageIndex = Math.floor(i / config.codesPerPage);
    const positionOnPage = i % config.codesPerPage;
    const row = Math.floor(positionOnPage / config.codesPerRow);
    const col = positionOnPage % config.codesPerRow;

    if (i > 0 && positionOnPage === 0) {
      pdf.addPage();
      addHeaderToPage(pdf);
    }

    const xPos = config.margin + (col * columnWidth) + (columnWidth - config.qrSize) / 2;
    const yPos = startY + (row * (config.qrSize + config.spacing));

    await processQRCode(pdf, code, qrRefs[code], xPos, yPos);
  }

  // Add footer to all pages
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text(
      'Desenvolupat per Nuvol.cat',
      config.pageWidth / 2,
      config.pageHeight - 10,
      { align: 'center' }
    );
  }

  pdf.save(`codis-votacio-${pollId}.pdf`);
}

async function processQRCode(
  pdf: jsPDF,
  code: string,
  qrContainer: HTMLDivElement | null,
  xPos: number,
  yPos: number
): Promise<void> {
  if (!qrContainer) return;

  const svgElement = qrContainer.querySelector('svg');
  if (!svgElement) return;

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          xPos,
          yPos,
          config.qrSize,
          config.qrSize
        );

        // Add code text below QR
        pdf.setFontSize(10);
        const textWidth = pdf.getStringUnitWidth(code) * 10 / pdf.internal.scaleFactor;
        const textXPos = xPos + (config.qrSize - textWidth) / 2;
        pdf.text(code, textXPos, yPos + config.qrSize + 5);
      }
      resolve();
    };
    img.src = URL.createObjectURL(svgBlob);
  });
}