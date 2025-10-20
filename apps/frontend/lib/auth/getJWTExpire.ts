export const getJWTExpire = (expiresAt?: number) => {
  return expiresAt ? expiresAt * 1000 : Date.now() + 60 * 60 * 1000
}
