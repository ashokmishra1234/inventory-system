class SQLGeneratorService {
    constructor() {
      this.tableName = 'products';
      this.allowedColumns = ['name', 'description', 'price', 'quantity', 'location', 'sku'];
    }
  
    generateSql(intentData) {
      if (!intentData || !intentData.entities) {
        throw new Error('Invalid intent data');
      }
  
      const { product_keywords, filters } = intentData.entities;
      const conditions = [];
  
      // 1. Search Keywords (Name or Description)
      if (product_keywords && product_keywords.length > 0) {
        const keywordConditions = product_keywords.map(kw => {
            const safeKw = this._sanitize(kw);
            return `(name ILIKE '%${safeKw}%' OR description ILIKE '%${safeKw}%')`;
        });
        conditions.push(`(${keywordConditions.join(' OR ')})`);
      }
  
      // 2. Specific Filters
      if (filters) {
        // Brand/Color/Size - usually in Description or Name in simple schema
        const textFilters = [];
        if (filters.brand) textFilters.push(filters.brand);
        if (filters.color) textFilters.push(filters.color);
        
        textFilters.forEach(term => {
             const safeTerm = this._sanitize(term);
             conditions.push(`(description ILIKE '%${safeTerm}%' OR name ILIKE '%${safeTerm}%')`);
        });
  
        // Price Range
        if (filters.price_range) {
          if (filters.price_range.min) conditions.push(`price >= ${Number(filters.price_range.min)}`);
          if (filters.price_range.max) conditions.push(`price <= ${Number(filters.price_range.max)}`);
        }
  
        // In Stock
        if (filters.in_stock_only) {
          conditions.push('quantity > 0');
        }
      }
  
      // Build Query
      let query = `SELECT * FROM ${this.tableName}`;
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      
      // Default Limit
      query += ` LIMIT 10`;
  
      return query;
    }
  
    _sanitize(input) {
      if (!input) return '';
      // Remove dangerous characters for basic SQL safety (though primarily mapped to RLS-protected calls)
      return input.replace(/['";\\]/g, ''); 
    }
  }
  
  module.exports = new SQLGeneratorService();
