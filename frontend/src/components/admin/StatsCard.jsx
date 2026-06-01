import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

/**
 * StatsCard Component - Modern Style
 */
const StatsCard = ({ icon: Icon, label, value, change, changeLabel }) => {
  const isPositive = change && change.startsWith('+');
  const isNegative = change && change.startsWith('-');

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {label}
          </p>
          <h4 className="text-2xl font-bold text-dark-950">
            {value}
          </h4>
        </div>
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-sneaker-orange flex items-center justify-center">
          <Icon size={20} />
        </div>
      </div>
      
      {(change || changeLabel) && (
        <div className="mt-4 flex items-center space-x-2 text-xs">
          {change && (
            <span className={`font-semibold flex items-center ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-500'}`}>
              {isPositive && <FiTrendingUp className="mr-1" size={12} />}
              {isNegative && <FiTrendingDown className="mr-1" size={12} />}
              {change}
            </span>
          )}
          {changeLabel && (
            <span className="text-gray-400 font-medium">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
