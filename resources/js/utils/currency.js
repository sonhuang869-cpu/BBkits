/**
 * Brazilian Currency Formatting Utilities
 * 
 * These functions handle Brazilian Real (BRL) currency formatting
 * with proper Brazilian localization (comma as decimal separator, period as thousands separator)
 */

/**
 * Format a number as Brazilian currency
 * @param {number|string} value - The value to format
 * @returns {string} - Formatted currency string (e.g., "R$ 1.234,56")
 */
export const formatBRL = (value) => {
    try {
        if (value === null || value === undefined || value === '') {
            return 'R$ 0,00';
        }
        
        const number = parseFloat(value);
        if (isNaN(number)) {
            return 'R$ 0,00';
        }
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    } catch (error) {
        console.error('Error formatting Brazilian currency:', error);
        return 'R$ 0,00';
    }
};

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use formatBRL instead
 */
export const formatCurrency = (amount) => {
    return formatBRL(amount);
};

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use formatBRL instead
 */
export const formatCurrencyWithSymbol = (amount) => {
    return formatBRL(amount);
};

/**
 * Format a number as Brazilian currency without the R$ symbol
 * @param {number|string} value - The value to format
 * @returns {string} - Formatted currency string without symbol (e.g., "1.234,56")
 */
export const formatBRLNumber = (value) => {
    try {
        if (value === null || value === undefined || value === '') {
            return '0,00';
        }
        
        const number = parseFloat(value);
        if (isNaN(number)) {
            return '0,00';
        }
        
        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } catch (error) {
        console.error('Error formatting Brazilian currency number:', error);
        return '0,00';
    }
};

/**
 * Format input value for Brazilian currency input fields
 * Used for real-time input formatting as user types
 * Accepts Brazilian format (90,00) or plain numbers (90)
 * @param {string} value - The raw input value
 * @returns {string} - Formatted value for input display
 */
export const formatBrazilianCurrencyInput = (value) => {
    try {
        if (!value || value === '') return '';

        // Convert string to ensure we're working with string
        let strValue = String(value);

        // Remove R$ symbol and extra spaces
        strValue = strValue.replace(/[R$\s]/g, '').trim();

        // Check if value already has Brazilian format (comma as decimal)
        if (strValue.includes(',')) {
            // Brazilian format: 1.234,56 or 90,00
            // Remove thousands separator (period) and replace decimal comma with period
            const normalized = strValue.replace(/\./g, '').replace(',', '.');
            const number = parseFloat(normalized);
            if (isNaN(number)) return '0,00';

            return number.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }

        // Check if value has period as decimal (US format: 90.00)
        if (strValue.includes('.')) {
            const number = parseFloat(strValue);
            if (isNaN(number)) return '0,00';

            return number.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }

        // Plain number without decimal separator (e.g., "90" means R$ 90,00)
        const number = parseFloat(strValue);
        if (isNaN(number)) return '0,00';

        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } catch (error) {
        console.error('Error formatting Brazilian currency input:', error);
        return '0,00';
    }
};

/**
 * Parse Brazilian currency input back to a number
 * Used to convert formatted input back to numeric value for storage
 * Handles: "90,00" -> 90, "1.234,56" -> 1234.56, "90" -> 90, "90.00" -> 90
 * @param {string} value - The formatted Brazilian currency string
 * @returns {string} - Numeric string value for backend storage
 */
export const parseBrazilianCurrency = (value) => {
    try {
        if (!value || value === '') return '0';

        // Convert to string
        let strValue = String(value);

        // Remove currency symbol and spaces
        strValue = strValue.replace(/[R$\s]/g, '').trim();

        // Check if it's Brazilian format (has comma)
        if (strValue.includes(',')) {
            // Brazilian format: 1.234,56 or 90,00
            // Period is thousands separator, comma is decimal separator
            // Remove periods (thousands), replace comma with period (decimal)
            strValue = strValue.replace(/\./g, '').replace(',', '.');
        }
        // If it only has periods, treat as US format (period = decimal)
        // No conversion needed

        const parsed = parseFloat(strValue);
        return isNaN(parsed) ? '0' : parsed.toString();
    } catch (error) {
        console.error('Error parsing Brazilian currency:', error);
        return '0';
    }
};

/**
 * Format additional cost for display in forms (e.g., embroidery costs)
 * @param {number|string} cost - The additional cost value
 * @returns {string} - Formatted cost string (e.g., "+R$ 15,00" or empty if 0)
 */
export const formatAdditionalCost = (cost) => {
    const numericCost = parseFloat(cost);
    if (isNaN(numericCost) || numericCost <= 0) {
        return '';
    }
    return ` (+${formatBRL(numericCost)})`;
};