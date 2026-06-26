import React from 'react';
import { useTranslation } from 'react-i18next';
import './ProductList.css';
import type { IProduct, IOrder } from '../../types';
import { FiMonitor } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { formatShortDate, formatLongDate, formatNumericDate } from '../../utils/formatDate';

interface ProductsListProps {
  products: IProduct[];
  orders: IOrder[];
}

const ProductsList: React.FC<ProductsListProps> = ({ products, orders }) => {
  const { t } = useTranslation();

  return (
    <div className="products-list-wrapper">
      {products.map((product) => {
        const isFree = product.isNew === 1;
        const order = orders.find((o) => o.id === product.order);

        const priceUSD = product.price.find((p) => p.symbol === 'USD')?.value ?? 0;
        const priceUAH = product.price.find((p) => p.symbol === 'UAH')?.value ?? 0;

        return (
          <div key={product.id} className="product-row-card">
            <div className={`product-status-dot ${isFree ? 'dot-free' : 'dot-repair'}`}></div>

            <div className="product-icon-box">
              <FiMonitor size={24} color="#94a3b8" />
            </div>

            <div className="product-col product-col-name">
              <div className="product-name-text" title={product.title}>{product.title}</div>
              <div className="product-serial-text">SN-{product.serialNumber}</div>
            </div>

            <div className={`product-col product-col-status ${isFree ? 'text-free' : 'text-repair'}`}>
              {isFree ? t('status.free') : t('status.repair')}
            </div>

            <div className="product-col product-col-guarantee">
              <div className="guarantee-text">
                <span className="text-muted">{t('guarantee.from')}</span> {formatNumericDate(product.guarantee.start)}
              </div>
              <div className="guarantee-text">
                <span className="text-muted">{t('guarantee.to')}</span> {formatNumericDate(product.guarantee.end)}
              </div>
            </div>

            <div className="product-col product-col-state">
              {isFree ? t('status.new') : t('status.used')}
            </div>

            <div className="product-col product-col-price">
              <div className="price-usd-text">{priceUSD} <span className="price-currency">$</span></div>
              <div className="price-uah-text">{priceUAH} <span className="price-currency">UAH</span></div>
            </div>

            <div
              className="product-col product-col-group"
              title={product.specification || t('orders.groupNameFallback')}
            >
              {product.specification || t('orders.groupNameFallback')}
            </div>

            <div className="product-col product-col-user">—</div>

            <div className="product-col product-col-order" title={order?.title}>
              {order?.title || t('orders.unknown')}
            </div>

            <div className="product-col product-col-date">
              <div className="date-short-text">{formatShortDate(product.date)}</div>
              <div className="date-long-text">{formatLongDate(product.date)}</div>
            </div>

            <div className="product-col-action">
              <button className="product-delete-btn" aria-label="delete">
                <RiDeleteBin6Line size={20} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsList;
