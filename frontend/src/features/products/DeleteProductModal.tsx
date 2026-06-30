import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiMonitor } from 'react-icons/fi';
import type { IOrder, IProduct } from '../../types';
import '../orders/DeleteOrderModal.css';

interface DeleteProductModalProps {
  product: IProduct;
  order?: IOrder;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  product,
  order,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const isFree = product.isNew === 1;

  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <MdClose size={24} color="#334155" />
        </button>

        <div className="modal-header">
          <h3 className="modal-title">{t('deleteProductModal.title')}</h3>
        </div>

        <div className="modal-body">
          <div className="modal-products-list">
            <div className="modal-product-item">
              <div className={`modal-status-indicator ${isFree ? '' : 'modal-status-indicator-dark'}`}></div>
              <div className="modal-product-icon">
                <FiMonitor size={20} color="#94a3b8" />
              </div>
              <div className="modal-product-info">
                <div className="modal-product-title">{product.title}</div>
                <div className="modal-product-serial">SN-{product.serialNumber}</div>
                <div className="modal-product-order">
                  {order?.title || t('orders.unknown')}
                </div>
              </div>
            </div>
          </div>
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
      </motion.div>
    </motion.div>
  );
};

export default DeleteProductModal;
