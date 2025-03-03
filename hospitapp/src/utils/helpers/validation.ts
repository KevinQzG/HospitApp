/**
 * Check if an array is a string array
 * @param arr - The array to check
 * @param type - The expected type of the array items
 * @param length - The expected length of the array
 * @returns {boolean} True if the array is a string array, false otherwise
 */
const is_type_array = (arr: unknown[], type: string, length?: number): arr is unknown[] => {
    return Array.isArray(arr) && 
        (length === undefined || arr.length === length) 
        && arr.every(item => typeof item === type);
};


// Export the helper functions
export { is_type_array };

