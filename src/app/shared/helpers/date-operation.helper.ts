export const getDateOneYearLater = (dateString: string): string => {
  // Verifica si el formato es dd/mm/yyyy
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return '';
  }

  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  
  date.setFullYear(date.getFullYear() + 1);

  const newDay = date.getDate().toString().padStart(2, "0");
  const newMonth = (date.getMonth() + 1).toString().padStart(2, "0");
  const newYear = date.getFullYear();

  return `${newDay}/${newMonth}/${newYear}`;
};

export const formatDateYYYYMMDDtoDDMMYYYY = (dateString: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return '';
  }
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};