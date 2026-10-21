/**
 * Format currency in Indonesian Rupiah (IDR)
 */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to Indonesian format (e.g. 24 Okt 2026)
 */
export const formatIndonesianDate = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Format category label to Indonesian readable string
 */
export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'tenda':
      return 'Tenda Acara';
    case 'plafon':
      return 'Dekorasi Plafon';
    case 'sound':
      return 'Sound System';
    case 'paket':
      return 'Paket Komplit';
    default:
      return category;
  }
};
