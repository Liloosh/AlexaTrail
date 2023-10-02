import jwtDecode from "jwt-decode";

export function createSession(Token) {
  const token = Token;
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 2);

  localStorage.setItem("token", token);
  localStorage.setItem("expiration", expiration.getTime().toString());
}

export function getUserName() {
  const jwt = jwtDecode(localStorage.getItem("token"));
  return jwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
}

export function getUserId() {
  const jwt = jwtDecode(localStorage.getItem("token"));
  return jwt[
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
  ];
}

export function tokenDuration() {
  const storedTokenExpiration = localStorage.getItem("expiration");
  const now = new Date();
  const duration = storedTokenExpiration - now.getTime();

  return duration;
}

export function getToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const duration = tokenDuration();

  if (duration < 0) {
    return "EXPIRED";
  }

  return token;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
}
