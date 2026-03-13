type UpvoteUser = {
  id?: string | number
  email?: string
  [key: string]: unknown
}

const COOKIE_NAME = 'upvote_user'

const setUpvoteCookie = (user: UpvoteUser) => {
  if (typeof window === 'undefined') return
  const payload = encodeURIComponent(JSON.stringify({ id: user.id ?? '', email: user.email ?? '' }))
  document.cookie = `${COOKIE_NAME}=${payload}; path=/; max-age=2592000; samesite=lax`
}

const clearUpvoteCookie = () => {
  if (typeof window === 'undefined') return
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=lax`
}

export const syncUpvoteLogin = (user: UpvoteUser) => {
  if (typeof window === 'undefined') return
  setUpvoteCookie(user)
  window.dispatchEvent(new CustomEvent('upvote:login', { detail: user }))
}

export const syncUpvoteLogout = () => {
  if (typeof window === 'undefined') return
  clearUpvoteCookie()
  window.dispatchEvent(new CustomEvent('upvote:logout'))
}
