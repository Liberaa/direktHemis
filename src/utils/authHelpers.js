//authhelpers.js In utiles folder. 
const adminUserIds = process.env.ADMIN_USER_IDS?.split(',') || []

export function isAdmin(userId) {
  return adminUserIds.includes(userId)
}
