import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { companyInfo } from '../data/company';

export async function generateExcelInvoice({ invoiceData, items, headerImage, signatureImage }) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Invoice');

    // --- 1. CONFIGURATION ---
    const taxRate = 0.18;
    const isIGST = invoiceData.taxMode === 'IGST';

    sheet.columns = [
        { key: 'sn', width: 6, style: { font: { name: 'Calibri', size: 10 } } },
        { key: 'desc', width: 45, style: { font: { name: 'Calibri', size: 10 }, alignment: { wrapText: true } } },
        { key: 'hsn', width: 15, style: { font: { name: 'Calibri', size: 10 }, alignment: { horizontal: 'center' } } },
        { key: 'qty', width: 10, style: { font: { name: 'Calibri', size: 10 }, alignment: { horizontal: 'center' } } },
        { key: 'basic', width: 15, style: { font: { name: 'Calibri', size: 10 }, numFmt: '#,##0.00', alignment: { horizontal: 'right' } } },
        { key: 'afterDisc', width: 15, style: { font: { name: 'Calibri', size: 10 }, numFmt: '#,##0.00', alignment: { horizontal: 'right' } } },
        { key: 'grandTotal', width: 25, style: { font: { name: 'Calibri', size: 10 }, numFmt: '#,##0.00', alignment: { horizontal: 'right' } } },
        { key: 'taxable', width: 0, hidden: true }
    ];

    // --- 2. HEADER SECTION (UNIFIED MERGED BLOCK) ---
    const headerEndRow = 5;
    sheet.mergeCells(`A1:G${headerEndRow}`);
    const r1 = sheet.getCell('A1');
    r1.value = {
        richText: [
            { font: { name: 'Calibri', size: 26, bold: true, color: { argb: 'FFFF0000' } }, text: "RAEMA STAR SOLAR PRIVATE LIMITED\n" },
            { font: { name: 'Calibri', size: 10, color: { argb: 'FF000000' } }, text: "K-7, LEELA HOMES, PLOT NO. 23, SECTOR-4, VAISHALI, GHAZIABAD 201 010 NCR India.\n" },
            { font: { name: 'Calibri', size: 10, color: { argb: 'FF000000' } }, text: "TEL NO. : 0120-4523496, +91 995 8469 555, WebPage : www.raemasolar.com, manish@raemasolar.com\n" },
            { font: { name: 'Calibri', size: 10, color: { argb: 'FF000000' } }, text: "CIN: U74999UP2017PTC098649, PAN: AAICR6230L, GSTIN : 09AAICR6230L1ZO" }
        ]
    };
    r1.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Set row heights to ensure everything fits (5 rows * 18 = 90px total)
    for (let i = 1; i <= headerEndRow; i++) {
        sheet.getRow(i).height = 18;
    }

    if (headerImage) {
        const imageId = workbook.addImage({
            base64: headerImage,
            extension: 'png',
        });

        // Position logo at top-left inside A1 with explicit dimensions to preserve aspect ratio
        sheet.addImage(imageId, {
            tl: { col: 0.1, row: 0.2 }, // A1 with small padding
            ext: { width: 140, height: 75 } // Absolute pixels fixed size
        });
    }

    const contentStartRow = headerEndRow + 1;


    const refRow = contentStartRow;

    sheet.mergeCells(`A${refRow}:C${refRow}`);
    sheet.getCell(`A${refRow}`).value = `INVOICE REFN : PI/RSSPL/2025-26/${invoiceData.invoiceNo || '001'}`;
    sheet.getCell(`A${refRow}`).font = { bold: true, size: 10 };
    sheet.getCell(`A${refRow}`).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

    sheet.mergeCells(`D${refRow}:G${refRow}`);
    sheet.getCell(`D${refRow}`).value = `ORDER REFRN .: DT. ${invoiceData.date}`;
    sheet.getCell(`D${refRow}`).font = { bold: true, size: 10 };
    sheet.getCell(`D${refRow}`).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

    // Contact Person
    const contactRow = refRow + 1;
    sheet.mergeCells(`A${contactRow}:G${contactRow}`);
    sheet.getCell(`A${contactRow}`).value = `CONTACT PERSON : ${invoiceData.contactPerson}, M-${invoiceData.clientPhone}`;
    sheet.getCell(`A${contactRow}`).font = { bold: true, size: 10 };
    sheet.getCell(`A${contactRow}`).alignment = { vertical: 'middle' };
    sheet.getCell(`A${contactRow}`).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

    // Address Block
    const addrRow = contactRow + 1;
    const endAddrRow = addrRow + 4; // 5 rows

    sheet.mergeCells(`A${addrRow}:C${addrRow}`);
    sheet.getCell(`A${addrRow}`).value = "BILL TO";
    sheet.getCell(`A${addrRow}`).font = { bold: true, size: 10 };

    sheet.mergeCells(`A${addrRow + 1}:C${endAddrRow}`);
    sheet.getCell(`A${addrRow + 1}`).value = (invoiceData.clientAddress || '').toUpperCase();
    sheet.getCell(`A${addrRow + 1}`).alignment = { vertical: 'top', wrapText: true };
    sheet.getCell(`A${addrRow + 1}`).font = { bold: true, size: 10 };

    sheet.mergeCells(`D${addrRow}:G${addrRow}`);
    sheet.getCell(`D${addrRow}`).value = "SHIP TO";
    sheet.getCell(`D${addrRow}`).font = { bold: true, size: 10 };

    sheet.getCell(`D${addrRow + 1}`).value = "SAME AS BILLING";
    sheet.getCell(`D${addrRow + 1}`).font = { bold: true, size: 10 };
    sheet.getCell(`D${addrRow + 2}`).value = "DESPATCH THROUGH: BY BUYER";
    sheet.getCell(`D${addrRow + 2}`).font = { bold: true, size: 10 };
    sheet.getCell(`D${addrRow + 3}`).value = "DELIVERY TERM: UPTO EX-VAISHALI, GHAZIABAD";
    sheet.getCell(`D${addrRow + 3}`).font = { bold: true, size: 10 };

    for (let r = addrRow; r <= endAddrRow; r++) {
        sheet.getCell(`A${r}`).border = { left: { style: 'thin' } };
        sheet.getCell(`C${r}`).border = { right: { style: 'thin' } };
        sheet.getCell(`D${r}`).border = { left: { style: 'thin' } };
        sheet.getCell(`G${r}`).border = { right: { style: 'thin' } };
    }
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(c => {
        sheet.getCell(`${c}${addrRow}`).border = Object.assign({}, sheet.getCell(`${c}${addrRow}`).border, { top: { style: 'thin' } });
        sheet.getCell(`${c}${endAddrRow}`).border = Object.assign({}, sheet.getCell(`${c}${endAddrRow}`).border, { bottom: { style: 'thin' } });
    });
    for (let r = addrRow; r <= endAddrRow; r++) {
        sheet.getCell(`C${r}`).border = Object.assign({}, sheet.getCell(`C${r}`).border, { right: { style: 'thin' } });
    }

    // --- 3. TABLE HEADERS ---
    const tHeadRow = endAddrRow + 1;
    const headers = [
        'S.N.', 'DESCRIPTION/MATERIAL', 'HSN CODE', 'QTY\n(PCS.)',
        'BASIC PRICE RS', 'UNIT RATE\nAFTER DISCOUNT', 'TOTAL AMOUNT - RS'
    ];

    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((col, i) => {
        const cell = sheet.getCell(`${col}${tHeadRow}`);
        cell.value = headers[i];
        cell.font = { bold: true, size: 10 };
        cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
        cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });
    sheet.getRow(tHeadRow).height = 40;

    // --- 4. DATA ROWS ---
    let currentRow = tHeadRow + 1;
    items.forEach((item, index) => {
        const r = currentRow;
        sheet.getCell(`A${r}`).value = index + 1;
        sheet.getCell(`B${r}`).value = item.name;
        sheet.getCell(`C${r}`).value = item.hsn;
        sheet.getCell(`D${r}`).value = item.qty;
        sheet.getCell(`E${r}`).value = item.price;

        const discFactor = 1 - (item.discount || 6) / 100;
        sheet.getCell(`F${r}`).value = { formula: `E${r}*${discFactor}` };

        const taxMult = 1 + taxRate;
        sheet.getCell(`G${r}`).value = { formula: `(F${r}*D${r})*${taxMult}` };

        sheet.getCell(`H${r}`).value = { formula: `F${r}*D${r}` };

        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(c => {
            sheet.getCell(`${c}${r}`).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
        });

        currentRow++;
    });

    for (let i = 0; i < 5; i++) {
        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(c => {
            sheet.getCell(`${c}${currentRow}`).border = { left: { style: 'thin' }, right: { style: 'thin' } };
        });
        currentRow++;
    }
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(c => {
        sheet.getCell(`${c}${currentRow - 1}`).border = Object.assign({}, sheet.getCell(`${c}${currentRow - 1}`).border, { bottom: { style: 'thin' } });
    });

    // --- 5. FOOTER ---
    const fRow = currentRow;

    sheet.getCell(`B${fRow}`).value = "SUB TOTAL - RS";
    sheet.getCell(`B${fRow}`).font = { bold: true };
    sheet.getCell(`G${fRow}`).value = { formula: `SUM(H${tHeadRow + 1}:H${currentRow - 1})` };
    sheet.getCell(`G${fRow}`).font = { bold: true };
    sheet.getCell(`G${fRow}`).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

    // Default factors
    let sgstFactor = 0;
    let cgstFactor = 0;
    let igstFactor = 0;
    let totalFactor = 0;

    if (invoiceData.taxMode === 'SGST_CGST') {
        sgstFactor = 0.09;
        cgstFactor = 0.09;
        totalFactor = 0.18;
    } else if (invoiceData.taxMode === 'IGST') {
        igstFactor = 0.18;
        totalFactor = 0.18;
    }

    let footerOffset = 1;

    // SGST
    sheet.getCell(`B${fRow + footerOffset}`).value = "SGST - 9%";
    sheet.getCell(`B${fRow + footerOffset}`).font = { bold: true };
    sheet.getCell(`G${fRow + footerOffset}`).value = { formula: `G${fRow}*${sgstFactor}` };
    sheet.getCell(`G${fRow + footerOffset}`).border = { right: { style: 'thin' }, left: { style: 'thin' } };
    footerOffset++;

    // CGST
    sheet.getCell(`B${fRow + footerOffset}`).value = "CGST - 9%";
    sheet.getCell(`B${fRow + footerOffset}`).font = { bold: true };
    sheet.getCell(`G${fRow + footerOffset}`).value = { formula: `G${fRow}*${cgstFactor}` };
    sheet.getCell(`G${fRow + footerOffset}`).border = { right: { style: 'thin' }, left: { style: 'thin' } };
    footerOffset++;

    // IGST
    sheet.getCell(`B${fRow + footerOffset}`).value = "IGST - 18%";
    sheet.getCell(`B${fRow + footerOffset}`).font = { bold: true };
    sheet.getCell(`G${fRow + footerOffset}`).value = { formula: `G${fRow}*${igstFactor}` };
    sheet.getCell(`G${fRow + footerOffset}`).border = { right: { style: 'thin' }, left: { style: 'thin' } };
    footerOffset++;

    // TOTAL GST
    sheet.getCell(`B${fRow + footerOffset}`).value = "TOTAL GST - 18%";
    sheet.getCell(`B${fRow + footerOffset}`).font = { bold: true };
    sheet.getCell(`G${fRow + footerOffset}`).value = { formula: `G${fRow}*${totalFactor}` };
    sheet.getCell(`G${fRow + footerOffset}`).font = { bold: true };
    sheet.getCell(`G${fRow + footerOffset}`).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    footerOffset++;

    // TOTAL NET AMOUNT
    sheet.getCell(`B${fRow + footerOffset}`).value = "TOTAL NET AMOUNT INCL GST - RS";
    sheet.getCell(`B${fRow + footerOffset}`).font = { bold: true };
    sheet.getCell(`G${fRow + footerOffset}`).value = { formula: `G${fRow}+G${fRow + footerOffset - 1}` };
    sheet.getCell(`G${fRow + footerOffset}`).font = { bold: true, size: 11 };
    sheet.getCell(`G${fRow + footerOffset}`).border = { top: { style: 'thin' }, bottom: { style: 'double' }, left: { style: 'thin' }, right: { style: 'thin' } };

    // Evaluate total for dynamic "Amount in Words" (using subtotal * totalFactor for tax offset)
    const subtotalCalc = items.reduce((sum, item) => sum + (item.qty * item.price * (1 - (item.discount || 6) / 100)), 0);
    const finalCalculatedAmount = Math.round(subtotalCalc + (subtotalCalc * totalFactor));

    // Dynamic import to break dependency cycle if not auto-resolving statically
    const { numberToWords } = await import('../lib/utils.js');

    footerOffset++;
    sheet.mergeCells(`A${fRow + footerOffset}:G${fRow + footerOffset}`);
    sheet.getCell(`A${fRow + footerOffset}`).value = `TOTAL AMOUNT WORDS - [ ${numberToWords(finalCalculatedAmount).toUpperCase()} ]`;
    sheet.getCell(`A${fRow + footerOffset}`).font = { bold: true };
    sheet.getCell(`A${fRow + footerOffset}`).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };

    footerOffset++;
    // Bank Details (Left Side: A-D)
    sheet.mergeCells(`A${fRow + footerOffset}:D${fRow + footerOffset + 3}`);
    const fBank = sheet.getCell(`A${fRow + footerOffset}`);
    // Handle optional companyInfo safely if needed, but it's hardcoded here
    const bank = companyInfo?.bankDetails || {};
    fBank.value = `BANK DETAILS :\nNAME OF BANK : ${bank.bankName || ''} : ${bank.accountNo || ''}\nIFSC CODE : ${bank.ifsc || ''}`;
    fBank.alignment = { wrapText: true, vertical: 'top' };
    fBank.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

    // Authorized Signatory (Right Side: E-G)
    const signatureRow = fRow + footerOffset;

    // Text Label
    sheet.mergeCells(`E${signatureRow}:G${signatureRow}`);
    const signLabel = sheet.getCell(`E${signatureRow}`);
    signLabel.value = "For RAEMA STAR SOLAR PVT. LTD.";
    signLabel.font = { bold: true, size: 10 };
    signLabel.alignment = { horizontal: 'center' };
    signLabel.border = { top: { style: 'thin' }, right: { style: 'thin' } };

    // Stamp / Space
    sheet.mergeCells(`E${signatureRow + 1}:G${signatureRow + 3}`);
    const signSpace = sheet.getCell(`E${signatureRow + 1}`);
    signSpace.border = { bottom: { style: 'thin' }, right: { style: 'thin' } };

    if (signatureImage) {
        const signImageId = workbook.addImage({
            base64: signatureImage,
            extension: 'png',
        });

        // Anchor carefully in E(signatureRow+1) to G(signatureRow+3)
        // 0-indexed columns: E=4, G=6 (end of 6 is boundary 7)
        // Rows: signatureRow+1 (start), signatureRow+3 (end)
        // Example: if signatureRow is 20. Merged 21-23.
        // tl: { col: 4, row: signatureRow } (which is row index for signatureRow+1... wait. row is 0-indexed)
        // row index = (signatureRow + 1) - 1 => signatureRow.

        sheet.addImage(signImageId, {
            tl: { col: 4, row: signatureRow }, // Start of E(row+1)
            br: { col: 7, row: signatureRow + 3 } // End of G(row+3)
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Invoice_${invoiceData.contactPerson || 'Raema'}_${invoiceData.invoiceNo}.xlsx`);
}
