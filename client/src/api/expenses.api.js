import client from './client';

export const getExpenses = (groupId) =>
  client.get(`/groups/${groupId}/expenses`).then((r) => r.data);

export const addExpense = (groupId, data) =>
  client.post(`/groups/${groupId}/expenses`, data).then((r) => r.data);

export const deleteExpense = (groupId, expenseId) =>
  client.delete(`/groups/${groupId}/expenses/${expenseId}`).then((r) => r.data);
