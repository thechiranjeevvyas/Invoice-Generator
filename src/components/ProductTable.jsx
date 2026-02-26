import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Search, ChevronDown } from 'lucide-react';
import { products, getFullProductName } from '../data/products';

const SearchableDropdown = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === parseInt(value));
    const displayValue = selectedOption ? selectedOption.label : '';

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div ref={dropdownRef} className="relative w-full">
            <div
                className="w-full p-2 border border-slate-200 rounded-md bg-transparent focus:bg-white transition-all flex justify-between items-center cursor-pointer min-h-[42px]"
                onClick={() => { setIsOpen(!isOpen); setSearchTerm(''); }}
            >
                <span className={`truncate text-xs sm:text-sm ${displayValue ? 'text-slate-900' : 'text-slate-500'}`}>
                    {displayValue || 'Select Product...'}
                </span>
                <ChevronDown size={16} className="text-slate-400" />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-[300px] mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 flex flex-col">
                    <div className="p-2 border-b border-slate-100 sticky top-0 bg-white z-10">
                        <div className="relative">
                            <Search size={14} className="absolute left-2 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                className="w-full pl-8 pr-2 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-blue-400"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <ul className="overflow-y-auto overflow-x-hidden flex-1 p-1 max-h-48">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <li
                                    key={opt.value}
                                    className={`px-3 py-2 text-xs sm:text-sm cursor-pointer rounded-sm ${opt.value === parseInt(value) ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-3 py-4 text-center text-sm text-slate-500">
                                No products found
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

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
                            name: getFullProductName(product),
                            hsn: product.hsn,
                            price: product.price
                        };
                    } else {
                        updates = { ...updates, name: '', hsn: '', price: 0 };
                    }
                }

                return { ...item, ...updates };
            }
            return item;
        }));
    };

    const productOptions = products.map(p => ({
        value: p.id,
        label: p.short_name
    }));

    return (
        <div className="flex-1 overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-700 uppercase">
                        <th className="py-3 px-2 w-10">S.N.</th>
                        <th className="py-3 px-2 min-w-[200px]">DESCRIPTION/MATERIAL</th>
                        <th className="py-3 px-2 w-24">HSN CODE</th>
                        <th className="py-3 px-2 w-20">QTY (PCS.)</th>
                        <th className="py-3 px-2 w-28">BASIC PRICE RS</th>
                        <th className="py-3 px-2 w-20">UNIT RATE AFTER DISCOUNT</th>
                        <th className="py-3 px-2 w-32 text-right">TOTAL AMOUNT - RS</th>
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
                                    <SearchableDropdown
                                        value={item.productId}
                                        onChange={(val) => updateRow(item.id, 'productId', val)}
                                        options={productOptions}
                                    />
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
