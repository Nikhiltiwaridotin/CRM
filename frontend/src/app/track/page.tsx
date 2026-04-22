"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, Package, Truck, CheckCircle, PackageOpen } from 'lucide-react';
import api from '@/lib/api';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';

type TrackingHistory = {
  id: number;
  status: string;
  location: string;
  createdAt: string;
};

type OrderData = {
  trackingId: string;
  status: string;
  TrackingHistories: TrackingHistory[];
};

const STATUS_ICONS = {
  'Order Placed': PackageOpen,
  'Pending': Package,
  'Packed': Package,
  'Shipped': Truck,
  'In Transit': Truck,
  'Out for Delivery': MapPin,
  'Delivered': CheckCircle,
};

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setError('');
    setLoading(true);
    setOrder(null);

    try {
      const response = await api.get(`/tracking/${trackingId}`);
      setOrder(response.data);
      
      if (socket) {
        socket.emit('joinTracking', trackingId);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Order not found. Please check your tracking ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!socket || !order) return;

    const handleStatusChange = (data: any) => {
      setOrder((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: data.status,
          TrackingHistories: [
            ...prev.TrackingHistories,
            {
              id: Date.now(),
              status: data.status,
              location: data.location || 'In Transit',
              createdAt: data.timestamp || new Date().toISOString()
            }
          ]
        };
      });
    };

    socket.on('statusChange', handleStatusChange);

    return () => {
      socket.off('statusChange', handleStatusChange);
    };
  }, [socket, order]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Track Your Order</h1>
          <p className="mt-2 text-gray-600">Enter your tracking ID to see real-time delivery updates.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
              className="flex-1 appearance-none rounded-xl block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              <Search className="w-5 h-5" />
              <span className="ml-2 hidden sm:block">Track</span>
            </button>
          </form>
          {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
        </div>

        {order && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center border-b pb-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Tracking Number</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{order.trackingId}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-lg font-semibold text-gray-900">Tracking History</h3>
              <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {order.TrackingHistories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((history, index) => {
                  const Icon = STATUS_ICONS[history.status as keyof typeof STATUS_ICONS] || MapPin;
                  const isLatest = index === 0;
                  
                  return (
                    <div key={history.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${isLatest ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-gray-900">{history.status}</div>
                          <time className="font-medium text-xs text-gray-500">{format(new Date(history.createdAt), 'MMM d, p')}</time>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center mt-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          {history.location || 'Warehouse'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
