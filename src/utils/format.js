export const formatMoney = amount =>
    `RD$ ${parseFloat(amount || 0).toLocaleString('es-DO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export const formatDate = dateStr => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return String(dateStr);
    return d.toLocaleDateString('es-DO', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const truncate = (text, max = 80) =>
    !text ? '' : text.length > max ? text.slice(0, max) + '…' : text;
