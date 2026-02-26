export const getFullProductName = (product) => {
    if (!product) return "";
    let parts = [product.base_category];
    if (product.power_type && product.power_type !== "NONE") {
        parts.push(`WITH ${product.power_type}`);
    }
    if (product.pole_type) {
        parts.push(`WITH ${product.pole_type}`);
    }
    if (product.water_type && product.water_type !== "NOT APPLICABLE") {
        parts.push(product.water_type);
    }
    if (product.pole_length) {
        parts.push(`- POLE LENGTH OF ${product.pole_length}`);
    }
    return parts.filter(Boolean).join(" ");
};

export const products = [
    {
        id: 1,
        short_name: "NYLON BRUSH - 6FT - WITH WATER",
        base_category: "MODULE CLEANING NYLON BRUSH",
        water_type: "WITH WATER ARRANGEMENT",
        pole_length: "6FT/2MTR",
        pole_type: "TELESCOPIC EXTENDABLE POLE",
        power_type: "NONE",
        hsn: "96039000",
        price: 1500,
        default_price: 1500,
        default_gst_percentage: 18
    },
    {
        id: 2,
        short_name: "NYLON BRUSH - 12FT - WITH WATER",
        base_category: "MODULE CLEANING NYLON BRUSH",
        water_type: "WITH WATER ARRANGEMENT",
        pole_length: "12FT/4MTR",
        pole_type: "TELESCOPIC EXTENDABLE POLE",
        power_type: "NONE",
        hsn: "96039000",
        price: 2500,
        default_price: 2500,
        default_gst_percentage: 18
    },
    {
        id: 3,
        short_name: "NYLON BRUSH - 18FT - WITH WATER",
        base_category: "MODULE CLEANING NYLON BRUSH",
        water_type: "WITH WATER ARRANGEMENT",
        pole_length: "18FT/6MTR",
        pole_type: "TELESCOPIC EXTENDABLE POLE",
        power_type: "NONE",
        hsn: "96039000",
        price: 3500,
        default_price: 3500,
        default_gst_percentage: 18
    },
    {
        id: 4,
        short_name: "NYLON BRUSH - 6FT - WITHOUT WATER",
        base_category: "MODULE CLEANING NYLON BRUSH",
        water_type: "WITHOUT WATER ARRANGEMENT",
        pole_length: "6FT/2MTR",
        pole_type: "TELESCOPIC EXTENDABLE POLE",
        power_type: "NONE",
        hsn: "96039000",
        price: 1200,
        default_price: 1200,
        default_gst_percentage: 18
    },
    {
        id: 5,
        short_name: "NYLON BRUSH - 12FT - WITHOUT WATER",
        base_category: "MODULE CLEANING NYLON BRUSH",
        water_type: "WITHOUT WATER ARRANGEMENT",
        pole_length: "12FT/4MTR",
        pole_type: "TELESCOPIC EXTENDABLE POLE",
        power_type: "NONE",
        hsn: "96039000",
        price: 2200,
        default_price: 2200,
        default_gst_percentage: 18
    },
    {
        id: 6,
        short_name: "NYLON BRUSH - 18FT - WITHOUT WATER",
        base_category: "MODULE CLEANING NYLON BRUSH",
        water_type: "WITHOUT WATER ARRANGEMENT",
        pole_length: "18FT/6MTR",
        pole_type: "TELESCOPIC EXTENDABLE POLE",
        power_type: "NONE",
        hsn: "96039000",
        price: 3200,
        default_price: 3200,
        default_gst_percentage: 18
    },
    {
        id: 7,
        short_name: "MICROFIBER CLOTH - 6FT",
        base_category: "MODULE CLEANING MICROFIBER WASHABLE CLOTH",
        water_type: "WITHOUT WATER ARRANGEMENT",
        pole_length: "6FT/2MTR",
        pole_type: "TELESCOPIC EXTENDABLE POLE",
        power_type: "NONE",
        hsn: "96039000",
        price: 1300,
        default_price: 1300,
        default_gst_percentage: 18
    },
    {
        id: 8,
        short_name: "MICROFIBER CLOTH - 12FT",
        base_category: "MODULE CLEANING MICROFIBER WASHABLE CLOTH",
        water_type: "WITHOUT WATER ARRANGEMENT",
        pole_length: "12FT/4MTR",
        pole_type: "TELESCOPIC EXTENDABLE POLE",
        power_type: "NONE",
        hsn: "96039000",
        price: 2300,
        default_price: 2300,
        default_gst_percentage: 18
    },
    {
        id: 9,
        short_name: "MICROFIBER CLOTH - 18FT",
        base_category: "MODULE CLEANING MICROFIBER WASHABLE CLOTH",
        water_type: "WITHOUT WATER ARRANGEMENT",
        pole_length: "18FT/6MTR",
        pole_type: "TELESCOPIC EXTENDABLE POLE",
        power_type: "NONE",
        hsn: "96039000",
        price: 3300,
        default_price: 3300,
        default_gst_percentage: 18
    },
    {
        id: 10,
        short_name: "SINGLE DISC BRUSH - 12FT - SMPS",
        base_category: "SINGLE ROUND DISC MOTORISED NYLON CLEANING BRUSH",
        water_type: "NOT APPLICABLE",
        pole_length: "12FT/4MTR",
        pole_type: "HEAVY DUTY ALUMINIUM EXTENDABLE POLE",
        power_type: "SMPS",
        hsn: "8479",
        price: 18000,
        default_price: 18000,
        default_gst_percentage: 18
    },
    {
        id: 11,
        short_name: "DOUBLE DISC BRUSH - 12FT - SMPS",
        base_category: "DOUBLE ROUND DISC MOTORISED NYLON CLEANING BRUSH",
        water_type: "NOT APPLICABLE",
        pole_length: "12FT/4MTR",
        pole_type: "HEAVY DUTY ALUMINIUM EXTENDABLE POLE",
        power_type: "SMPS",
        hsn: "8479",
        price: 25000,
        default_price: 25000,
        default_gst_percentage: 18
    },
    {
        id: 12,
        short_name: "SINGLE DISC BRUSH - 12FT - LITHIUM",
        base_category: "SINGLE ROUND DISC MOTORISED NYLON CLEANING BRUSH",
        water_type: "NOT APPLICABLE",
        pole_length: "12FT/4MTR",
        pole_type: "HEAVY DUTY ALUMINIUM EXTENDABLE POLE",
        power_type: "LITHIUM BATTERY",
        hsn: "8479",
        price: 28000,
        default_price: 28000,
        default_gst_percentage: 18
    },
    {
        id: 13,
        short_name: "DOUBLE DISC BRUSH - 12FT - LITHIUM",
        base_category: "DOUBLE ROUND DISC MOTORISED NYLON CLEANING BRUSH",
        water_type: "NOT APPLICABLE",
        pole_length: "12FT/4MTR",
        pole_type: "HEAVY DUTY ALUMINIUM EXTENDABLE POLE",
        power_type: "LITHIUM BATTERY",
        hsn: "8479",
        price: 35000,
        default_price: 35000,
        default_gst_percentage: 18
    }
];
