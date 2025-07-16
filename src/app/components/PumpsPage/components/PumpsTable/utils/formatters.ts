// Format cell values for display
export const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return '-';

  if (typeof value !== 'object' || value === null) {
    return String(value);
  }

  const obj = value as { value?: number; unit?: string };
  if (obj.value !== undefined && obj.unit !== undefined) {
    return `${obj.value} ${obj.unit}`;
  }

  return String(value);
};

// Get responsive CSS class names
export const getResponsiveClass = (responsive: string) => {
  switch (responsive) {
    case 'always':
      return '';
    case 'sm':
      return 'd-none d-sm-table-cell';
    case 'md':
      return 'd-none d-md-table-cell';
    case 'lg':
      return 'd-none d-lg-table-cell';
    case 'xl':
      return 'd-none d-xl-table-cell';
    default:
      return '';
  }
};
