import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { useAppDispatch } from '../../hooks/redux';
import { fetchAddProduct } from './productsSlice';
import type { NewProductPayload } from '../../services/api';
import './AddProductModal.css';

interface AddProductModalProps {
  orderId: number;
  onClose: () => void;
}

interface FormState {
  title: string;
  type: string;
  serialNumber: string;
  specification: string;
  isNew: string;
  guaranteeStart: string;
  guaranteeEnd: string;
  priceUSD: string;
  priceUAH: string;
  photo: string;
}

const initialForm: FormState = {
  title: '',
  type: '',
  serialNumber: '',
  specification: '',
  isNew: '1',
  guaranteeStart: '',
  guaranteeEnd: '',
  priceUSD: '',
  priceUAH: '',
  photo: '',
};

const AddProductModal: React.FC<AddProductModalProps> = ({ orderId, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = t('form.errRequired');
    if (!form.type.trim()) next.type = t('form.errRequired');

    if (!form.serialNumber.trim()) next.serialNumber = t('form.errRequired');
    else if (Number(form.serialNumber) <= 0) next.serialNumber = t('form.errPositive');

    if (!form.priceUSD.trim()) next.priceUSD = t('form.errRequired');
    else if (Number(form.priceUSD) <= 0) next.priceUSD = t('form.errPositive');

    if (!form.priceUAH.trim()) next.priceUAH = t('form.errRequired');
    else if (Number(form.priceUAH) <= 0) next.priceUAH = t('form.errPositive');

    if (!form.guaranteeStart) next.guaranteeStart = t('form.errRequired');
    if (!form.guaranteeEnd) next.guaranteeEnd = t('form.errRequired');
    if (form.guaranteeStart && form.guaranteeEnd && form.guaranteeEnd < form.guaranteeStart) {
      next.guaranteeEnd = t('form.errDateOrder');
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: NewProductPayload = {
      serialNumber: Number(form.serialNumber),
      isNew: Number(form.isNew),
      photo: form.photo.trim(),
      title: form.title.trim(),
      type: form.type.trim(),
      specification: form.specification.trim(),
      guarantee: {
        start: `${form.guaranteeStart} 00:00:00`,
        end: `${form.guaranteeEnd} 00:00:00`,
      },
      price: [
        { value: Number(form.priceUSD), symbol: 'USD', isDefault: 0 },
        { value: Number(form.priceUAH), symbol: 'UAH', isDefault: 1 },
      ],
      order: orderId,
    };

    try {
      setSubmitting(true);
      await dispatch(fetchAddProduct(payload)).unwrap();
      onClose();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="apm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="apm-close" onClick={onClose} aria-label="close">
          <MdClose size={22} color="#334155" />
        </button>

        <h3 className="apm-title">{t('form.addProductTitle')}</h3>

        <form className="apm-form" onSubmit={handleSubmit} noValidate>
          <div className="apm-field apm-field--full">
            <label>{t('form.title')}</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              className={errors.title ? 'apm-input apm-input--error' : 'apm-input'}
            />
            {errors.title && <span className="apm-error">{errors.title}</span>}
          </div>

          <div className="apm-field">
            <label>{t('form.type')}</label>
            <input
              type="text"
              value={form.type}
              onChange={(e) => setField('type', e.target.value)}
              className={errors.type ? 'apm-input apm-input--error' : 'apm-input'}
            />
            {errors.type && <span className="apm-error">{errors.type}</span>}
          </div>

          <div className="apm-field">
            <label>{t('form.serialNumber')}</label>
            <input
              type="number"
              value={form.serialNumber}
              onChange={(e) => setField('serialNumber', e.target.value)}
              className={errors.serialNumber ? 'apm-input apm-input--error' : 'apm-input'}
            />
            {errors.serialNumber && <span className="apm-error">{errors.serialNumber}</span>}
          </div>

          <div className="apm-field apm-field--full">
            <label>{t('form.specification')}</label>
            <input
              type="text"
              value={form.specification}
              onChange={(e) => setField('specification', e.target.value)}
              className="apm-input"
            />
          </div>

          <div className="apm-field">
            <label>{t('form.condition')}</label>
            <select
              value={form.isNew}
              onChange={(e) => setField('isNew', e.target.value)}
              className="apm-input"
            >
              <option value="1">{t('status.new')}</option>
              <option value="0">{t('status.used')}</option>
            </select>
          </div>

          <div className="apm-field">
            <label>{t('form.photo')}</label>
            <input
              type="text"
              value={form.photo}
              onChange={(e) => setField('photo', e.target.value)}
              className="apm-input"
              placeholder="https://..."
            />
          </div>

          <div className="apm-field">
            <label>{t('form.guaranteeStart')}</label>
            <input
              type="date"
              value={form.guaranteeStart}
              onChange={(e) => setField('guaranteeStart', e.target.value)}
              className={errors.guaranteeStart ? 'apm-input apm-input--error' : 'apm-input'}
            />
            {errors.guaranteeStart && <span className="apm-error">{errors.guaranteeStart}</span>}
          </div>

          <div className="apm-field">
            <label>{t('form.guaranteeEnd')}</label>
            <input
              type="date"
              value={form.guaranteeEnd}
              onChange={(e) => setField('guaranteeEnd', e.target.value)}
              className={errors.guaranteeEnd ? 'apm-input apm-input--error' : 'apm-input'}
            />
            {errors.guaranteeEnd && <span className="apm-error">{errors.guaranteeEnd}</span>}
          </div>

          <div className="apm-field">
            <label>{t('form.priceUSD')}</label>
            <input
              type="number"
              value={form.priceUSD}
              onChange={(e) => setField('priceUSD', e.target.value)}
              className={errors.priceUSD ? 'apm-input apm-input--error' : 'apm-input'}
            />
            {errors.priceUSD && <span className="apm-error">{errors.priceUSD}</span>}
          </div>

          <div className="apm-field">
            <label>{t('form.priceUAH')}</label>
            <input
              type="number"
              value={form.priceUAH}
              onChange={(e) => setField('priceUAH', e.target.value)}
              className={errors.priceUAH ? 'apm-input apm-input--error' : 'apm-input'}
            />
            {errors.priceUAH && <span className="apm-error">{errors.priceUAH}</span>}
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

export default AddProductModal;
