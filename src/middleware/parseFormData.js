// Middleware to parse nested FormData fields into proper objects
const parseFormData = (req, res, next) => {
  if (!req.body || typeof req.body !== "object") {
    return next();
  }

  const parsed = {};
  
  // Helper to safely parse numbers
  const parseNumber = (val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.trim() !== '') {
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    }
    return null;
  };

  // Helper to parse boolean
  const parseBoolean = (val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val === 'true';
    return false;
  };

  // Process ALL keys in req.body
  for (const key in req.body) {
    const value = req.body[key];
    
    // Handle nested objects: price[current], specifications[motorPower], etc.
    if (key.includes('[') && key.includes(']')) {
      const match = key.match(/^([^\[]+)\[([^\]]+)\]$/);
      if (match) {
        const [, parentKey, childKey] = match;
        
        if (!parsed[parentKey]) {
          parsed[parentKey] = {};
        }
        
        // Handle price fields
        if (parentKey === 'price') {
          if (childKey === 'current' || childKey === 'original') {
            const num = parseNumber(value);
            if (num !== null) {
              parsed[parentKey][childKey] = num;
            }
          } else {
            parsed[parentKey][childKey] = value || 'USD';
          }
        }
        // Handle specifications
        else if (parentKey === 'specifications') {
          if (childKey === 'foldable') {
            parsed[parentKey][childKey] = parseBoolean(value);
          } else if (['rangeKm', 'weightKg', 'maxSpeedKmh'].includes(childKey)) {
            const num = parseNumber(value);
            if (num !== null) {
              parsed[parentKey][childKey] = num;
            }
          } else {
            // String fields: motorPower, batteryCapacity, brakes
            parsed[parentKey][childKey] = value || '';
          }
        }
        // Handle reviews
        else if (parentKey === 'reviews') {
          if (childKey === 'ratingAverage') {
            const num = parseNumber(value);
            parsed[parentKey][childKey] = num !== null ? Math.max(0, Math.min(5, num)) : 0;
          } else if (childKey === 'ratingCount') {
            const num = parseNumber(value);
            parsed[parentKey][childKey] = num !== null ? Math.max(0, Math.floor(num)) : 0;
          } else {
            parsed[parentKey][childKey] = value;
          }
        }
        // Handle variants
        else if (parentKey === 'variants') {
          const variantMatch = key.match(/^variants\[(\d+)\]\[([^\]]+)\]$/);
          if (variantMatch) {
            const [, index, prop] = variantMatch;
            const idx = parseInt(index);
            if (!parsed.variants) parsed.variants = [];
            if (!parsed.variants[idx]) parsed.variants[idx] = {};
            
            if (prop === 'price') {
              const num = parseNumber(value);
              if (num !== null) {
                parsed.variants[idx][prop] = num;
              }
            } else {
              parsed.variants[idx][prop] = value;
            }
          }
        }
        // Handle colors array with name and quantity
        else if (parentKey === 'colors') {
          const colorMatch = key.match(/^colors\[(\d+)\]\[([^\]]+)\]$/);
          if (colorMatch) {
            const [, index, prop] = colorMatch;
            const idx = parseInt(index);
            if (!parsed.colors) parsed.colors = [];
            if (!parsed.colors[idx]) parsed.colors[idx] = {};
            
            if (prop === 'quantity') {
              const num = parseNumber(value);
              parsed.colors[idx][prop] = num !== null ? Math.max(0, Math.floor(num)) : 0;
            } else if (prop === 'name') {
              parsed.colors[idx][prop] = value || '';
            }
          }
        }
      }
    }
    // Handle arrays: features[0], features[1], etc.
    else if (key.match(/^features\[\d+\]$/)) {
      if (!parsed.features) parsed.features = [];
      const index = parseInt(key.match(/\[(\d+)\]/)[1]);
      parsed.features[index] = value;
    }
    // Handle riderHeight array
    else if (key.match(/^riderHeight\[\d+\]$/)) {
      if (!parsed.riderHeight) parsed.riderHeight = [];
      const index = parseInt(key.match(/\[(\d+)\]/)[1]);
      parsed.riderHeight[index] = value;
    }
    // Handle colors array (legacy support - if colors come as simple strings, convert to objects)
    else if (key.match(/^colors\[\d+\]$/)) {
      if (!parsed.colors) parsed.colors = [];
      const index = parseInt(key.match(/\[(\d+)\]/)[1]);
      // If it's a simple string, convert to object format
      if (typeof value === 'string') {
        parsed.colors[index] = { name: value, quantity: 0 };
      } else {
        parsed.colors[index] = value;
      }
    }
    // Handle existingImages array
    else if (key === 'existingImages' || key.startsWith('existingImages[')) {
      if (!parsed.existingImages) parsed.existingImages = [];
      if (Array.isArray(value)) {
        parsed.existingImages = value;
      } else if (value && value !== '[]' && value !== '') {
        parsed.existingImages.push(value);
      }
    }
    // Handle regular fields
    else {
      if (key === 'inStock' || key === 'isListed') {
        parsed[key] = parseBoolean(value);
      } else if (key === 'quantity') {
        const num = parseNumber(value);
        parsed[key] = num !== null ? Math.max(0, Math.floor(num)) : 0;
      } else if (key === 'payload' || key === 'weight' || key === 'discountAmount') {
        const num = parseNumber(value);
        parsed[key] = num !== null ? Math.max(0, num) : null;
      } else if (value !== undefined && value !== null) {
        parsed[key] = value;
      }
    }
  }
  
  // Clean up empty arrays - keep them as empty arrays
  if (!parsed.features) parsed.features = [];
  if (!parsed.variants) parsed.variants = [];
  if (!parsed.riderHeight) parsed.riderHeight = [];
  if (!parsed.colors) parsed.colors = [];
  
  req.body = parsed;
  next();
};

module.exports = parseFormData;
