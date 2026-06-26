import React from 'react';
import { useTranslation } from 'react-i18next';
import './DeleteOrderModal.css';
import type {IProduct } from '../../types';
import { MdClose } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiMonitor } from 'react-icons/fi';

interface DeleteOrderModalProps {
  products: IProduct[];
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({ products, onClose, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <MdClose size={24} color="#334155" />
        </button>

        <div className="modal-header">
          <h3 className="modal-title">{t('deleteModal.title')}</h3>
        </div>

        <div className="modal-body">
          {products.length > 0 ? (
            <div className="modal-products-list">
              {products.map((product) => (
                <div key={product.id} className="modal-product-item">
                  <div className="modal-status-indicator"></div>
                  <div className="modal-product-icon">
                    <FiMonitor size={20} color="#94a3b8" />
                  </div>
                  <div className="modal-product-info">
                    <div className="modal-product-title">{product.title}</div>
                    <div className="modal-product-serial">SN-{product.serialNumber}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="modal-empty-text">{t('deleteModal.empty')}</p>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>
            {t('deleteModal.cancel')}
          </button>
          <button className="modal-delete-btn" onClick={onConfirm}>
            <RiDeleteBin6Line size={18} color="#ef4444" />
            {t('deleteModal.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOrderModal;
