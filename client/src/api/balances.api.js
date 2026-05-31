import client from './client';

export const getGroupBalances = (groupId) =>
  client.get(`/groups/${groupId}/balances`).then((r) => r.data);

export const getDashboard = () => client.get('/dashboard/balances').then((r) => r.data);
