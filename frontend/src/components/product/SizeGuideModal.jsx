import { useState, useMemo } from 'react';
import { FiX, FiInfo, FiUser, FiArrowRight } from 'react-icons/fi';

/**
 * SizeGuideModal Component
 * Hiển thị bảng Size và tính năng Fit Predictor
 */
const SizeGuideModal = ({ isOpen, onClose, sizeGuideJson }) => {
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'predictor'
  const [footLength, setFootLength] = useState('');
  const [footWidth, setFootWidth] = useState('');
  const [fitPreference, setFitPreference] = useState('regular');
  const [predictedSize, setPredictedSize] = useState(null);

  // Parse JSON data safely
  const sizeData = useMemo(() => {
    if (!sizeGuideJson) return null;
    try {
      return JSON.parse(sizeGuideJson);
    } catch (e) {
      console.error('Invalid size guide JSON', e);
      return null;
    }
  }, [sizeGuideJson]);

  if (!isOpen || !sizeData) return null;

  const { attributes, sizes } = sizeData;

  const handlePredict = (e) => {
    e.preventDefault();
    if (!footLength || !footWidth) return;

    const fl = parseInt(footLength);
    const fw = parseInt(footWidth);

    const parseValue = (s) => {
      if (!s) return 0;
      s = String(s).trim().toLowerCase();
      if (s.includes('m')) {
        const parts = s.split('m');
        const m = parseInt(parts[0]) || 0;
        let cm = parts[1] || '';
        if (cm.length === 1) cm += '0'; // 1m5 -> 1m50
        return m * 100 + (parseInt(cm) || 0);
      }
      return Number(s) || 0;
    };

    const parseRange = (str) => {
      if (!str) return [0, 999];
      str = String(str).trim().toLowerCase();
      if (str.startsWith('>')) return [parseValue(str.substring(1)), 999];
      if (str.startsWith('<')) return [0, parseValue(str.substring(1))];
      const parts = str.split('-');
      if (parts.length === 2) {
        return [parseValue(parts[0]), parseValue(parts[1])];
      }
      return [0, 999];
    };

    let matchScore = -9999;
    let bestIndex = 0;

    sizes.forEach((size, index) => {
      let score = 0;
      
      const [lMin, lMax] = parseRange(size.height || size.footLength || size.length);
      const [wMin, wMax] = parseRange(size.weight || size.footWidth || size.width);

      if (fl >= lMin && fl <= lMax) {
        score += 10;
      } else {
        const lDist = Math.min(Math.abs(fl - lMin), Math.abs(fl - lMax));
        score -= lDist * 2;
      }

      if (fw >= wMin && fw <= wMax) {
        score += 5;
      } else {
        const wDist = Math.min(Math.abs(fw - wMin), Math.abs(fw - wMax));
        score -= wDist;
      }

      if (score > matchScore) {
        matchScore = score;
        bestIndex = index;
      }
    });

    // Apply Fit Preference Adjustment
    if (fitPreference === 'slim' && bestIndex > 0) {
      bestIndex -= 1;
    } else if (fitPreference === 'oversize' && bestIndex < sizes.length - 1) {
      bestIndex += 1;
    }

    setPredictedSize(sizes[bestIndex].name);
  };

  /* ─── Input class helper ─── */
  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-dark-950 font-medium focus:outline-none focus:border-sneaker-orange focus:ring-2 focus:ring-sneaker-orange/10 transition-all text-center";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-dark-950 flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-orange-50 text-sneaker-orange flex items-center justify-center">
              <FiInfo size={18} />
            </span>
            <span>Size Guide</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-dark-950 hover:bg-gray-50 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 shrink-0 px-2 pt-2 bg-gray-50/50">
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 rounded-t-lg mx-1
              ${activeTab === 'chart' 
                ? 'border-sneaker-orange text-sneaker-orange bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'}`}
            onClick={() => setActiveTab('chart')}
          >
            Size Chart
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 rounded-t-lg mx-1
              ${activeTab === 'predictor' 
                ? 'border-sneaker-orange text-sneaker-orange bg-white' 
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'}`}
            onClick={() => setActiveTab('predictor')}
          >
            Fit Predictor
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'chart' && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-gray-500 font-medium text-sm text-center">
                EU size reference. Please allow a ±0.5 size variation due to manufacturing processes.
              </p>
              
              <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="w-full text-center text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 font-semibold text-gray-600">SIZE (EU)</th>
                      <th className="p-4 font-semibold text-gray-600">FOOT LENGTH (CM)</th>
                      <th className="p-4 font-semibold text-gray-600">FOOT WIDTH (MM)</th>
                      {attributes?.map(attr => (
                        <th key={attr} className="p-4 font-semibold text-gray-600 uppercase">
                          {attr}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sizes?.map(size => (
                      <tr key={size.name} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-bold text-dark-950 bg-gray-50/30">{size.name}</td>
                        <td className="p-4 font-medium text-gray-700">{size.footLength || size.height || '-'}</td>
                        <td className="p-4 font-medium text-gray-700">{size.footWidth || size.weight || '-'}</td>
                        {attributes?.map(attr => (
                          <td key={attr} className="p-4 font-medium text-gray-700">
                            {size.measurements[attr] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 flex gap-3 items-start border border-orange-100/50">
                <FiInfo className="text-sneaker-orange mt-0.5 shrink-0" size={18} />
                <p className="text-sm text-orange-900 leading-relaxed font-medium">
                  <strong className="font-bold">Note:</strong> Sneakers typically run true to size. Leather shoes may stretch slightly with wear. If you are between sizes, we recommend going half a size up for a comfortable fit.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'predictor' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-sneaker-orange flex items-center justify-center mx-auto mb-4">
                  <FiUser size={28} />
                </div>
                <h3 className="text-xl font-bold text-dark-950">Find Your Perfect Fit</h3>
                <p className="text-gray-500 font-medium text-sm mt-1">
                  Enter your foot measurements below to get our most accurate size recommendation.
                </p>
              </div>

              <form onSubmit={handlePredict} className="max-w-md mx-auto space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 block text-center">Foot Length (CM)</label>
                    <input
                      type="number"
                      required
                      min="20"
                      max="35"
                      step="0.1"
                      value={footLength}
                      onChange={(e) => setFootLength(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. 26.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-600 block text-center">Foot Width (MM)</label>
                    <input
                      type="number"
                      required
                      min="60"
                      max="120"
                      value={footWidth}
                      onChange={(e) => setFootWidth(e.target.value)}
                      className={inputCls}
                      placeholder="e.g. 95"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-gray-600 block text-center">Fit Preference</label>
                  <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                    {[['slim', 'Snug'], ['regular', 'True to Size'], ['oversize', '+0.5 Up']].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFitPreference(val)}
                        className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                          fitPreference === val 
                            ? 'bg-white text-dark-950 shadow-sm border border-gray-200/60' 
                            : 'text-gray-500 hover:text-gray-800 border border-transparent'
                        }`}
                      >
                        {label}
                      </button>
                    ))}  
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-dark-950 text-white rounded-xl font-semibold hover:bg-sneaker-orange transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  Predict My Size <FiArrowRight />
                </button>
              </form>

              {predictedSize && (
                <div className="mt-8 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-center animate-scaleIn relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sneaker-orange to-orange-300"></div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sneaker-orange mb-2">
                    Recommended Size
                  </p>
                  <div className="text-5xl font-display font-black text-dark-950 mb-2">
                    EU {predictedSize}
                  </div>
                  <p className="text-gray-500 font-medium text-sm">
                    Based on your measurements ({footLength}cm x {footWidth}mm) and {fitPreference} fit preference.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
