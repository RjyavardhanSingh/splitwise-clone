import client from './client';

export const register = (data) => client.post('/auth/register', data).then((r) => r.data);

export const verifyEmail = (data) => client.post('/auth/verify-email', data).then((r) => r.data);

export const login = (data) => client.post('/auth/login', data).then((r) => r.data);

export const googleAuth = (data) => client.post('/auth/google', data).then((r) => r.data);

export const getMe = () => client.get('/auth/me').then((r) => r.data);

export const forgotPassword = (data) => client.post('/auth/forgot-password', data).then((r) => r.data);

export const resetPassword = (data) => client.post('/auth/reset-password', data).then((r) => r.data);

export const updateProfile = (data) => client.put('/auth/profile', data).then((r) => r.data);
