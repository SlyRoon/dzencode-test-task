import React from 'react';
import { useTranslation } from 'react-i18next';
import './OrdersList.css';
import { formatShortDate, formatLongDate } from '../../utils/formatDate';
import type { IOrder } from '../../types';
import { FiList } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';
import { RiDeleteBin6Line } from 'react-icons/ri';

export interface OrderWithStats extends IOrder {
  productCount: number;
  totalUSD: number;
  totalUAH: number;
}

interface OrdersListProps {
  orders: OrderWithStats[];
  selectedOrderId: number | null;
  onSelectOrder: (id: number | null) => void;
  onDeleteClick: (id: number) => void;
}

const OrdersList: React.FC<OrdersListProps> = ({ orders, selectedOrderId, onSelectOrder, onDeleteClick }) => {
  const { t } = useTranslation();
  return (
    <div className={`orders-list-wrapper ${selectedOrderId ? 'w-35' : 'w-100'}`}>
      {orders.map((order) => {
        const isSelected = order.id === selectedOrderId;
        return (
          <div 
            key={order.id} 
            className={`order-card ${isSelected ? 'active' : ''}`}
            onClick={() => onSelectOrder(isSelected ? null : order.id)}
          >
            {!selectedOrderId && <div className="order-title">{order.title}</div>}
            
            <div className="order-products-info">
              <div className="order-icon-wrapper">
                <FiList size={22} />
              </div>
              <div className="order-products-count">
                <span className="count-number">{order.productCount}</span>
                <span className="count-label">{t('orders.productCount')}</span>
              </div>
            </div>

            <div className="order-date-wrapper">
              <div className="order-date-short">{formatShortDate(order.date)}</div>
              <div className="order-date-long">{formatLongDate(order.date)}</div>
            </div>

            {!selectedOrderId && (
              <div className="order-price-wrapper">
                <div className="price-usd">
                  {order.totalUSD > 0 && <>{order.totalUSD} <span className="currency-symbol">$</span></>}
                </div>
                <div className="price-uah">
                  {order.totalUAH > 0 && <>{order.totalUAH} <span className="currency-symbol">UAH</span></>}
                </div>
              </div>
            )}
            
            {!selectedOrderId && (
               <button className="delete-order-btn" onClick={(e) => {
                 e.stopPropagation();
                 onDeleteClick(order.id);
               }}>
                 <RiDeleteBin6Line size={22} />
               </button>
            )}

            {isSelected && (
               <div className="order-arrow-block">
                 <IoIosArrowForward size={24} color="#fff" />
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrdersList;
