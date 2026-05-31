import client from './client';

export const settleUp = (groupId, data) =>
  client.post(`/groups/${groupId}/settle`, data).then((r) => r.data);
