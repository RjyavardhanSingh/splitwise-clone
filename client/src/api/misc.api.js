import client from './client';

export const getTransactions = () => client.get('/transactions').then((r) => r.data);
export const getSettlements = () => client.get('/settlements').then((r) => r.data);
export const getAnalytics = () => client.get('/analytics').then((r) => r.data);
