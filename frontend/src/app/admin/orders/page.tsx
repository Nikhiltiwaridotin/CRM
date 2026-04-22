"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';

type Order = {
  id: number;
  trackingId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

const STATUS_OPTIONS = [
  'Pending',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">{order.trackingId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(order.createdAt), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(order.totalAmount).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={updating === order.id}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border bg-white disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
