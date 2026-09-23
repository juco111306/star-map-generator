'use client';

import React, { useState } from 'react';
import { Sparkles, Star, ArrowRight, Compass, Box, Shirt, Map, BookOpen, Clock, Check, Heart } from 'lucide-react';
import { PRODUCTS } from '../constants/products';
import { ProductItem } from '../types';

interface ProductCatalogProps {
  onCustomizeStarMap: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onCustomizeStarMap }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalProduct, setModalProduct] = useState<ProductItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Keepsakes' },
    { id: 'celestial', label: 'Celestial Star Maps' },
    { id: 'wood', label: 'Hand-Carved Wood' },
    { id: 'socks', label: 'Embroidered Socks' },
    { id: 'cartography', label: 'Coordinates Art' },
    { id: 'leather', label: 'Heirloom Leather' },
  ];

  const filteredProducts = PRODUCTS.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'celestial':
        return <Compass className="w-4 h-4 text-[#A37055]" />;
      case 'wood':
        return <Box className="w-4 h-4 text-[#A37055]" />;
      case 'socks':
        return <Shirt className="w-4 h-4 text-[#A37055]" />;
      case 'cartography':
        return <Map className="w-4 h-4 text-[#A37055]" />;
      case 'leather':
        return <BookOpen className="w-4 h-4 text-[#A37055]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#A37055]" />;
    }
  };

  return (
    <section id="our-products" className="py-16 lg:py-24 bg-[#F7F4EE] border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EFE9DF] border border-[#E0D7C9] text-[#78716C] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#A37055]" />
            <span>THE PERMANENT COLLECTION</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1C1917]">
            Thoughtful Keepsakes for Life’s Defining Moments
          </h2>
          <p className="text-[#57534E] text-sm font-light leading-relaxed">
            Every piece is made to order with your custom names, dates, coordinates, and words. Crafted with natural hardwoods, pure cottons, and museum-grade papers.
          </p>
        </div>

        {/* Filter Categories Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#1C1917] text-[#FAF8F5] shadow-sm'
                  : 'bg-white text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] border border-[#E2DDD5]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isStarMap = product.id === 'celestial-blueprint';

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl bg-white border border-[#E8E3DA] hover:border-[#D4CBBF] p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Visual Thumbnail Area */}
                <div
                  onClick={() => (isStarMap ? onCustomizeStarMap() : setModalProduct(product))}
                  className="relative rounded-xl overflow-hidden aspect-[4/5] bg-[#F4F0E8] cursor-pointer border border-[#EAE5DC]"
                >
                  {isStarMap ? (
                    <img
                      src="/textures/star_map_sample.png"
                      alt={product.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    /* Minimalist Artisan Mockup for Sister Goods */
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#FAF8F5] to-[#F2EDE4]">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-[#E4DED2] flex items-center justify-center mb-3.5 shadow-sm group-hover:scale-105 transition-transform">
                        {getCategoryIcon(product.category)}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-[#A37055] font-semibold mb-1">
                        {product.tagline}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#1C1917] mb-2 leading-snug">
                        {product.title}
                      </h4>
                      <p className="text-xs text-[#78716C] font-light line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                      {product.material && (
                        <span className="mt-3 inline-block px-2.5 py-0.5 rounded-full bg-[#EBE5DA] text-[10px] text-[#57534E] font-medium">
                          {product.material.split('&')[0]}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Top Understated Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-[#E5DFD4] px-2.5 py-0.5 rounded-full text-[9.5px] font-semibold text-[#1C1917] tracking-wider shadow-sm">
                      {product.badge}
                    </div>
                  )}

                  {/* Hover Prompt */}
                  <div className="absolute inset-0 bg-[#1C1917]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <span className="px-4 py-2 rounded-full bg-white text-[#1C1917] font-semibold text-xs shadow-xl flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <span>{isStarMap ? 'Personalize in Studio' : 'Explore Keepsake Details'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Information & Action */}
                <div className="pt-4 px-1 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#A37055] font-medium flex items-center gap-1 text-[11px]">
                        {getCategoryIcon(product.category)}
                        <span>{product.tagline}</span>
                      </span>
                      <div className="flex items-center text-[#A37055] text-xs">
                        <Star className="w-3.5 h-3.5 fill-[#A37055] mr-1" />
                        <span className="font-medium text-[#1C1917]">{product.rating}</span>
                        <span className="text-[#A8A29E] ml-1">({product.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#1C1917] group-hover:text-[#A37055] transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-xs text-[#57534E] font-light mt-1.5 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Button */}
                  <div className="pt-4 mt-3 border-t border-[#F0EBE1] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#A8A29E] line-through mr-1.5">
                        {product.originalPrice}
                      </span>
                      <span className="text-base font-semibold text-[#1C1917]">
                        {product.price}
                      </span>
                    </div>

                    {isStarMap ? (
                      <button
                        onClick={onCustomizeStarMap}
                        className="px-4 py-2 rounded-full bg-[#1C1917] hover:bg-[#332F2B] text-[#FAF8F5] font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Personalize &rarr;</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setModalProduct(product)}
                        className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F2EDE4] text-[#44403C] text-xs font-medium transition-all border border-[#E2DDD5]"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Details Modal for Sister Keepsakes */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-[#1C1917]">
            <div className="flex items-center justify-between border-b border-[#EAE5DC] pb-3">
              <span className="text-xs font-semibold text-[#A37055] uppercase tracking-wider flex items-center gap-1.5">
                {getCategoryIcon(modalProduct.category)}
                <span>{modalProduct.tagline}</span>
              </span>
              <button
                onClick={() => setModalProduct(null)}
                className="text-[#78716C] hover:text-[#1C1917] text-sm p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-normal text-[#1C1917]">
                {modalProduct.title}
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed mt-2 font-light">
                {modalProduct.description}
              </p>
            </div>

            {modalProduct.details && (
              <div className="p-4 rounded-2xl bg-white border border-[#EAE5DC] space-y-2">
                <span className="text-xs font-semibold text-[#1C1917] block">
                  Artisan Specifications:
                </span>
                <ul className="space-y-1.5 text-xs text-[#57534E]">
                  {modalProduct.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A37055] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#F3EEE5] border border-[#E5DFD4] text-xs space-y-1">
              <span className="font-semibold text-[#1C1917] block">
                Atelier Production Schedule:
              </span>
              <p className="text-[11px] text-[#78716C]">
                This artisan keepsake is handcrafted in limited batches. Customize our flagship Star Map fine art piece today:
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => setModalProduct(null)}
                className="flex-1 py-2.5 rounded-full bg-white border border-[#D6D0C7] text-xs font-medium text-[#44403C] hover:bg-[#F2EDE4]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setModalProduct(null);
                  onCustomizeStarMap();
                }}
                className="flex-1 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#332F2B] text-[#FAF8F5] font-semibold text-xs shadow-sm"
              >
                Personalize Star Map &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
