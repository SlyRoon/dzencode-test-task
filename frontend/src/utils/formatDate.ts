import i18n from '../i18n';

type DateInput = string | number | Date;

const pad = (n: number): string => String(n).padStart(2, '0');

const getMonthsShort = (): string[] => {
  const months = i18n.t('datetime.months', { returnObjects: true });
  return Array.isArray(months) ? (months as string[]) : [];
};

/** "06 / 04" — день / месяц (числовой) */
export const formatShortDate = (dateString: DateInput): string => {
  const date = new Date(dateString);
  return `${pad(date.getDate())} / ${pad(date.getMonth() + 1)}`;
};

/** "06 / 04 / 2017" — день / месяц / год (числовой) */
export const formatNumericDate = (dateString: DateInput): string => {
  const date = new Date(dateString);
  return `${pad(date.getDate())} / ${pad(date.getMonth() + 1)} / ${date.getFullYear()}`;
};

/** "06 / Сен / 2017" — день / месяц (локализованный) / год */
export const formatLongDate = (dateString: DateInput): string => {
  const date = new Date(dateString);
  const month = getMonthsShort()[date.getMonth()] ?? pad(date.getMonth() + 1);
  return `${pad(date.getDate())} / ${month} / ${date.getFullYear()}`;
};
