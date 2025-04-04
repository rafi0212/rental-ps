import React, { useState, useEffect } from 'react';
import { Gamepad2, Users, Clock, BarChart3 } from 'lucide-react';
import Swal from 'sweetalert2';

interface PSUnit {
  id: number;
  isRented: boolean;
  startTime?: string;
  endTime?: string;
  customer?: string;
}

interface Room {
  id: number;
  units: PSUnit[];
}

interface RentalHistory {
  roomId: number;
  unitId: number;
  customer: string;
  startTime: string;
  endTime: string;
  actualEndTime: string;
  status: 'completed' | 'early_termination';
}

// Load initial state from localStorage if available
const getInitialRooms = () => {
  const savedRooms = localStorage.getItem('psRooms');
  if (savedRooms) {
    return JSON.parse(savedRooms);
  }
  return Array.from({ length: 8 }, (_, roomIndex) => ({
    id: roomIndex + 1,
    units: Array.from({ length: 3 }, (_, unitIndex) => ({
      id: unitIndex + 1,
      isRented: false,
    })),
  }));
};

function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>(getInitialRooms);

  // Save rooms data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('psRooms', JSON.stringify(rooms));
  }, [rooms]);

  const totalUnits = rooms.reduce((acc, room) => acc + room.units.length, 0);
  const rentedUnits = rooms.reduce(
    (acc, room) => acc + room.units.filter(unit => unit.isRented).length,
    0
  );
  const availableUnits = totalUnits - rentedUnits;
  const occupancyRate = (rentedUnits / totalUnits) * 100;

  const startRental = async (roomId: number, unitId: number) => {
    const { value: formValues } = await Swal.fire({
      title: 'Start Rental',
      html:
        '<input id="swal-customer" class="swal2-input" placeholder="Customer Name">' +
        '<input id="swal-duration" class="swal2-input" type="number" placeholder="Duration (hours)">',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const customer = (document.getElementById('swal-customer') as HTMLInputElement).value;
        const duration = (document.getElementById('swal-duration') as HTMLInputElement).value;
        if (!customer || !duration) {
          Swal.showValidationMessage('Please fill in all fields');
          return false;
        }
        return [customer, parseInt(duration)];
      }
    });

    if (formValues) {
      const [customer, duration] = formValues;
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

      setRooms(prevRooms =>
        prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              units: room.units.map(unit => {
                if (unit.id === unitId) {
                  return {
                    ...unit,
                    isRented: true,
                    startTime: startTime.toLocaleTimeString(),
                    endTime: endTime.toLocaleTimeString(),
                    customer: customer,
                  };
                }
                return unit;
              }),
            };
          }
          return room;
        })
      );

      await Swal.fire({
        icon: 'success',
        title: 'Rental Started',
        text: `PS Unit has been rented to ${customer} until ${endTime.toLocaleTimeString()}`,
      });
    }
  };

  const endRental = async (roomId: number, unitId: number) => {
    const result = await Swal.fire({
      title: 'End Rental',
      text: 'Are you sure you want to end this rental?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, end it!'
    });

    if (result.isConfirmed) {
      const currentRoom = rooms.find(r => r.id === roomId);
      const unit = currentRoom?.units.find(u => u.id === unitId);

      if (unit && unit.customer && unit.startTime && unit.endTime) {
        // Save to rental history
        const historyEntry: RentalHistory = {
          roomId,
          unitId,
          customer: unit.customer,
          startTime: unit.startTime,
          endTime: unit.endTime,
          actualEndTime: new Date().toLocaleTimeString(),
          status: new Date().toLocaleTimeString() < unit.endTime ? 'early_termination' : 'completed'
        };

        const history = JSON.parse(localStorage.getItem('rentalHistory') || '[]');
        history.push(historyEntry);
        localStorage.setItem('rentalHistory', JSON.stringify(history));
      }

      setRooms(prevRooms =>
        prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              units: room.units.map(unit => {
                if (unit.id === unitId) {
                  return {
                    ...unit,
                    isRented: false,
                    startTime: undefined,
                    endTime: undefined,
                    customer: undefined,
                  };
                }
                return unit;
              }),
            };
          }
          return room;
        })
      );

      await Swal.fire({
        icon: 'success',
        title: 'Rental Ended',
        text: 'The PS Unit is now available for new rentals',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Units</p>
              <p className="text-2xl font-bold">{totalUnits}</p>
            </div>
            <Gamepad2 className="text-indigo-600" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Rented Units</p>
              <p className="text-2xl font-bold">{rentedUnits}</p>
            </div>
            <Users className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Available Units</p>
              <p className="text-2xl font-bold">{availableUnits}</p>
            </div>
            <Clock className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Occupancy Rate</p>
              <p className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</p>
            </div>
            <BarChart3 className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Room {room.id}</h2>
            <div className="space-y-4">
              {room.units.map(unit => (
                <div
                  key={unit.id}
                  className={`p-4 rounded-lg ${
                    unit.isRented ? 'bg-red-100' : 'bg-green-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">PS Unit {unit.id}</span>
                    <button
                      onClick={() => unit.isRented ? endRental(room.id, unit.id) : startRental(room.id, unit.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        unit.isRented
                          ? 'bg-red-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {unit.isRented ? 'End Rental' : 'Start Rental'}
                    </button>
                  </div>
                  {unit.isRented && (
                    <div className="text-sm text-gray-600">
                      <p>Customer: {unit.customer}</p>
                      <p>Start: {unit.startTime}</p>
                      <p>End: {unit.endTime}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;