const firestoreService = require('../services/firestoreService');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');      // Replace multiple - with single -
};

const productController = {
  // GET /api/products
  getProducts: async (req, res, next) => {
    try {
      let products = await firestoreService.getCollection('products');
      
      const {
        search,
        category,
        subcategory,
        minPrice,
        maxPrice,
        minRating,
        inStockOnly,
        sort,
        page = 1,
        limit = 12,
        featured,
        bestseller,
        newArrival
      } = req.query;

      // Filter active products for non-admin unless specified
      const isAdminView = req.query.adminView === 'true';
      if (!isAdminView) {
        products = products.filter(p => p.isActive !== false);
      }

      // Search query (title, description, tags, SKU, category)
      if (search) {
        const query = search.toLowerCase().trim();
        products = products.filter(p => 
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query) ||
          p.categorySlug?.toLowerCase().includes(query) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
        );
      }

      // Category filter
      if (category && category !== 'all') {
        const catQuery = category.toLowerCase();
        products = products.filter(p => 
          p.categorySlug?.toLowerCase() === catQuery || 
          p.categoryId === category ||
          p.categoryName?.toLowerCase() === catQuery
        );
      }

      // Subcategory filter
      if (subcategory && subcategory !== 'all') {
        products = products.filter(p => p.subcategory?.toLowerCase() === subcategory.toLowerCase());
      }

      // Price Range filter
      if (minPrice) {
        products = products.filter(p => Number(p.price) >= Number(minPrice));
      }
      if (maxPrice) {
        products = products.filter(p => Number(p.price) <= Number(maxPrice));
      }

      // Rating filter
      if (minRating) {
        products = products.filter(p => (p.ratingAvg || 0) >= Number(minRating));
      }

      // In Stock filter
      if (inStockOnly === 'true') {
        products = products.filter(p => Number(p.stock) > 0);
      }

      // Flags filter
      if (featured === 'true') {
        products = products.filter(p => p.isFeatured === true);
      }
      if (bestseller === 'true') {
        products = products.filter(p => p.isBestseller === true);
      }
      if (newArrival === 'true') {
        products = products.filter(p => p.isNewArrival === true);
      }

      // Sorting
      if (sort === 'price-asc') {
        products.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sort === 'price-desc') {
        products.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (sort === 'rating') {
        products.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
      } else if (sort === 'popularity') {
        products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      } else {
        // Default: newest
        products.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }

      // Pagination
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const totalCount = products.length;
      const totalPages = Math.ceil(totalCount / limitNum) || 1;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

      return res.json({
        success: true,
        data: paginatedProducts,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/products/:identifier (slug or ID)
  getProductByIdentifier: async (req, res, next) => {
    try {
      const { identifier } = req.params;
      const products = await firestoreService.getCollection('products');

      let product = products.find(p => p.slug === identifier || p.id === identifier);
      
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Fetch related products in the same category
      const relatedProducts = products
        .filter(p => p.id !== product.id && p.categorySlug === product.categorySlug && p.isActive !== false)
        .slice(0, 4);

      return res.json({
        success: true,
        data: product,
        relatedProducts
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/products (Admin)
  createProduct: async (req, res, next) => {
    try {
      const {
        title,
        description,
        price,
        mrp,
        stock,
        sku,
        categoryId,
        categoryName,
        categorySlug,
        subcategory,
        images,
        specs,
        variants,
        tags,
        isFeatured = false,
        isBestseller = false,
        isNewArrival = true,
        isActive = true
      } = req.body;

      if (!title || price === undefined || stock === undefined) {
        return res.status(400).json({ success: false, message: 'Title, price, and stock quantity are required.' });
      }

      const generatedId = `prod_${Date.now()}`;
      const generatedSlug = slugify(title);
      const calculatedMrp = Number(mrp) || Number(price);
      const calculatedPrice = Number(price);
      const discountPercent = calculatedMrp > calculatedPrice 
        ? Math.round(((calculatedMrp - calculatedPrice) / calculatedMrp) * 100) 
        : 0;

      const newProduct = {
        id: generatedId,
        title,
        slug: generatedSlug,
        description: description || '',
        price: calculatedPrice,
        mrp: calculatedMrp,
        discountPercent,
        stock: Number(stock),
        sku: sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
        categoryId: categoryId || 'general',
        categoryName: categoryName || 'General',
        categorySlug: categorySlug || slugify(categoryName || 'general'),
        subcategory: subcategory || '',
        images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'],
        specs: specs || [],
        variants: variants || [],
        tags: tags || [],
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
        isNewArrival: Boolean(isNewArrival),
        isActive: Boolean(isActive),
        ratingAvg: 4.8,
        reviewCount: 1,
        createdAt: new Date().toISOString()
      };

      const created = await firestoreService.setDoc('products', generatedId, newProduct);

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: created
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/products/:id (Admin)
  updateProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const existing = await firestoreService.getDoc('products', id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (updates.title && !updates.slug) {
        updates.slug = slugify(updates.title);
      }

      if (updates.price !== undefined || updates.mrp !== undefined) {
        const finalPrice = updates.price !== undefined ? Number(updates.price) : Number(existing.price);
        const finalMrp = updates.mrp !== undefined ? Number(updates.mrp) : Number(existing.mrp);
        updates.discountPercent = finalMrp > finalPrice 
          ? Math.round(((finalMrp - finalPrice) / finalMrp) * 100) 
          : 0;
      }

      const updated = await firestoreService.updateDoc('products', id, updates);

      return res.json({
        success: true,
        message: 'Product updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/products/:id (Admin)
  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const existing = await firestoreService.getDoc('products', id);

      if (existing) {
        await firestoreService.deleteDoc('products', id);
        return res.json({
          success: true,
          message: 'Product deleted successfully'
        });
      }

      // Fallback: search collection by id or slug
      const allProducts = await firestoreService.getCollection('products');
      const found = allProducts.find(p => p.id === id || p.slug === id);
      if (found) {
        await firestoreService.deleteDoc('products', found.id);
        return res.json({
          success: true,
          message: 'Product deleted successfully'
        });
      }

      return res.status(404).json({ success: false, message: 'Product not found or already deleted' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
