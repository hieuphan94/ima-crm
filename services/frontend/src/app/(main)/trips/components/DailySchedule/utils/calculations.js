export const calculatePrice = (distance, pax) => {
  if (!pax || !distance) return 0;
  const distanceNum = parseFloat(distance) || 0;

  if (pax >= 20) return distanceNum * 300;
  if (pax >= 10) return distanceNum * 200;
  if (pax >= 5) return distanceNum * 100;
  if (pax >= 1) return distanceNum * 50;
  return 0;
};
