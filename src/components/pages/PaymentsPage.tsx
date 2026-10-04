import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../layout/PageContainer';
import { StatCard } from '../ui/StatCard';
import { Button } from '../ui/Button';
import { CreditCard, DollarSign, ShieldCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const {
    payments,
    payouts,
    orders,
    releaseArtisanPayout,
    openConfirmDialog,
    showToast,
  } = useApp();

  const totalHeldInEscrow = orders
    .filter((o) => !o.payoutReleased)
    .reduce((sum, o) => sum + o.payoutAmountPKR, 0);

  const totalDisbursed = payouts
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amountPKR, 0);

  const handleAuthorizePendingPayout = (orderId: string, artisanName: string, amount: number) => {
    openConfirmDialog({
      title: 'Authorize Direct Remuneration Payout',
      message: `Disburse PKR ${amount.toLocaleString()} directly to ${artisanName}'s mobile wallet via JazzCash? The escrow reserve will settle immediately.`,
      confirmLabel: 'Disburse Funds',
      variant: 'success',
      onConfirm: () => {
        releaseArtisanPayout(orderId);
      },
    });
  };

  const pendingPayoutOrders = orders.filter((o) => !o.payoutReleased && o.status === 'delivered');

  return (
    <PageContainer
      kicker="Financial Transparency"
      title="Financial Ledger & Artisan Remuneration"
      description="Zero delay, transparent direct remuneration ledger with automated mobile wallet settlements."
    >
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-sans">
        <StatCard
          label="Total Disbursed to Artisans"
          value={`PKR ${(totalDisbursed / 1000).toFixed(0)}k`}
          sublabel="Settled to mobile wallets"
          variant="executiveGreen"
        />
        <StatCard
          label="Current Escrow Reserve"
          value={`PKR ${(totalHeldInEscrow / 1000).toFixed(0)}k`}
          sublabel="Held safely for active batches"
          variant="lightGreen"
        />
        <StatCard
          label="Total Ledger Entries"
          value={payments.length}
          sublabel="Immutable transaction log"
          variant="default"
        />
        <StatCard
          label="Pending Payout Releases"
          value={pendingPayoutOrders.length}
          sublabel="Delivered orders ready for payout"
          variant={pendingPayoutOrders.length > 0 ? 'executiveGreen' : 'default'}
        />
      </div>

      {/* Pending Payout Actions (if any delivered order needs payout) */}
      {pendingPayoutOrders.length > 0 && (
        <div className="mb-8 p-4 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0] space-y-3 font-sans">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#01411C] uppercase tracking-wider">
              Pending Deliveries Ready for Remuneration Release
            </h4>
            <span className="text-[10px] font-bold text-[#01411C] bg-white px-2 py-0.5 rounded border border-[#BBF7D0]">
              Action Required
            </span>
          </div>

          <div className="space-y-2">
            {pendingPayoutOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#BBF7D0]"
              >
                <div>
                  <p className="text-xs font-bold text-[#1A2E22]">
                    Order {ord.trackingNumber} · {ord.productTitle}
                  </p>
                  <p className="text-[11px] text-[#4A5D52]">
                    Artisan: <strong>{ord.skillPartnerName}</strong> · PKR {ord.payoutAmountPKR.toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleAuthorizePendingPayout(ord.id, ord.skillPartnerName, ord.payoutAmountPKR)}
                  variant="executiveGreen"
                  size="sm"
                >
                  <CreditCard className="w-3.5 h-3.5 mr-1" />
                  <span>Release Payout</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs font-sans">
        <div className="p-4 border-b border-stone-200 bg-[#FAF9F6] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2E22]">
            General Transaction Ledger
          </h3>
          <span className="text-[11px] text-[#718579]">
            {payments.length} transactions recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-[#718579] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Recipient / Entity</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {payments.map((entry) => (
                <tr key={entry.id} className="hover:bg-stone-50">
                  <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                    {entry.timestamp}
                  </td>
                  <td className="py-3 px-4 capitalize font-semibold text-[#1A2E22]">
                    {entry.type.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#1A2E22]">
                    {entry.recipientName}
                  </td>
                  <td className="py-3 px-4 text-[#4A5D52] max-w-xs truncate">
                    {entry.note}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        entry.status === 'settled'
                          ? 'bg-[#F0FDF4] text-[#01411C] border border-[#BBF7D0]'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {entry.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-[#01411C] tabular-nums">
                    PKR {entry.amountPKR.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};
