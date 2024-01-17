import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import 'echarts/dist/echarts'; // Import the default echarts stylesheet

echarts.use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

const DynamicChart: React.FC = () => {
  const [departmentData, setDepartmentData] = useState([
    { name: 'Operations', highPerformers: 15, overall: 25 },
    { name: 'Sales', highPerformers: 20, overall: 30 },
    { name: 'IT', highPerformers: 10, overall: 20 },
    { name: 'Finance', highPerformers: 25, overall: 35 },
    { name: 'Marketing', highPerformers: 18, overall: 28 },
    { name: 'HR', highPerformers: 12, overall: 15 },
    { name: 'Customer Support', highPerformers: 8, overall: 10 },
    { name: 'Office of CEO', highPerformers: 5, overall: 8 },
    { name: 'Overall', highPerformers: 20, overall: 30 },
  ]);

  const [newDepartment, setNewDepartment] = useState('');
  const [newHighPerformers, setNewHighPerformers] = useState<number | ''>('');
  const [newOverall, setNewOverall] = useState<number | ''>('');

  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option = {
        title: {
          text: 'Comparison of High Performer Resignation Rates to the Overall Resignation Rate',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: '{b}: {c}%',
        },
        legend: {
          data: ['High Performers', 'Overall', 'Percentage Difference'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLabel: {
            formatter: '{value}%',
          },
          name: 'Resignation Rate',
        },
        yAxis: {
          type: 'category',
          data: departmentData.map((item) => item.name),
          name: 'Departments',
        },
        series: [
          {
            name: 'High Performers',
            type: 'bar',
            data: departmentData.map((item) => item.highPerformers),
            label: {
              show: true,
              position: 'right',
              formatter: '{c}%',
            },
          },
          {
            name: 'Overall',
            type: 'bar',
            data: departmentData.map((item) => item.overall),
            label: {
              show: true,
              position: 'right',
              formatter: '{c}%',
            },
          },
          {
            name: 'Percentage Difference',
            type: 'bar',
            data: departmentData.map((item) => ((item.highPerformers - item.overall) / item.overall) * 100),
            label: {
              show: true,
              position: 'right',
              formatter: '{c}%',
            },
          },
        ],
      };

      myChart.setOption(option);

      // Cleanup
      return () => {
        myChart.dispose();
      };
    }
  }, [departmentData]);

  const addDepartment = () => {
    if (newDepartment && newHighPerformers !== '' && newOverall !== '') {
      const newDepartmentData = [
        ...departmentData,
        {
          name: newDepartment,
          highPerformers: Number(newHighPerformers),
          overall: Number(newOverall),
        },
      ];

      setDepartmentData(newDepartmentData);
      setNewDepartment('');
      setNewHighPerformers('');
      setNewOverall('');
    }
  };

  const getTotalHighPerformers = () => departmentData.reduce((total, item) => total + item.highPerformers, 0);

  const getTotalOverall = () => departmentData.reduce((total, item) => total + item.overall, 0);

  const getAveragePercentageDifference = () => {
    const totalDifference = departmentData.reduce(
      (total, item) => total + ((item.highPerformers - item.overall) / item.overall) * 100,
      0
    );
    return totalDifference / departmentData.length;
  };

  return (
    <div>
      <div ref={chartRef} style={{ width: '100%', height: '400px', margin: '0 auto', textAlign: 'center' }} />
      <div style={{ width: '80%', margin: '20px auto', textAlign: 'center' }}>
        <label>
          Department:
          <input
            type="text"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label>
          High Performers (%):
          <input
            type="number"
            value={newHighPerformers}
            onChange={(e) => setNewHighPerformers(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
        <label>
          Overall (%):
          <input
            type="number"
            value={newOverall}
            onChange={(e) => setNewOverall(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
        <button onClick={addDepartment} style={buttonStyle}>Add Department</button>
      </div>
      <table style={{ width: '80%', margin: '20px auto', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={tableCellStyle}>Department</th>
            <th style={tableCellStyle}>High Performers</th>
            <th style={tableCellStyle}>Overall</th>
            <th style={tableCellStyle}>Percentage Difference</th>
          </tr>
        </thead>
        <tbody>
          {departmentData.map((item, index) => (
            <tr key={index} style={(index % 2 === 0) ? { background: '#f9f9f9' } : { background: '#fff' }}>
              <td style={tableCellStyle}>{item.name}</td>
              <td style={tableCellStyle}>{item.highPerformers}%</td>
              <td style={tableCellStyle}>{item.overall}%</td>
              <td style={tableCellStyle}>
                {((item.highPerformers - item.overall) / item.overall * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: '#e6e6e6', fontWeight: 'bold' }}>
            <td style={tableCellStyle}>Total</td>
            <td style={tableCellStyle}>{getTotalHighPerformers()}%</td>
            <td style={tableCellStyle}>{getTotalOverall()}%</td>
            <td style={tableCellStyle}>
              {getAveragePercentageDifference().toFixed(2)}%
            </td>
          </tr>
        </tfoot>
      </table>
      <p style={{ width: '80%', margin: '20px auto', textAlign: 'justify' }}>
        This table provides a comparison of high performer resignation rates to the overall resignation rate across different departments.
        The "High Performers" column represents the resignation rates of high performers in each department, the "Overall" column represents the overall resignation rates,
        and the "Percentage Difference" column shows the percentage difference between high performers and overall resignation rates.
        The summary below the table displays the total high performers, total overall, and the average percentage difference.
      </p>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: '8px',
  margin: '0 5px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '14px',
};

const buttonStyle: React.CSSProperties = {
  padding: '8px',
  margin: '0 5px',
  borderRadius: '4px',
  border: '1px solid #007BFF',
  background: '#007BFF',
  color: '#fff',
  fontSize: '14px',
  cursor: 'pointer',
};

const tableCellStyle: React.CSSProperties = {
  padding: '8px',
  textAlign: 'center',
  border: '1px solid #ddd',
};

export default DynamicChart;
