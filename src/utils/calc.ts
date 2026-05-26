export const formatNumber = (rent?: number) => {
    if (typeof rent !== 'number') return '';
    return rent.toLocaleString('sv-SE');
};