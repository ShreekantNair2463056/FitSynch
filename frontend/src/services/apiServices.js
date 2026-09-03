import api from './api';

export const planService = {
  getAll: () => api.get('/plans').then(res => res.data.data || res.data),
  create: (data) => api.post('/plans', data).then(res => res.data.data || res.data),
  update: (id, data) => api.put(`/plans/${id}`, data).then(res => res.data.data || res.data),
  delete: (id) => api.delete(`/plans/${id}`).then(res => res.data.data || res.data)
};

export const membershipService = {
  purchase: (planId) => api.post('/memberships', { planId }).then(res => res.data.data || res.data),
  getMyMembership: () => api.get('/memberships/me').then(res => res.data.data || res.data)
};

export const classService = {
  getAll: () => api.get('/classes').then(res => res.data.data || res.data),
  create: (data) => api.post('/classes', data).then(res => res.data.data || res.data),
  book: (id) => api.post(`/classes/${id}/book`).then(res => res.data.data || res.data),
  waitlist: (id) => api.post(`/classes/${id}/waitlist`).then(res => res.data.data || res.data)
};

export const bookingService = {
  getMyBookings: () => api.get('/bookings/me').then(res => res.data.data || res.data),
  cancel: (id) => api.delete(`/bookings/${id}/cancel`).then(res => res.data.data || res.data)
};

export const waitlistService = {
  getMyWaitlist: () => api.get('/waitlist/me').then(res => res.data.data || res.data)
};

export const workoutService = {
  getMyPlans: () => api.get('/plans/me').then(res => res.data.data || res.data),
  getAssignedPlans: () => api.get('/trainers/plans').then(res => res.data.data || res.data),
  assignPlan: (memberId, data) => api.post(`/members/${memberId}/plans`, data).then(res => res.data.data || res.data)
};

export const attendanceService = {
  checkIn: (data) => api.post('/attendance/checkin', data).then(res => res.data.data || res.data),
  getMyAttendance: () => api.get('/attendance/me').then(res => res.data.data || res.data)
};

export const reportService = {
  getAttendance: () => api.get('/admin/reports/attendance').then(res => res.data.data || res.data),
  getPlans: () => api.get('/admin/reports/plans').then(res => res.data.data || res.data),
  getRenewals: () => api.get('/admin/reports/renewals').then(res => res.data.data || res.data)
};

export const authService = {
  getMembers: () => api.get('/auth/members').then(res => res.data.data || res.data)
};
