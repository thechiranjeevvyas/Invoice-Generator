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

    // --- 2. HEADER SECTION ---
    if (headerImage) {
        // IMAGE HEADER LOGIC
        // Merge Top Rows for Image
        sheet.mergeCells('A1:G6');
        const imageId = workbook.addImage({
            base64: headerImage,
            extension: 'png', // Assumes PNG or compatible base64
        });

        sheet.addImage(imageId, {
            tl: { col: 0, row: 0 }, // A1
            br: { col: 7, row: 6 }  // End of G6 (col 7 is H, so col 7 boundary is G-H line. 0-indexed: A=0, G=6. So col:7 is correct for inclusive width)
        });

        // Clear any text just in case, though merging should handle it.
    } else {
        // TEXT HEADER FALLBACK (Previous Logic)
        sheet.mergeCells('A1:G1');
        const r1 = sheet.getCell('A1');
        r1.value = "RAEMA STAR SOLAR PRIVATE LIMITED";
        r1.font = { name: 'Calibri', size: 24, bold: true, color: { argb: 'FFFF0000' } };
        r1.alignment = { horizontal: 'center', vertical: 'middle' };

        sheet.mergeCells('A2:G2');
        const r2 = sheet.getCell('A2');
        r2.value = "[Office Address: 123, Solar Tech Park] TEL NO. : 01234567890, +91 99995120";
        r2.font = { name: 'Calibri', size: 10, underline: true };
        r2.alignment = { horizontal: 'center' };

        sheet.mergeCells('A3:G3');
        const r3 = sheet.getCell('A3');
        r3.value = "WebPage : www.raemasolar.com, test@raemasolar.com";
        r3.font = { name: 'Calibri', size: 10, underline: true };
        r3.alignment = { horizontal: 'center' };

        sheet.mergeCells('A4:G4');
        const r4 = sheet.getCell('A4');
        r4.value = "CIN: U756789UP2020PTC09898, PAN: AAICR645P, GSTIN : 09AAICR645P1Z0";
        r4.font = { name: 'Calibri', size: 10, underline: true, bold: true };
        r4.alignment = { horizontal: 'center' };

        sheet.mergeCells('A5:G5');
        const r5 = sheet.getCell('A5');
        r5.value = "PROFROMA INVOICE";
        r5.font = { name: 'Calibri', size: 14, bold: true };
        r5.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
        r5.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(5).height = 25;
    }

    // NOTE: If Image is used, we used A1:G6. Text used A1:G5.
    // The content below starts at Row 6 for Text, or Row 7 for Image?
    // Text logic had: Row 6 as "Invoice Ref".
    // Image logic occupies A1:G6. Uses G6 boundary.
    // So Image covers rows 1,2,3,4,5,6.
    // Next content should accept Row 7 as start?
    // But wait, the detailed logic below assumes specific rows?
    // Let's adjust rows dynamically?
    // Actually, standardizing on Row 7 for context might be safer if Image covers 6 rows.
    // In Text mode, we used up to Row 5. Row 6 was Ref.
    // If Image uses up to Row 6. Row 7 should be Ref.
    // Let's shift everything down by 1 if Image is present?
    // Or just ensure Image takes 1-5?
    // Text header used 1-5.
    // Screenshot logic used Row 5 for Yellow Bar.
    // Row 6 for Ref.
    // User says "Merge A1 to G6".
    // So Image takes 6 rows.
    // Text took 5 rows.
    // I should probably pad the Text version or adjust the Image version to match, OR use a dynamic startRow.

    // Let's use dynamic start row.
    const contentStartRow = headerImage ? 7 : 6;

    // Row 6/7: Invoice Ref & Order Ref
    if (headerImage) {
        // If image is there, we skip the Yellow Bar? Or is Yellow Bar part of Image?
        // User says "Image replaces Text Fallback".
        // Usually full header image includes Company Name, Address, etc.
        // Does it include "Proforma Invoice" yellow bar? Probably not.
        // But user said "Merge A1:G6... This creates one massive blank space... Image replaces text entirely".
        // I will assume it replaces the Yellow Bar too if that was row 5.
        // IF NOT, I might need to add Yellow Bar below image.
        // Safest: Check prompt "Do not write any text... in the header rows".
        // I will assume Image contains everything up to the Data part.
        // But typically "Invoice Ref" is dynamic.
        // Prompt says: "Row 1: Invoice Ref". Wait, in the metadata section.
        // Let's assume the dynamic content (Invoice Ref, Date) MUST exist.
        // That was Row 6 in Text Mode.
        // In Image Mode (A1:G6), Row 6 is covered.
        // So Dynamic Content must start at Row 7.
    }

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
    sheet.getCell(`A${addrRow + 1}`).value = invoiceData.clientAddress;
    sheet.getCell(`A${addrRow + 1}`).alignment = { vertical: 'top', wrapText: true };

    sheet.mergeCells(`D${addrRow}:G${addrRow}`);
    sheet.getCell(`D${addrRow}`).value = "SHIP TO";
    sheet.getCell(`D${addrRow}`).font = { bold: true, size: 10 };

    sheet.getCell(`D${addrRow + 1}`).value = "SAME AS BILLING";
    sheet.getCell(`D${addrRow + 2}`).value = "Despatch Through: By Buyer";
    sheet.getCell(`D${addrRow + 3}`).value = "Delivery term: Upto Ex-Vaishali, Ghaziabad";

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
        'S.N.', 'DESCRIPTION/MATERIAL', 'HSN CODE', 'QTY\n(Pcs.)',
        'UNIT BASIC\nPRICE', 'UNIT PRICE\nAFTER DISC- 6%', 'Grand Total (Inclusive\nof GST)'
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

    sheet.getCell(`B${fRow}`).value = "SUB-TOTAL- RS";
    sheet.getCell(`B${fRow}`).font = { bold: true };
    sheet.getCell(`G${fRow}`).value = { formula: `SUM(H${tHeadRow + 1}:H${currentRow - 1})` };
    sheet.getCell(`G${fRow}`).font = { bold: true };
    sheet.getCell(`G${fRow}`).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

    let footerOffset = 1;
    if (!isIGST) {
        sheet.getCell(`B${fRow + footerOffset}`).value = "SGST-9%";
        sheet.getCell(`G${fRow + footerOffset}`).value = { formula: `G${fRow}*0.09` };
        sheet.getCell(`G${fRow + footerOffset}`).border = { right: { style: 'thin' }, left: { style: 'thin' } };
        footerOffset++;

        sheet.getCell(`B${fRow + footerOffset}`).value = "CGST-9%";
        sheet.getCell(`G${fRow + footerOffset}`).value = { formula: `G${fRow}*0.09` };
        sheet.getCell(`G${fRow + footerOffset}`).border = { right: { style: 'thin' }, left: { style: 'thin' } };
        footerOffset++;
    }

    if (isIGST) {
        sheet.getCell(`B${fRow + footerOffset}`).value = "IGST-18%";
        sheet.getCell(`G${fRow + footerOffset}`).value = { formula: `G${fRow}*0.18` };
        sheet.getCell(`G${fRow + footerOffset}`).border = { right: { style: 'thin' }, left: { style: 'thin' } };
        footerOffset++;
    }

    sheet.getCell(`B${fRow + footerOffset}`).value = "TOTAL GST-18%";
    sheet.getCell(`B${fRow + footerOffset}`).font = { bold: true };
    sheet.getCell(`G${fRow + footerOffset}`).value = { formula: `G${fRow}*0.18` };
    sheet.getCell(`G${fRow + footerOffset}`).font = { bold: true };
    sheet.getCell(`G${fRow + footerOffset}`).border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    footerOffset++;

    sheet.getCell(`B${fRow + footerOffset}`).value = "TOTAL NET AMOUNT INCL GST-RS";
    sheet.getCell(`B${fRow + footerOffset}`).font = { bold: true };
    sheet.getCell(`G${fRow + footerOffset}`).value = { formula: `G${fRow}+G${fRow + footerOffset - 1}` };
    sheet.getCell(`G${fRow + footerOffset}`).font = { bold: true, size: 11 };
    sheet.getCell(`G${fRow + footerOffset}`).border = { top: { style: 'thin' }, bottom: { style: 'double' }, left: { style: 'thin' }, right: { style: 'thin' } };

    footerOffset++;
    sheet.mergeCells(`A${fRow + footerOffset}:G${fRow + footerOffset}`);
    sheet.getCell(`A${fRow + footerOffset}`).value = "TOTAL AMOUNT WORDS- [Five Hundred Only]";
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
