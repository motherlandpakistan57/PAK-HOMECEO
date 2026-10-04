import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageContainer } from '../layout/PageContainer';
import { ProductCategory, Product } from '../../types';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { Button } from '../ui/Button';
import { Search, Plus, Sparkles, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products, currentRole, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ProductCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.producerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <PageContainer
      kicker="Catalog Architecture"
      title="Products & Household Crafts"
      description="Authentic collections produced by home-based women artisans across Punjab and Sindh."
      primaryAction={
        currentRole === 'builder' ? (
          <Button
            onClick={() => showToast('New product creation form is ready for enterprise publishing.', 'info', 'Product Architecture')}
            variant="executiveGreen"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Create Product</span>
          </Button>
        ) : undefined
      }
    >
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Catalog' },
            { id: 'HUNAR', label: 'Hunar (Crafts)' },
            { id: 'RASOI', label: 'Rasoi (Foods)' },
            { id: 'KNOWLEDGE', label: 'Knowledge (Pedagogy)' },
            { id: 'SERVICES', label: 'Services' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === tab.id
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by craft or city..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#01411C] font-sans"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-stone-200 hover:border-[#BBF7D0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
              <ImageWithFallback
                src={product.imageUrl}
                alt={product.title}
                iconType={product.imageIcon}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#01411C]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                {product.category}
              </span>
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#F0FDF4] text-[#01411C] text-[10px] font-bold border border-[#BBF7D0]">
                {product.artisanSplitPercent}% Direct Artisan Split
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[11px] text-[#718579] font-medium">
                  {product.city} · {product.subCategory}
                </p>
                <h3 className="text-sm font-bold text-[#1A2E22] mt-1 line-clamp-2 font-sans group-hover:text-[#01411C]">
                  {product.title}
                </h3>
                <p className="text-xs text-[#4A5D52] mt-1.5 line-clamp-2 font-sans">
                  {product.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#718579] uppercase font-bold block">
                    Price
                  </span>
                  <span className="text-sm font-extrabold text-[#01411C] tabular-nums">
                    PKR {product.pricePKR.toLocaleString()}
                  </span>
                </div>
                <Link
                  to={`/products/${product.id}`}
                  className="px-3 py-1.5 rounded-xl bg-[#F0FDF4] text-[#01411C] hover:bg-[#01411C] hover:text-white transition-colors text-xs font-bold flex items-center gap-1"
                >
                  <span>View Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
