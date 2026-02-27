import React, { useState } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { ProductTable } from './components/ProductTable';
import { InvoiceSummary } from './components/InvoiceSummary';
import { companyInfo } from './data/company';
import { Download, Save } from 'lucide-react';
import { generateExcelInvoice } from './utils/generateExcel';

function App() {
  const [invoiceData, setInvoiceData] = useState({
    clientAddress: '',
    contactPerson: '',
    clientPhone: '',
    clientGstin: '',
    invoiceNo: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    taxMode: 'IGST', // 'IGST' or 'SGST_CGST'
  });

  const [headerImage, setHeaderImage] = useState(null);
  const [signatureImage, setSignatureImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeaderImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [items, setItems] = useState([
    // Initial empty row or dummy data if debugging
  ]);

  const handleInputChange = (field, value) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownload = async () => {
    if (items.length === 0) {
      alert("Please add at least one item.");
      return;
    }
    await generateExcelInvoice({ invoiceData, items, companyInfo, headerImage, signatureImage });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section (Preview & Controls) */}
        <header className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-6">
          <div className="relative w-full flex flex-col items-center text-center">
            {headerImage && (
              <img
                src={headerImage}
                alt="Logo"
                className="absolute left-0 top-0 h-20 w-auto object-contain"
              />
            )}
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-600 uppercase tracking-wide"
              style={{ textShadow: '1px 1px 0px #FFFF00, -1px -1px 0px #FFFF00, 1px -1px 0px #FFFF00, -1px 1px 0px #FFFF00' }}
            >
              RAEMA STAR SOLAR PRIVATE LIMITED
            </h1>
            <div className="text-xs md:text-sm text-black mt-2 space-y-1">
              <p>K-7, LEELA HOMES, PLOT NO. 23, SECTOR-4, VAISHALI, GHAZIABAD 201 010 NCR India.</p>
              <p>TEL NO. : 0120-4523496, +91 995 8469 555, WebPage : www.raemasolar.com, manish@raemasolar.com</p>
              <p>CIN: U74999UP2017PTC098649, PAN: AAICR6230L, GSTIN : 09AAICR6230L1ZO</p>
            </div>
          </div>

          <div className="flex justify-between items-center w-full pt-4 border-t border-slate-100">
            <div className="text-sm font-semibold text-slate-500">Internal Generator Controls</div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1">Header Logo (Top-Left)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="flex flex-col items-end">
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1">Signature Stamp (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setSignatureImage(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md active:scale-95"
              >
                <Download size={20} />
                Download Excel
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Sidebar - Client Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Client Details</h2>
              <InvoiceForm
                data={invoiceData}
                onChange={handleInputChange}
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Company Info (Read Only)</h2>
              <div className="text-sm text-slate-600 space-y-2">
                <p><span className="font-medium text-slate-900">Name:</span> {companyInfo.name}</p>
                <p><span className="font-medium text-slate-900">GSTIN:</span> {companyInfo.gstin}</p>
                <p><span className="font-medium text-slate-900">PAN:</span> {companyInfo.pan}</p>
              </div>
            </div>
          </div>

          {/* Right Main Content - Line Items */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Line Items</h2>
                <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Tax Mode: <span className="font-bold text-slate-900">{invoiceData.taxMode}</span>
                </div>
              </div>

              <ProductTable
                items={items}
                setItems={setItems}
                taxMode={invoiceData.taxMode}
              />

              <div className="mt-auto pt-6 border-t">
                <InvoiceSummary
                  items={items}
                  taxMode={invoiceData.taxMode}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
