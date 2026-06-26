import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts } from '../features/products/productsSlice';
import { fetchOrders } from '../features/orders/ordersSlice';
import ProductsList from '../features/products/ProductsList';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { products, status: productsStatus } = useAppSelector((state) => state.products);
  const { orders, status: ordersStatus } = useAppSelector((state) => state.orders);

  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedSpec, setSelectedSpec] = useState<string>('');

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
    if (ordersStatus === 'idle') {
      dispatch(fetchOrders());
    }
  }, [dispatch, productsStatus, ordersStatus]);

  const uniqueTypes = useMemo(
    () => Array.from(new Set(products.map((p) => p.type))).filter(Boolean),
    [products]
  );

  const uniqueSpecs = useMemo(
    () => Array.from(new Set(products.map((p) => p.specification))).filter(Boolean),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchType = selectedType ? p.type === selectedType : true;
      const matchSpec = selectedSpec ? p.specification === selectedSpec : true;
      return matchType && matchSpec;
    });
  }, [products, selectedType, selectedSpec]);

  return (
    <div className="container-fluid px-4 mt-4 pb-5">
      <div className="products-page-header d-flex align-items-center mb-4 gap-4 flex-wrap">
        <h2 className="products-page-title m-0">
          {t('products.title')} / {filteredProducts.length}
        </h2>

        <div className="products-filters d-flex gap-3 align-items-center flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <label className="text-muted products-filter-label">{t('products.type')}</label>
            <select
              className="form-select form-select-sm filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">{t('products.allTypes')}</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="d-flex align-items-center gap-2">
            <label className="text-muted products-filter-label">{t('products.specification')}</label>
            <select
              className="form-select form-select-sm filter-select"
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
            >
              <option value="">{t('products.allSpecs')}</option>
              {uniqueSpecs.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="products-page-content">
        <ProductsList products={filteredProducts} orders={orders} />
      </div>
    </div>
  );
};

export default ProductsPage;
