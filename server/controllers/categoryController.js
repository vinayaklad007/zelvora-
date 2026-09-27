const firestoreService = require('../services/firestoreService');

const slugify = (text) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

const categoryController = {
  // GET /api/categories
  getCategories: async (req, res, next) => {
    try {
      const categories = await firestoreService.getCollection('categories');
      categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

      return res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/categories (Admin)
  createCategory: async (req, res, next) => {
    try {
      const { name, image, description, subcategories, isFeatured, sortOrder } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
      }

      const slug = slugify(name);
      const id = `cat_${slug}`;

      const newCategory = {
        id,
        name,
        slug,
        image: image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
        description: description || '',
        subcategories: subcategories || [],
        isFeatured: Boolean(isFeatured),
        sortOrder: Number(sortOrder) || 0,
        createdAt: new Date().toISOString()
      };

      const created = await firestoreService.setDoc('categories', id, newCategory);

      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: created
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/categories/:id (Admin)
  updateCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (updates.name) {
        updates.slug = slugify(updates.name);
      }

      const updated = await firestoreService.updateDoc('categories', id, updates);

      return res.json({
        success: true,
        message: 'Category updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/categories/:id (Admin)
  deleteCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      await firestoreService.deleteDoc('categories', id);

      return res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;
