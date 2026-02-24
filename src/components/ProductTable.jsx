import React, { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { products } from '../data/products';

export function ProductTable({ items, setItems, taxMode }) {

    const addRow = () => {
        setItems([
            ...items,
            {
                id: Date.now(),
                productId: '',
                name: '',
                hsn: '',
                qty: 1,
                price: 0,
                discount: 6, // Default 6%
            }
        ]);
    };

    const removeRow = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateRow = (id, field, value) => {
        setItems(items.map(item => {
            if (item.id === id) {
                let updates = { [field]: value };

                // Auto-fill product details
                if (field === 'productId') {
                    const product = products.find(p => p.id === parseInt(value));
                    if (product) {
                        updates = {
                            ...updates,
                            name: product.name,
                            hsn: product.hsn,
                            price: product.price
                        };
                    }
                }

                return { ...item, ...updates };
            }
            return item;
        }));
    };

    return (
        <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                        <th className="py-3 px-2 w-10">#</th>
                        <th className="py-3 px-2 min-w-[200px]">Product</th>
                        <th className="py-3 px-2 w-24">HSN</th>
                        <th className="py-3 px-2 w-20">Qty</th>
                        <th className="py-3 px-2 w-28">Price (₹)</th>
                        <th className="py-3 px-2 w-20">Disc %</th>
                        <th className="py-3 px-2 w-32 text-right">Total (₹)</th>
                        <th className="py-3 px-2 w-12"></th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {items.map((item, index) => {
                        const basicAmount = item.qty * item.price;
                        const discountAmount = basicAmount * (item.discount / 100);
                        const total = basicAmount - discountAmount;

                        return (
                            <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 group transition-colors">
                                <td className="py-3 px-2 text-slate-400">{index + 1}</td>
                                <td className="py-3 px-2">
                                    <select
                                        value={item.productId}
                                        onChange={(e) => updateRow(item.id, 'productId', e.target.value)}
                                        className="w-full p-2 border border-slate-200 rounded-md bg-transparent focus:bg-white transition-all"
                                    >
                                        <option value="">Select Product...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-3 px-2">
                                    <input
                                        type="text"
                                        value={item.hsn}
                                        readOnly
                                        className="w-full p-2 bg-slate-50 text-slate-500 border-none rounded outline-none cursor-default"
                                    />
                                </td>
                                <td className="py-3 px-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.qty}
                                        onChange={(e) => updateRow(item.id, 'qty', parseInt(e.target.value) || 0)}
                                        className="w-full p-2 border border-slate-200 rounded-md"
                                    />
                                </td>
                                <td className="py-3 px-2">
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => updateRow(item.id, 'price', parseFloat(e.target.value) || 0)}
                                        className="w-full p-2 border border-slate-200 rounded-md"
                                    />
                                </td>
                                <td className="py-3 px-2">
                                    <input
                                        type="number"
                                        value={item.discount}
                                        onChange={(e) => updateRow(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                        className="w-full p-2 border border-slate-200 rounded-md text-slate-600"
                                    />
                                </td>
                                <td className="py-3 px-2 text-right font-medium text-slate-700">
                                    {total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <button
                                        onClick={() => removeRow(item.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="mt-4">
                <button
                    onClick={addRow}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all"
                >
                    <Plus size={16} />
                    Add Item
                </button>
            </div>
        </div>
    );
}
