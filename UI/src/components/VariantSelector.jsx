// // components/VariantSelector.jsx
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import ColorPicker from './ColorPicker';

// /**
//  * Extracts unique values for a given property from variants
//  */
// const getUniqueOptions = (variants, key) => {
//   const values = variants
//     .map(v => v[key])
//     .filter(Boolean);
//   return [...new Set(values)];
// };

// /**
//  * Checks if a combination (color + size) exists in variants and has stock > 0
//  */
// const isValidCombination = (variants, color, size) => {
//   return variants.some(v => 
//     v.color === color && 
//     v.size === size && 
//     (v.stockQuantity ?? 0) > 0
//   );
// };

// /**
//  * Finds the variant that matches the selected color and size
//  */
// const findMatchingVariant = (variants, color, size) => {
//   return variants.find(v => v.color === color && v.size === size);
// };

// const VariantSelector = ({ variants, onVariantChange, initialColor = null, initialSize = null }) => {
//   // Extract available colors and sizes
//   const availableColors = useMemo(() => getUniqueOptions(variants, 'color'), [variants]);
//   const availableSizes = useMemo(() => getUniqueOptions(variants, 'size'), [variants]);

//   // State for selected options
//   const [selectedColor, setSelectedColor] = useState(initialColor || availableColors[0] || '');
//   const [selectedSize, setSelectedSize] = useState(initialSize || availableSizes[0] || '');

//   // Filter sizes based on selected color (only those with stock > 0)
//   const filteredSizes = useMemo(() => {
//     if (!selectedColor) return availableSizes;
//     return availableSizes.filter(size => 
//       isValidCombination(variants, selectedColor, size)
//     );
//   }, [availableSizes, selectedColor, variants]);

//   // Filter colors based on selected size
//   const filteredColors = useMemo(() => {
//     if (!selectedSize) return availableColors;
//     return availableColors.filter(color => 
//       isValidCombination(variants, color, selectedSize)
//     );
//   }, [availableColors, selectedSize, variants]);

//   // When color or size changes, find matching variant and notify parent
//   useEffect(() => {
//     // Auto-select first available size if current selection becomes invalid
//     if (selectedSize && !filteredSizes.includes(selectedSize)) {
//       setSelectedSize(filteredSizes[0] || '');
//     }
//     if (selectedColor && !filteredColors.includes(selectedColor)) {
//       setSelectedColor(filteredColors[0] || '');
//     }

//     const matchingVariant = findMatchingVariant(variants, selectedColor, selectedSize);
//     if (matchingVariant && onVariantChange) {
//       onVariantChange(matchingVariant);
//     }
//   }, [selectedColor, selectedSize, filteredSizes, filteredColors, variants, onVariantChange]);

//   const handleColorSelect = useCallback((color) => {
//     setSelectedColor(color);
//     // If current size is not compatible with new color, reset to first valid size
//     if (!isValidCombination(variants, color, selectedSize)) {
//       const firstValidSize = availableSizes.find(size => isValidCombination(variants, color, size));
//       if (firstValidSize) setSelectedSize(firstValidSize);
//     }
//   }, [selectedSize, variants, availableSizes]);

//   const handleSizeClick = useCallback((size) => {
//     setSelectedSize(size);
//     // If current color is not compatible with new size, reset to first valid color
//     if (!isValidCombination(variants, selectedColor, size)) {
//       const firstValidColor = availableColors.find(color => isValidCombination(variants, color, size));
//       if (firstValidColor) setSelectedColor(firstValidColor);
//     }
//   }, [selectedColor, variants, availableColors]);

//   if (!variants || variants.length === 0) return null;

//   return (
//     <div className="space-y-6">
//       {/* Color Selection using ColorPicker */}
//       <div>
//         <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//           Color: <span className="font-normal">{selectedColor}</span>
//         </p>
//         <ColorPicker
//           colors={filteredColors}
//           selectedColor={selectedColor}
//           onSelectColor={handleColorSelect}
//         />
//       </div>

//       {/* Size Selection */}
//       <div>
//         <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
//           Size: <span className="font-normal">{selectedSize}</span>
//         </p>
//         <div className="flex flex-wrap gap-2">
//           {filteredSizes.map(size => (
//             <button
//               key={size}
//               onClick={() => handleSizeClick(size)}
//               className={`px-4 py-2 rounded-lg border font-medium transition-all ${
//                 selectedSize === size
//                   ? 'bg-purple-600 text-white border-purple-600 shadow-md'
//                   : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border-gray-300 dark:border-dark-border hover:border-purple-400'
//               }`}
//             >
//               {size}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VariantSelector;

// components/VariantSelector.jsx
// components/VariantSelector.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ColorPicker from './ColorPicker';

