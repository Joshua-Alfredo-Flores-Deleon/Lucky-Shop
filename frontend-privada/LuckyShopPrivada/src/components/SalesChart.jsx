import React, { useState } from 'react';

const monthlyData = [
  { label: 'dic 25', value: 18, displayValue: '$18K' },
  { label: 'en', value: 28, displayValue: '$28K' },
  { label: 'feb', value: 24, displayValue: '$24K' },
  { label: 'mar', value: 36, displayValue: '$36K' },
  { label: 'abr', value: 45, displayValue: '$45K', highlight: true, displayTooltip: 'ABR: $28K' }, // matches image tooltip text & green highlight
  { label: 'may', value: 32, displayValue: '$32K' },
  { label: 'jun', value: 28, displayValue: '$28K' }
];

const weeklyData = [
  { label: 'lun', value: 12, displayValue: '$1.2K' },
  { label: 'mar', value: 22, displayValue: '$2.2K' },
  { label: 'mié', value: 18, displayValue: '$1.8K' },
  { label: 'jue', value: 35, displayValue: '$3.5K', highlight: true, displayTooltip: 'JUE: $3.5K' },
  { label: 'vie', value: 28, displayValue: '$2.8K' },
  { label: 'sáb', value: 15, displayValue: '$1.5K' },
  { label: 'dom', value: 10, displayValue: '$1.0K' }
];

export default function SalesChart() {
  const [timeframe, setTimeframe] = useState('monthly'); // 'monthly' | 'weekly'
  const [activeIndex, setActiveIndex] = useState(4); // Default to ABR (index 4) for monthly

  const data = timeframe === 'monthly' ? monthlyData : weeklyData;

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    // Set default highlighted item for new timeframe
    if (newTimeframe === 'monthly') {
      setActiveIndex(4); // ABR
    } else {
      setActiveIndex(3); // JUE
    }
  };

  // Find max value to compute height percentage
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2 className="chart-title">Tendencia de ventas</h2>
        <div className="chart-toggle">
          <button 
            className={`toggle-btn ${timeframe === 'monthly' ? 'active' : ''}`}
            onClick={() => handleTimeframeChange('monthly')}
          >
            Mensual
          </button>
          <button 
            className={`toggle-btn ${timeframe === 'weekly' ? 'active' : ''}`}
            onClick={() => handleTimeframeChange('weekly')}
          >
            Semanal
          </button>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-grid-lines">
          <div className="grid-line"></div>
          <div className="grid-line"></div>
          <div className="grid-line"></div>
          <div className="grid-line"></div>
        </div>

        <div className="chart-bars-wrapper">
          {data.map((item, index) => {
            const heightPercent = `${(item.value / maxValue) * 80}%`; // Cap at 80% to leave room for tooltip
            const isHighlighted = index === activeIndex;
            const tooltipText = item.displayTooltip || `${item.label.toUpperCase()}: ${item.displayValue}`;

            return (
              <div 
                key={index} 
                className="chart-bar-col"
                onMouseEnter={() => setActiveIndex(index)}
              >
                {isHighlighted && (
                  <div className="bar-tooltip">
                    {tooltipText}
                  </div>
                )}
                <div 
                  className={`chart-bar ${isHighlighted ? 'highlighted' : ''}`}
                  style={{ height: heightPercent }}
                ></div>
                <span className="chart-label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
