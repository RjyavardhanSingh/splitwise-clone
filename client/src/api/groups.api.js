import client from './client';

export const getGroups = () => client.get('/groups').then((r) => r.data);

export const getGroup = (id) => client.get(`/groups/${id}`).then((r) => r.data);

export const createGroup = (data) => client.post('/groups', data).then((r) => r.data);

export const inviteMember = (groupId, email) =>
  client.post(`/groups/${groupId}/members`, { email }).then((r) => r.data);

export const acceptInvite = (token) =>
  client.post('/groups/accept-invite', { token }).then((r) => r.data);

export const getPendingInvites = () =>
  client.get('/groups/invites').then((r) => r.data);
