export const TOKEN_INFO = "@scq-Token";
export const USER_ROLE = "@scq-Role";
export const USER_NAME = "@scq-UserName";
export const USER_ENABLE = "@scq-UserEnable";
export const TOKEN_EXP = "@scq-TokenExp"
const plusDate = () => {
  var date = new Date()
  var expTime = date.getTime() + 14000000

  return expTime
}
export const isAuthenticated = () => localStorage.getItem(TOKEN_INFO) !== null;
export const isTokenExpired = () => localStorage.getItem(TOKEN_EXP) < new Date().getTime()
export const getToken = () => localStorage.getItem(TOKEN_INFO);
export const getUserRole = () => localStorage.getItem(USER_ROLE);
export const getUserName = () => localStorage.getItem(USER_NAME);
export const isUserEnable = () => localStorage.getItem(USER_ENABLE);
export const login = user => {
  localStorage.setItem(TOKEN_EXP, plusDate())
  localStorage.setItem(TOKEN_INFO, user.token);
  localStorage.setItem(USER_ROLE,user.userRole)
  localStorage.setItem(USER_NAME,user.userName)
  localStorage.setItem(USER_ENABLE,user.enable)
};
export const logout = () => {
  localStorage.removeItem(TOKEN_EXP)
  localStorage.removeItem(TOKEN_INFO);
  localStorage.removeItem(USER_ROLE)
  localStorage.removeItem(USER_NAME)
  localStorage.removeItem(USER_ENABLE)
};


