import React from 'react';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../layout/PageContainer';
import { StatCard } from '../ui/StatCard';
import { TrendingUp, Users, HeartHandshake, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { impactMetrics } = useApp();

  return (
    <PageContainer
      kicker="Social & Economic Return"
      title="Verified Enterprise Impact"
      description="Measuring tangible household income growth and craft preservation across Pakistan."
    >
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8 font-sans">
        <StatCard
          label="Women Artisans Engaged"
          value={impactMetrics.womenEngaged}
          sublabel="Home-based producer CEOs"
          variant="executiveGreen"
        />
        <StatCard
          label="Direct Household Remuneration"
          value={`PKR ${(impactMetrics.totalIncomeGeneratedPKR / 1000000).toFixed(2)}M`}
          sublabel="Zero predatory deduction"
          variant="lightGreen"
        />
        <StatCard
          label="Orders Delivered"
          value={impactMetrics.ordersCompleted}
          sublabel="100% verified craft delivery"
          variant="default"
        />
        <StatCard
          label="Active Production Batches"
          value={impactMetrics.activeBatches}
          sublabel="In-flight cluster production"
          variant="default"
        />
        <StatCard
          label="Repeat Citizen Rate"
          value={`${impactMetrics.repeatCitizensRate || impactMetrics.repeatPatronsRate}%`}
          sublabel="Sustained commercial demand"
          variant="lightGreen"
        />
        <StatCard
          label="Physical QC Pass Rate"
          value={`${impactMetrics.verifiedQualityRate}%`}
          sublabel="6-point dignity audits"
          variant="executiveGreen"
        />
      </div>

      {/* Cluster Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#01411C]">
            <MapPin className="w-4 h-4" />
            <span>Multan Needlecraft Cluster</span>
          </div>
          <h4 className="text-sm font-bold text-[#1A2E22]">Kashidakari & Resham Silk</h4>
          <p className="text-xs text-[#4A5D52] leading-relaxed">
            34 home-based women generating an average monthly income of PKR 38,000 without leaving their family quarters.
          </p>
          <div className="pt-2 border-t border-stone-100 text-[11px] text-[#718579]">
            Lead Producer: <strong>Kalsoom Bibi</strong>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#01411C]">
            <MapPin className="w-4 h-4" />
            <span>Cholistan Desert Cluster</span>
          </div>
          <h4 className="text-sm font-bold text-[#1A2E22]">Folk Ralli Quilting & Patchwork</h4>
          <p className="text-xs text-[#4A5D52] leading-relaxed">
            22 pastoralist artisans preserving ancestral geometric patchwork. Doorstep material drops coordinated by Fatima Zehra.
          </p>
          <div className="pt-2 border-t border-stone-100 text-[11px] text-[#718579]">
            Lead Producer: <strong>Razia Begum</strong>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#01411C]">
            <MapPin className="w-4 h-4" />
            <span>Sargodha Orchard Cluster</span>
          </div>
          <h4 className="text-sm font-bold text-[#1A2E22]">Sun-Cured Chaunsa Mango Achar</h4>
          <p className="text-xs text-[#4A5D52] leading-relaxed">
            18 kitchen matriarchs scaling generational family recipes into commercial food-safety certified batches.
          </p>
          <div className="pt-2 border-t border-stone-100 text-[11px] text-[#718579]">
            Lead Producer: <strong>Tahira Jabeen</strong>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