const VariantSelector = ({ 
  variants = [], 
  onVariantChange, 
  initialColor = null, 
  initialSize = null 
}) => {
  // ---------- 1. Pre‑compute available data (no repeated loops) ----------
  // Only colors that have at least one size in stock (>0)
  const availableColors = useMemo(() => {
    const colorSet = new Set(
      variants
        .filter(v => (v.stockQuantity ?? 0) > 0)
        .map(v => v.color)
        .filter(Boolean)
    );
    return Array.from(colorSet).sort((a, b) => a.localeCompare(b));
  }, [variants]);

  // All possible sizes for the product (global, sorted numerically if possible)
  const allSizes = useMemo(() => {
    const sizeSet = new Set(variants.map(v => v.size).filter(Boolean));
    return Array.from(sizeSet).sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  }, [variants]);

  // Map: color → array of available sizes (stock > 0), pre‑sorted
  const sizesByColor = useMemo(() => {
    const map = {};
    variants.forEach(v => {
      const color = v.color;
      const stock = v.stockQuantity ?? 0;
      if (stock > 0 && color) {
        if (!map[color]) map[color] = [];
        if (!map[color].includes(v.size)) {
          map[color].push(v.size);
        }
      }
    });
    // Sort each size list numerically/alphabetically
    Object.keys(map).forEach(color => {
      map[color].sort((a, b) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      });
    });
    return map;
  }, [variants]);

  // ---------- 2. State ----------
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  // ---------- 3. Initialisation & reset (when product changes) ----------
  useEffect(() => {
    if (variants.length === 0) {
      setSelectedColor('');
      setSelectedSize('');
      return;
    }

    // Determine best initial color
    let colorToSet = initialColor || '';
    if (!availableColors.includes(colorToSet)) {
      colorToSet = availableColors[0] || '';
    }

    // Determine best initial size for that color
    let sizeToSet = initialSize || '';
    const availableSizes = sizesByColor[colorToSet] || [];
    if (colorToSet && !availableSizes.includes(sizeToSet)) {
      sizeToSet = availableSizes[0] || '';
    }

    // Only update if changed (avoids extra renders)
    if (colorToSet !== selectedColor) setSelectedColor(colorToSet);
    if (sizeToSet !== selectedSize) setSelectedSize(sizeToSet);
  }, [variants, availableColors, sizesByColor, initialColor, initialSize]);

  // ---------- 4. Handlers (with auto‑correction) ----------
  const handleColorChange = useCallback((color) => {
    setSelectedColor(color);
    const availableSizes = sizesByColor[color] || [];
    // If current size is not available for the new color → pick first valid
    if (selectedSize && !availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0] || '');
    } else if (!selectedSize && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  }, [sizesByColor, selectedSize]);

  const handleSizeChange = useCallback((size) => {
    setSelectedSize(size);
    // No need to change color – size buttons are only enabled for the current color
  }, []);

  // ---------- 5. Find the full variant object ----------
  const matchingVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return variants.find(v => v.color === selectedColor && v.size === selectedSize);
  }, [variants, selectedColor, selectedSize]);

  // Notify parent
  useEffect(() => {
    if (matchingVariant && onVariantChange) {
      onVariantChange(matchingVariant);
    }
  }, [matchingVariant, onVariantChange]);

  // ---------- 6. Render ----------
  if (variants.length === 0) {
    return <div className="text-sm text-red-500 py-4">No variants available.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Color section */}
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Color: <span className="font-normal">{selectedColor || '—'}</span>
        </p>
        <ColorPicker
          colors={availableColors}
          selectedColor={selectedColor}
          onSelectColor={handleColorChange}
        />
        {availableColors.length === 0 && (
          <p className="text-red-500 text-xs mt-2">Out of stock – no colors available.</p>
        )}
      </div>

      {/* Size section */}
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Size: <span className="font-normal">{selectedSize || '—'}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {allSizes.map(size => {
            const isDisabled = !selectedColor || 
              !(sizesByColor[selectedColor]?.includes(size) ?? false);
            return (
              <button
                key={size}
                onClick={() => !isDisabled && handleSizeChange(size)}
                disabled={isDisabled}
                aria-label={`Size ${size}`}
                className={`px-5 py-3 rounded-xl border font-medium text-sm transition-all
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                  ${selectedSize === size
                    ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
                    : isDisabled
                    ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200'
                    : 'bg-white dark:bg-gray-900 text-gray-800 border-gray-300 hover:border-purple-400'
                  }`}
              >
                {size}
              </button>
            );
          })}
        </div>
        {selectedColor && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Only sizes in stock are selectable.
          </p>
        )}
      </div>

      {/* Optional summary card */}
      {matchingVariant && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Selected</span>
            <span className="font-medium">{selectedColor} • {selectedSize}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${
              matchingVariant.stockQuantity > 10 ? 'bg-green-500' :
              matchingVariant.stockQuantity > 0 ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            <span>
              {matchingVariant.stockQuantity > 0
                ? `${matchingVariant.stockQuantity} left in stock`
                : 'Out of stock'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantSelector;