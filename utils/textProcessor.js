/**
 * Text processing utilities for handling LUA output
 */

/**
 * Handle line breaks - convert \r?\n to <br />
 */
function handleLineBreaks(value) {
    if (typeof value !== 'string') {
        return value;
    }
    
    return value.replace(/\r?\n/g, '<br />');
}

/**
 * Handle color codes - convert special character color codes to HTML spans
 * The LUA uses special control characters, not literal letters
 */
function handleColorCodes(value) {
    if (typeof value !== 'string') {
        return value;
    }

    // Color code mappings from LUA - these are special control characters
    let result = value;

    result = result.replace(/\u0001/g, '<span class=\'grey\'>');
    result = result.replace(/\u0002/g, '<span class=\'blue\'>');
    result = result.replace(/\u0003/g, '<span class=\'cyan\'>');
    result = result.replace(/\u0007/g, '<span class=\'green\'>');
    result = result.replace(/\u000D/g, '<span class=\'magenta\'>');
    result = result.replace(/\u000F/g, '<span class=\'unknown\'>');
    result = result.replace(/\u0012/g, '<span class=\'red\'>');
    result = result.replace(/\u0015/g, '<span class=\'pale-blue\'>');
    result = result.replace(/\u0017/g, '<span class=\'white\'>');
    result = result.replace(/\u0019/g, '<span class=\'yellow\'>');
    result = result.replace(/\u001A/g, '<span class=\'pale-grey\'>');
    result = result.replace(/\u0018/g, '</span>');

    // Remove null characters
    result = result.replace(/\u0000/g, '');

    return result;
}

/**
 * Handle faction colors - remove color codes between #FF and #
 */
function handleFactionColors(value) {
    if (typeof value !== 'string') {
        return value;
    }
    
    // Remove color codes between #FF and # (case insensitive)
    const result = value.replace(/#[Ff][Ff].*?#/g, '');
    
    return result || value;
}

/**
 * Normalize output
 * Processes strings through all text handling functions
 */
function normalizeOutput(value) {
    const elementType = typeof value;

    if (elementType === 'object' && value !== null) {
        return value;
    }
    
    if (elementType === 'string') {
        let processed = value;
        processed = handleLineBreaks(processed);
        processed = handleColorCodes(processed);
        processed = handleFactionColors(processed);
        return processed;
    }
    
    return value;
}

/**
 * Recursively normalize all string values in an object or array
 */
function normalizeObjectRecursively(object) {
    if (typeof object === 'string') {
        return normalizeOutput(object);
    }
    
    if (Array.isArray(object)) {
        return object.map(item => normalizeObjectRecursively(item));
    }
    
    if (object !== null && typeof object === 'object') {
        const normalized = {};
        for (const [key, value] of Object.entries(object)) {
            normalized[key] = normalizeObjectRecursively(value);
        }
        return normalized;
    }
    
    return object;
}

module.exports = {
    normalizeObjectRecursively
};
