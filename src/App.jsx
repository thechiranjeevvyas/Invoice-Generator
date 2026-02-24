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

        {/* Header Section */}
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Internal Invoice Generator</h1>
            <p className="text-slate-500">Raema Solar - Automated Billing System</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1">Header Image (Optional)</label>
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
