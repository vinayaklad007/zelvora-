const firestoreService = require('../services/firestoreService');

const categoriesData = [
  { id: 'cat_earrings', name: 'Earrings', slug: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', description: 'Statement Jhumkas, Chandbalis, Studs & Hoop Earrings', isFeatured: true, sortOrder: 1 },
  { id: 'cat_necklaces', name: 'Necklaces', slug: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800', description: 'Kundan Chokers, Pearl Layered Chains & Pendants', isFeatured: true, sortOrder: 2 },
  { id: 'cat_rings', name: 'Rings', slug: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800', description: 'Adjustable Solitaires, Cocktail Rings & Stackable Bands', isFeatured: true, sortOrder: 3 },
  { id: 'cat_bracelets', name: 'Bracelets', slug: 'bracelets', image: 'https://images.unsplash.com/photo-1611591475143-4f8a9a4b27bf?auto=format&fit=crop&q=80&w=800', description: 'Charm Bracelets, Cuffs & Tennis Chains', isFeatured: true, sortOrder: 4 },
  { id: 'cat_bangles', name: 'Bangles', slug: 'bangles', image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=800', description: 'Traditional Kada Sets & Modern Metal Bangles', isFeatured: true, sortOrder: 5 },
  { id: 'cat_handbags', name: 'Handbags', slug: 'handbags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', description: 'Designer Tote Bags, Potli Bags & Crossbody Bags', isFeatured: true, sortOrder: 6 },
  { id: 'cat_wallets', name: 'Wallets', slug: 'wallets', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800', description: 'Slim Zip-Around Clutch & Leatherette Wallets', isFeatured: false, sortOrder: 7 },
  { id: 'cat_hair_accessories', name: 'Hair Accessories', slug: 'hair-accessories', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800', description: 'Embellished Hairbands, Pearl Clips & Satin Scrunchies', isFeatured: false, sortOrder: 8 },
  { id: 'cat_sunglasses', name: 'Sunglasses', slug: 'sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800', description: 'UV400 Oversized frames, Cat-eye & Retro Aviators', isFeatured: false, sortOrder: 9 },
  { id: 'cat_watches', name: 'Watches', slug: 'watches', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800', description: 'Rose Gold Analog Watches & Bracelet Strap Timepieces', isFeatured: true, sortOrder: 10 },
  { id: 'cat_beauty_accessories', name: 'Beauty & Fashion Accessories', slug: 'beauty-fashion-accessories', image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&q=80&w=800', description: 'Vanity Organizers, Silk Scarves & Brooches', isFeatured: false, sortOrder: 11 },
  { id: 'cat_gift_collections', name: 'Gift Collections', slug: 'gift-collections', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', description: 'Curated Festive Gift Boxes, Festive Hampers & Bridal Sets', isFeatured: true, sortOrder: 12 }
];

const productsData = [
  {
    id: 'prod_001',
    title: 'Royal Kundan & Pearl Jhumka Earrings',
    slug: 'royal-kundan-pearl-jhumka-earrings',
    description: 'Exquisite 22K gold-plated Kundan Jhumka crafted with hand-strung faux freshwater pearls and intricate meenakari detailing on the back. Perfect for weddings and festive celebrations.',
    price: 1899,
    mrp: 3499,
    discountPercent: 46,
    stock: 25,
    sku: 'ZAR-EAR-001',
    categoryId: 'cat_earrings',
    categoryName: 'Earrings',
    categorySlug: 'earrings',
    subcategory: 'Jhumkas',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { name: 'Material', value: 'Brass Base with 22K Gold Plating' },
      { name: 'Stone Type', value: 'Kundan & Faux Pearls' },
      { name: 'Closure', value: 'Push Back Post' },
      { name: 'Weight', value: '38 grams pair' }
    ],
    variants: [
      { type: 'Color', value: 'Ruby Red & Gold' },
      { type: 'Color', value: 'Emerald Green & Gold' }
    ],
    tags: ['earrings', 'jhumka', 'kundan', 'wedding', 'festive'],
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    isActive: true,
    ratingAvg: 4.9,
    reviewCount: 28
  },
  {
    id: 'prod_002',
    title: 'Minimalist Diamond-Cut Rose Gold Watch',
    slug: 'minimalist-diamond-cut-rose-gold-watch',
    description: 'Chic stainless steel mesh strap watch featuring a faceted diamond-cut glass crystal dial. Japanese quartz movement with 30m water resistance.',
    price: 2499,
    mrp: 4999,
    discountPercent: 50,
    stock: 18,
    sku: 'ZAR-WTC-002',
    categoryId: 'cat_watches',
    categoryName: 'Watches',
    categorySlug: 'watches',
    subcategory: 'Analog Watches',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { name: 'Dial Diameter', value: '32 mm' },
      { name: 'Movement', value: 'Japanese Quartz' },
      { name: 'Strap Material', value: 'Rose Gold Stainless Steel Mesh' },
      { name: 'Water Resistance', value: '3 ATM / 30 Meters' }
    ],
    variants: [{ type: 'Strap', value: 'Mesh Rose Gold' }],
    tags: ['watch', 'rose gold', 'minimalist', 'accessories'],
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    ratingAvg: 4.8,
    reviewCount: 42
  },
  {
    id: 'prod_003',
    title: 'Celestial Zirconia Layered Choker Necklace Set',
    slug: 'celestial-zirconia-layered-choker-necklace-set',
    description: 'Handcrafted cubic zirconia tennis choker paired with a delicate pendant drop necklace. Premium rhodium polish for anti-tarnish everyday shine.',
    price: 1499,
    mrp: 2999,
    discountPercent: 50,
    stock: 30,
    sku: 'ZAR-NEC-003',
    categoryId: 'cat_necklaces',
    categoryName: 'Necklaces',
    categorySlug: 'necklaces',
    subcategory: 'Chokers',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1611591475143-4f8a9a4b27bf?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { name: 'Metal', value: 'Sterling Silver Base, Rhodium Plated' },
      { name: 'Stone', value: '5A Grade AAA Cubic Zirconia' },
      { name: 'Length', value: '14 inches + 3 inches extender' }
    ],
    variants: [],
    tags: ['necklace', 'choker', 'zirconia', 'silver'],
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    ratingAvg: 4.7,
    reviewCount: 19
  },
  {
    id: 'prod_004',
    title: 'Embroidered Velvet Festive Potli Handbag',
    slug: 'embroidered-velvet-festive-potli-handbag',
    description: 'Luxurious velvet potli with intricate zari hand-embellishment, pearl beaded drawstring handle, and detachable gold sling chain.',
    price: 1699,
    mrp: 2799,
    discountPercent: 39,
    stock: 14,
    sku: 'ZAR-BAG-004',
    categoryId: 'cat_handbags',
    categoryName: 'Handbags',
    categorySlug: 'handbags',
    subcategory: 'Potli Bags',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { name: 'Outer Fabric', value: 'Micro Velvet with Zari Work' },
      { name: 'Inner Lining', value: 'Satin' },
      { name: 'Dimensions', value: '20cm x 22cm x 8cm' }
    ],
    variants: [
      { type: 'Color', value: 'Maroon Velvet' },
      { type: 'Color', value: 'Emerald Green Velvet' }
    ],
    tags: ['handbag', 'potli', 'velvet', 'festive', 'ethnic'],
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    isActive: true,
    ratingAvg: 4.9,
    reviewCount: 35
  },
  {
    id: 'prod_005',
    title: 'Statement Solitaire Adjustable Cocktail Ring',
    slug: 'statement-solitaire-adjustable-cocktail-ring',
    description: 'Dazzling marquise-cut solitaire surrounded by a halo of micro-pave crystals. Adjustable band fits all finger sizes comfortably.',
    price: 799,
    mrp: 1499,
    discountPercent: 47,
    stock: 45,
    sku: 'ZAR-RNG-005',
    categoryId: 'cat_rings',
    categoryName: 'Rings',
    categorySlug: 'rings',
    subcategory: 'Cocktail Rings',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { name: 'Size', value: 'Free Size (Adjustable)' },
      { name: 'Plating', value: '18K Yellow Gold Dip' }
    ],
    variants: [],
    tags: ['ring', 'cocktail', 'solitaire', 'gold'],
    isFeatured: false,
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    ratingAvg: 4.6,
    reviewCount: 15
  },
  {
    id: 'prod_006',
    title: 'Vintage UV400 Gradient Cat-Eye Sunglasses',
    slug: 'vintage-uv400-gradient-cat-eye-sunglasses',
    description: 'Chic cat-eye eyewear with polycarbonate UV400 protective lenses and lightweight acetate frame. Includes protective hard case and microfiber cleaning cloth.',
    price: 999,
    mrp: 1999,
    discountPercent: 50,
    stock: 22,
    sku: 'ZAR-SUN-006',
    categoryId: 'cat_sunglasses',
    categoryName: 'Sunglasses',
    categorySlug: 'sunglasses',
    subcategory: 'Cat-Eye',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { name: 'Frame Material', value: 'Premium Acetate' },
      { name: 'Lens Protection', value: '100% UV400 Protection' }
    ],
    variants: [
      { type: 'Frame Color', value: 'Black Gold' },
      { type: 'Frame Color', value: 'Tortoise Shell' }
    ],
    tags: ['sunglasses', 'eyewear', 'cat-eye', 'uv400'],
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    ratingAvg: 4.8,
    reviewCount: 11
  },
  {
    id: 'prod_007',
    title: 'Luxury Pearl & Crystal Embellished Hairband',
    slug: 'luxury-pearl-crystal-embellished-hairband',
    description: 'Hand-sewn padded headband covered in lustrous faux pearls and sparkling crystal beads. Soft velvet backing prevents hair snagging.',
    price: 649,
    mrp: 1199,
    discountPercent: 46,
    stock: 50,
    sku: 'ZAR-HAR-007',
    categoryId: 'cat_hair_accessories',
    categoryName: 'Hair Accessories',
    categorySlug: 'hair-accessories',
    subcategory: 'Hairbands',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { name: 'Base Material', value: 'Soft Velvet & Flexible Alloy' }
    ],
    variants: [],
    tags: ['hairband', 'pearl', 'hair accessories', 'partywear'],
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    isActive: true,
    ratingAvg: 4.7,
    reviewCount: 22
  },
  {
    id: 'prod_008',
    title: 'Grand Festive Luxury Jewellery Gift Box Hamper',
    slug: 'grand-festive-luxury-jewellery-gift-box-hamper',
    description: 'The ultimate gift set containing a Kundan choker necklace, matching earrings, adjustable ring, and a velvet jewelry trunk box with a personalized greeting card.',
    price: 3499,
    mrp: 6999,
    discountPercent: 50,
    stock: 10,
    sku: 'ZAR-GFT-008',
    categoryId: 'cat_gift_collections',
    categoryName: 'Gift Collections',
    categorySlug: 'gift-collections',
    subcategory: 'Gift Sets',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
    ],
    specs: [
      { name: 'Includes', value: '1 Choker, 1 Pair Earrings, 1 Ring, 1 Velvet Trunk Box' }
    ],
    variants: [],
    tags: ['gift hamper', 'festive box', 'gift set', 'jewelry trunk'],
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    ratingAvg: 5.0,
    reviewCount: 17
  }
];

const couponsData = [
  {
    id: 'cup_WELCOME10',
    code: 'WELCOME10',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 500,
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    usedCount: 42,
    active: true,
    isFirstOrderOnly: true
  },
  {
    id: 'cup_FESTIVE200',
    code: 'FESTIVE200',
    discountType: 'FIXED',
    discountValue: 200,
    minOrderValue: 1499,
    maxDiscount: 200,
    expiryDate: '2027-12-31',
    usageLimit: 500,
    usedCount: 15,
    active: true,
    isFirstOrderOnly: false
  }
];

const bannersData = [
  {
    id: 'ban_001',
    title: 'The Festive Royal Edit',
    subtitle: 'Handcrafted Kundan, Pearls & Velvet Potli Collection',
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1600',
    linkUrl: '/shop?category=earrings',
    buttonText: 'Explore Collection',
    sortOrder: 1,
    active: true
  },
  {
    id: 'ban_002',
    title: 'Luxury Watches & Timepieces',
    subtitle: 'Flat 50% Off Rose Gold & Diamond-Cut Crystal Watches',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1600',
    linkUrl: '/shop?category=watches',
    buttonText: 'Shop Watches',
    sortOrder: 2,
    active: true
  }
];

const seedDatabase = async () => {
  console.log('🌱 Starting Database Seeding Process...');

  // Seed Categories
  for (const cat of categoriesData) {
    await firestoreService.setDoc('categories', cat.id, cat);
  }
  console.log(`✅ Seeded ${categoriesData.length} product categories.`);

  // Seed Products
  for (const prod of productsData) {
    await firestoreService.setDoc('products', prod.id, prod);
  }
  console.log(`✅ Seeded ${productsData.length} sample products.`);

  // Seed Coupons
  for (const cup of couponsData) {
    await firestoreService.setDoc('coupons', cup.id, cup);
  }
  console.log(`✅ Seeded ${couponsData.length} promotional coupons.`);

  // Seed Banners
  for (const ban of bannersData) {
    await firestoreService.setDoc('banners', ban.id, ban);
  }
  console.log(`✅ Seeded ${bannersData.length} promotional banners.`);

  console.log('🎉 Database Seeding Completed Successfully!');
};

module.exports = {
  seedDatabase,
  categoriesData,
  productsData,
  couponsData,
  bannersData
};
