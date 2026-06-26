import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './OrderDetails.css';
import type { IOrder, IProduct } from '../../types';
import { MdClose } from 'react-icons/md';
import { FiPlus, FiMonitor } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';

interface OrderDetailsProps {
  order: IOrder;
  products: IProduct[];
  onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, products, onClose }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`order-details-wrapper w-65 ${mounted ? 'visible' : ''}`}>
      <button className="order-details-close-btn" onClick={onClose}>
        <MdClose size={20} color="#334155" />
      </button>

      <div className="order-details-content">
        <h3 className="order-details-title">{order.title}</h3>
        
        <div className="order-details-add-product">
          <button className="add-product-btn">
            <span className="add-product-icon-wrapper">
              <FiPlus size={18} color="#fff" />
            </span>
            <span className="add-product-text">{t('orders.addProduct')}</span>
          </button>
        </div>

        <div className="order-products-list">
          {products.map((product) => {
            const isFree = product.isNew === 1;
            return (
              <div key={product.id} className="details-product-card">
                <div className={`status-circle ${isFree ? 'status-free' : 'status-repair'}`}></div>
                
                <div className="product-icon-wrapper">
                  <FiMonitor size={24} color="#94a3b8" />
                </div>
                
                <div className="product-info-text">
                  <div className="product-title">{product.title}</div>
                  <div className="product-serial">SN-{product.serialNumber}</div>
                </div>
                
                <div className={`product-status-text ${isFree ? 'text-free' : 'text-repair'}`}>
                  {isFree ? t('status.free') : t('status.repair')}
                </div>
                
                <button className="delete-product-btn">
                  <RiDeleteBin6Line size={20} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
