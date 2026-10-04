import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../layout/PageContainer';
import { StatusBadge } from '../ui/StatusBadge';
import { PaymentStatusBadge } from '../ui/PaymentStatusBadge';
import { Button } from '../ui/Button';
import { ShoppingBag, ArrowRight, Plus, Search, Filter } from 'lucide-react';
import { OrderStatus } from '../../types';

export const OrdersPage: React.FC = () => {
  const { orders, currentRole, placeOrder, showToast } = useApp();
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch =
      search === '' ||
      o.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      o.skillPartnerName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSimulateNewOrder = () => {
    const newOrd = placeOrder({
      productId: 'prod-1',
      quantity: 1,
      customerName: 'Samina Khan',
      customerCity: 'Lahore (Gulberg)',
      customerPhone: '0321-4567890',
      customerAddress: 'Plaza 8, Main Gulberg, Lahore',
      paymentMethod: 'jazzcash',
    });
    showToast(`New test order ${newOrd.trackingNumber} generated.`, 'success', 'Order Simulated');
  };

  return (
    <PageContainer
      kicker="Fulfillment & Operations"
      title="Orders Lifecycle Management"
      description="Track orders through the 6-stage lifecycle: Placed → Batched → In Production → QC → Dispatched → Delivered."
      primaryAction={
        <Button
          onClick={handleSimulateNewOrder}
          variant="executiveGreen"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Simulate New Order</span>
        </Button>
      }
    >
      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 font-sans">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs font-semibold overflow-x-auto">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'placed', label: 'Placed' },
            { id: 'reviewed_batched', label: 'Allocated' },
            { id: 'in_production', label: 'In Production' },
            { id: 'quality_verified', label: 'Quality Passed' },
            { id: 'dispatched', label: 'Dispatched' },
            { id: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                filter === tab.id
                  ? 'bg-[#01411C] text-white shadow-xs'
                  : 'text-[#4A5D52] hover:text-[#01411C] hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracking or customer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#01411C] font-sans"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] border-b border-stone-200 text-[#718579] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Product & Craft</th>
                <th className="py-3 px-4">Skill Partner (Artisan)</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Lifecycle Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Amount (PKR)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#F0FDF4]/50 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#01411C]">
                      {order.trackingNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#1A2E22] block line-clamp-1">
                        {order.productTitle}
                      </span>
                      <span className="text-[10px] text-[#718579]">
                        Qty: {order.quantity} · {order.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#1A2E22] block">
                        {order.skillPartnerName}
                      </span>
                      <span className="text-[10px] text-[#718579] font-mono">
                        {order.skillPartnerCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#1A2E22] block">
                        {order.customerName}
                      </span>
                      <span className="text-[10px] text-[#718579]">
                        {order.customerCity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-[#01411C] tabular-nums">
                      PKR {order.totalPKR.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        to={`/orders/${order.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 group-hover:bg-[#01411C] group-hover:text-white transition-colors text-xs font-bold text-[#4A5D52]"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};
