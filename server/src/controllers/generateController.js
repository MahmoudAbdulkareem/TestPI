const ExcelJS = require('exceljs');
const PdfPrinter = require('pdfmake');

const generateExcel = async (req, res) => {
  try {
    const transactions = req.body.transactions || [];
    if (!transactions.length) {
      return res.status(400).json({ message: "No transactions to export." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Recent Transactions');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15, style: { alignment: { horizontal: 'center' } } },
      { header: 'Category', key: 'category', width: 20, style: { alignment: { horizontal: 'left' } } },
      { header: 'Amount (TND)', key: 'amount', width: 15, style: { alignment: { horizontal: 'right' } } },
      { header: 'Bank Account', key: 'bankAccount', width: 25, style: { alignment: { horizontal: 'left' } } },
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF007ACC' }, 
    };
    

    transactions.forEach(tx => {
      worksheet.addRow({
        date: tx.date ? new Date(tx.date) : 'N/A',
        category: tx.type || 'N/A',
        amount: tx.amount || 0,
        bankAccount: tx.compteBancaire || 'N/A',
      });
    });

    worksheet.eachRow({ includeEmpty: false }, row => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (cell._column.key === 'amount') {
          cell.numFmt = '#,##0.00 [$TND]';
        }
        if (cell._column.key === 'date') {
          cell.numFmt = 'dd/mm/yyyy';
        }
      });
    });

    worksheet.addRow([]);


    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Transactions.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel Export Error:", error);
    res.status(500).json({ message: "Error generating Excel file", error });
  }
};


const generatePDF = async (req, res) => {
  try {
    const transactions = req.body.transactions || [];
    if (!transactions.length) {
      return res.status(400).json({ message: "No transactions to export." });
    }

    const printer = new PdfPrinter({
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
      },
    });

    const body = [
      [
        { text: 'Date', style: 'tableHeader' },
        { text: 'Category', style: 'tableHeader' },
        { text: 'Amount (TND)', style: 'tableHeader' },
        { text: 'Bank Account', style: 'tableHeader' },
      ],
      ...transactions.map(tx => [
        { text: tx.date ? new Date(tx.date).toLocaleDateString() : 'N/A' },
        { text: tx.type || 'N/A' },
        { text: `${tx.amount?.toFixed(2) ?? '0.00'} TND`, alignment: 'right' },
        { text: tx.compteBancaire || 'N/A' },
      ])
    ];

    const docDefinition = {
      content: [
        { text: 'Recent Transactions Report', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['20%', '25%', '20%', '35%'],
            body,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? '#007ACC' : null),
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
          },
        },
        {
          text: `\nGenerated on: ${new Date().toLocaleString()}`,
          style: 'footer',
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 20],
          alignment: 'center',
        },
        tableHeader: {
          bold: true,
          color: 'white',
          fillColor: '#007ACC',
        },
        footer: {
          fontSize: 10,
          alignment: 'right',
          margin: [0, 30, 0, 0],
        },
      },
      defaultStyle: {
        fontSize: 11,
      },
      pageMargins: [40, 60, 40, 60],
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Transactions.pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("PDF Export Error:", error);
    res.status(500).json({ message: "Error generating PDF file", error });
  }
};


module.exports = { generateExcel, generatePDF };
