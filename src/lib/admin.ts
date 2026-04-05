/**
 * Admin utilities — auth check + admin email list
 */

const ADMIN_EMAILS = [
  'lkdrop@gmail.com',
  // Add more admin emails here
]

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

/**
 * In development mode, bypass admin check.
 * In production, verify the email is in the admin list.
 */
export function requireAdmin(email: string | undefined | null): boolean {
  if (process.env.NODE_ENV === 'development') return true
  return isAdminEmail(email)
}
