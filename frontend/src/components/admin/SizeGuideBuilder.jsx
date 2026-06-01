import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiAlertCircle, FiX } from 'react-icons/fi';

/**
 * SizeGuideBuilder Component (For Shoes)
 * Visual builder for Size Guide JSON
 */
const SizeGuideBuilder = ({ value, onChange }) => {
  const [data, setData] = useState({
    type: 'shoes',
    attributes: ['US Size', 'UK Size'],
    sizes: []
  });
  const [error, setError] = useState(null);

  // Parse initial value
  useEffect(() => {
    if (!value) {
      setData({ type: 'shoes', attributes: ['US Size', 'UK Size'], sizes: [] });
      return;
    }
    
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object') {
        setData({
          type: 'shoes', // Always force shoes since this is a sneaker store
          attributes: parsed.attributes || ['US Size', 'UK Size'],
          sizes: parsed.sizes || []
        });
        setError(null);
      }
    } catch (e) {
      setError('Current data is not valid JSON. Using default builder state.');
    }
  }, [value]);

  // Trigger onChange when data changes
  const updateData = (newData) => {
    setData(newData);
    onChange(JSON.stringify(newData));
  };

  const handleAddAttribute = () => {
    const attrName = prompt("Enter new attribute name (e.g. EU Size, US Women):");
    if (attrName && !data.attributes.includes(attrName)) {
      updateData({ ...data, attributes: [...data.attributes, attrName] });
    }
  };

  const handleRemoveAttribute = (attrToRemove) => {
    const newAttrs = data.attributes.filter(a => a !== attrToRemove);
    updateData({ ...data, attributes: newAttrs });
  };

  const handleAddSize = () => {
    updateData({
      ...data,
      sizes: [
        ...data.sizes,
        {
          name: '',
          footLength: '',
          footWidth: '',
          measurements: {}
        }
      ]
    });
  };

  const handleRemoveSize = (index) => {
    const newSizes = [...data.sizes];
    newSizes.splice(index, 1);
    updateData({ ...data, sizes: newSizes });
  };

  const handleSizeChange = (index, field, val) => {
    const newSizes = [...data.sizes];
    newSizes[index][field] = val;
    updateData({ ...data, sizes: newSizes });
  };

  const handleMeasurementChange = (index, attr, val) => {
    const newSizes = [...data.sizes];
    if (!newSizes[index].measurements) newSizes[index].measurements = {};
    newSizes[index].measurements[attr] = val;
    updateData({ ...data, sizes: newSizes });
  };

  return (
    <div className="rounded-xl border border-gray-200 p-5 space-y-5 bg-gray-50/50">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-2 border border-red-100">
          <FiAlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Settings */}
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-[2] space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">Measurement Attributes (Extra Columns)</label>
          <div className="flex flex-wrap gap-2 items-center min-h-[44px] p-2 rounded-xl border border-gray-200 bg-white">
            {data.attributes.map(attr => (
              <span key={attr} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-gray-200">
                <span>{attr}</span>
                <button type="button" onClick={() => handleRemoveAttribute(attr)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <FiX size={12} />
                </button>
              </span>
            ))}
            <button 
              type="button" 
              onClick={handleAddAttribute}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:text-dark-950 hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              + Add Attribute
            </button>
          </div>
        </div>
      </div>

      {/* Sizes Table */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-gray-600">Shoe Sizes Configuration</label>
          <button 
            type="button" 
            onClick={handleAddSize}
            className="text-xs font-semibold bg-white border border-gray-200 text-dark-950 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FiPlus size={14} />
            <span>Add Row</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-3 font-semibold text-gray-600 w-24">Size (EU)</th>
                <th className="p-3 font-semibold text-gray-600 w-32">Foot Length (cm)</th>
                <th className="p-3 font-semibold text-gray-600 w-32 border-r border-gray-100">Foot Width (mm)</th>
                {data.attributes.map(attr => (
                  <th key={attr} className="p-3 font-semibold text-gray-600">{attr}</th>
                ))}
                <th className="p-3 font-semibold text-gray-600 text-center w-12">#</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.sizes.length === 0 ? (
                <tr>
                  <td colSpan={data.attributes.length + 4} className="p-8 text-center text-gray-500">
                    No sizes added yet. Click <span className="font-semibold text-dark-950">Add Row</span> to begin.
                  </td>
                </tr>
              ) : (
                data.sizes.map((size, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-2">
                      <input 
                        type="text" 
                        value={size.name} 
                        onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                        placeholder="e.g. 42"
                        className="w-full p-2 rounded-lg border border-gray-200 focus:border-sneaker-orange outline-none text-center font-semibold bg-white"
                      />
                    </td>
                    <td className="p-2">
                      <input 
                        type="text" 
                        value={size.footLength || ''} 
                        onChange={(e) => handleSizeChange(index, 'footLength', e.target.value)}
                        placeholder="e.g. 26-26.5"
                        className="w-full p-2 rounded-lg border border-gray-200 focus:border-sneaker-orange outline-none text-center bg-white"
                      />
                    </td>
                    <td className="p-2 border-r border-gray-100">
                      <input 
                        type="text" 
                        value={size.footWidth || ''} 
                        onChange={(e) => handleSizeChange(index, 'footWidth', e.target.value)}
                        placeholder="e.g. 95-100"
                        className="w-full p-2 rounded-lg border border-gray-200 focus:border-sneaker-orange outline-none text-center bg-white"
                      />
                    </td>
                    {data.attributes.map(attr => (
                      <td key={attr} className="p-2">
                        <input 
                          type="text" 
                          value={size.measurements?.[attr] || ''} 
                          onChange={(e) => handleMeasurementChange(index, attr, e.target.value)}
                          placeholder="0"
                          className="w-full p-2 rounded-lg border border-gray-200 focus:border-sneaker-orange outline-none text-center bg-white"
                        />
                      </td>
                    ))}
                    <td className="p-2 text-center">
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSize(index)}
                        className="text-gray-400 p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Remove row"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Note: Values for foot length and width can be exact numbers (e.g., 26) or ranges (e.g., 25-26).
        </p>
      </div>
    </div>
  );
};

export default SizeGuideBuilder;
