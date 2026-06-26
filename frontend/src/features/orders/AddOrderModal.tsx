import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { useAppDispatch } from '../../hooks/redux';
import { fetchAddOrder } from './ordersSlice';
import '../products/AddProductModal.css';

interface AddOrderModalProps {
  onClose: () => void;
}

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="apm-modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <button className="apm-close" onClick={onClose} aria-label="close">
          <MdClose size={22} color="#334155" />
        </button>

        <h3 className="apm-title">{t('form.addOrderTitle')}</h3>

        <form className="apm-form" style={{ gridTemplateColumns: '1fr' }} onSubmit={handleSubmit} noValidate>
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

          <div className="apm-actions apm-field--full">
            <button type="button" className="apm-btn apm-btn--cancel" onClick={onClose}>
              {t('form.cancel')}
            </button>
            <button type="submit" className="apm-btn apm-btn--submit" disabled={submitting}>
              {t('form.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;
