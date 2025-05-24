// src/utils/authHelpers.js
const adminUserIds = process.env.ADMIN_USER_IDS ? process.env.ADMIN_USER_IDS.split(',') : [];

export function isAdmin(userId) {
  return adminUserIds.includes(String(userId));
}
