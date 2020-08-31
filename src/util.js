export const formatDate = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);

  const hDisplay = h > 0 ? `${h} ч. ` : '';
  const mDisplay = m > 0 ? `${m} м. ` : '';

  return hDisplay + mDisplay;
}
