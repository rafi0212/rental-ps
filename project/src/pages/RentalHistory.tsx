import React, { useState, useEffect } from 'react';
import { History, ArrowUpDown } from 'lucide-react';

interface RentalHistory {
  roomId: number;
  unitId: number;
  customer: string;
  startTime: string;
  endTime: string;
  actualEndTime: string;
  status: 'completed' | 'early_termination';
}

function RentalHistory() {
  const [history, setHistory] = useState<RentalHistory[]>([]);
  const [sortField, setSortField] = useState<keyof RentalHistory>('startTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const savedHistory = localStorage.getItem('rentalHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const sortHistory = (field: keyof RentalHistory) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedHistory = [...history].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Rental History</h2>
            </div>
            <div className="text-sm text-gray-500">
              Total Records: {history.length}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Room', 'PS Unit', 'Customer', 'Start Time', 'Scheduled End', 'Actual End', 'Status'].map((header, index) => (
                  <th
                    key={index}
                    onClick={() => sortHistory(header.toLowerCase().replace(' ', '') as keyof RentalHistory)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{header}</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedHistory.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    Room {record.roomId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    PS Unit {record.unitId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.startTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.endTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.actualEndTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status === 'completed' ? 'Completed' : 'Early Termination'}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No rental history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RentalHistory;