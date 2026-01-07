const API_URL = 'http://localhost:5000/api/orders';

export const placeOrder = async (orderData) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    return res.json();
};

export const getOrders = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

export const updateOrderStatus = async (id, status) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    return res.json();
};
