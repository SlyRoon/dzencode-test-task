import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { FiInbox } from 'react-icons/fi';
import { useAppDispatch } from '../../hooks/redux';
import { fetchAddOrder } from './ordersSlice';
import '../products/AddProductModal.css';

interface AddOrderModalProps {
  onClose: () => void;
}

const overlayMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

const dialogMotion = {
  initial: { opacity: 0, y: 24, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 24, scale: 0.96 },
  transition: { type: 'spring' as const, damping: 24, stiffness: 280 },
};

const AddOrderModal: React.FC<AddOrderModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('form.errRequired'));
      return;
    }
    try {
      setSubmitting(true);
      await dispatch(fetchAddOrder({ title: title.trim() })).unwrap();
      onClose();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <motion.div className="modal-overlay" onClick={onClose} {...overlayMotion}>
      <motion.div
        className="apm-modal"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
        {...dialogMotion}
      >
        <div className="apm-header">
          <div className="apm-header-title">
            <span className="apm-header-icon">
              <FiInbox size={20} color="#fff" />
            </span>
            <h3 className="apm-title">{t('form.addOrderTitle')}</h3>
          </div>
          <button className="apm-close" onClick={onClose} aria-label="close" type="button">
            <MdClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="apm-body" style={{ gridTemplateColumns: '1fr' }}>
            <div className="apm-field apm-field--full">
              <label>{t('form.orderTitle')}</label>
              <input
                type="text"
                value={title}
                autoFocus
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError('');
                }}
                className={error ? 'apm-input apm-input--error' : 'apm-input'}
              />
              {error && <span className="apm-error">{error}</span>}
            </div>
          </div>

          <div className="apm-footer">
            <button type="button" className="apm-btn apm-btn--cancel" onClick={onClose}>
              {t('form.cancel')}
            </button>
            <button type="submit" className="apm-btn apm-btn--submit" disabled={submitting}>
              {t('form.submit')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddOrderModal;
