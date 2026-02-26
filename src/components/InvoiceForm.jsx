import React from 'react';
import { Calendar } from 'lucide-react';

export function InvoiceForm({ data, onChange }) {
    return (
        <div className="space-y-4">
            {/* Date & Invoice No */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => onChange('date', e.target.value)}
                            className="w-full text-sm p-2 pl-3 border rounded-lg bg-slate-50"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Invoice No</label>
                    <input
                        type="text"
                        value={data.invoiceNo}
                        onChange={(e) => onChange('invoiceNo', e.target.value)}
                        className="w-full text-sm p-2 border rounded-lg"
                    />
                </div>
            </div>

            {/* Bill To Address Copypasta */}
            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">BILL TO</label>
                <textarea
                    value={data.clientAddress}
                    onChange={(e) => onChange('clientAddress', e.target.value.toUpperCase())}
                    placeholder="PASTE FULL CLIENT ADDRESS HERE..."
                    className="w-full h-24 text-sm font-bold uppercase p-3 border rounded-lg resize-none placeholder:text-slate-400"
                ></textarea>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Contact Person</label>
                    <input
                        type="text"
                        value={data.contactPerson}
                        onChange={(e) => onChange('contactPerson', e.target.value)}
                        className="w-full text-sm p-2 border rounded-lg"
                        placeholder="Name"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone</label>
                        <input
                            type="text"
                            value={data.clientPhone}
                            onChange={(e) => onChange('clientPhone', e.target.value)}
                            className="w-full text-sm p-2 border rounded-lg"
                            placeholder="+91..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">GSTIN</label>
                        <input
                            type="text"
                            value={data.clientGstin}
                            onChange={(e) => onChange('clientGstin', e.target.value)}
                            className="w-full text-sm p-2 border rounded-lg"
                            placeholder="GST Number"
                        />
                    </div>
                </div>
            </div>

            {/* Tax Mode Toggle */}
            <div className="pt-4 border-t">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Tax Mode</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => onChange('taxMode', 'IGST')}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${data.taxMode === 'IGST' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        IGST (Inter-state)
                    </button>
                    <button
                        onClick={() => onChange('taxMode', 'SGST_CGST')}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${data.taxMode === 'SGST_CGST' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        SGST / CGST
                    </button>
                    <button
                        onClick={() => onChange('taxMode', 'NO_TAX')}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${data.taxMode === 'NO_TAX' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        No Tax
                    </button>
                </div>
            </div>
        </div>
    );
}
