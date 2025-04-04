import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface RentalRecord {
  roomId: number;
  unitId: number;
  customer: string;
  startTime: string;
  endTime: string;
}

function RentalTable() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get active rentals from localStorage
  const getActiveRentals = () => {
    const savedRooms = localStorage.getItem('psRooms');
    if (!savedRooms) return [];

    const rooms = JSON.parse(savedRooms);
    const rentals: RentalRecord[] = [];

    rooms.forEach((room: any) => {
      room.units.forEach((unit: any) => {
        if (unit.isRented) {
          rentals.push({
            roomId: room.id,
            unitId: unit.id,
            customer: unit.customer,
            startTime: unit.startTime,
            endTime: unit.endTime,
          });
        }
      });
    });

    return rentals;
  };

  const calculateTimeRemaining = (endTime: string) => {
    const end = new Date(`${currentTime.toDateString()} ${endTime}`);
    const diff = end.getTime() - currentTime.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const activeRentals = getActiveRentals();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Active Rentals</h2>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PS Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeRentals.map((rental, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Room {rental.roomId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    PS Unit {rental.unitId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rental.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rental.startTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rental.endTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {calculateTimeRemaining(rental.endTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      calculateTimeRemaining(rental.endTime) === 'Expired'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {calculateTimeRemaining(rental.endTime) === 'Expired' ? 'Expired' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
              {activeRentals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No active rentals
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

export default RentalTable;