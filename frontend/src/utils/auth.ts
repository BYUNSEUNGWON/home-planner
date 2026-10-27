export interface AuthUser {
  email: string;
  name: string;
  provider?: "local" | "google" | "kakao" | "naver";
}

const AUTH_STORAGE_KEY = "auth-user";

export function getAuthUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getAuthUser();
}

export function loginLocal(email: string) {
  const user: AuthUser = {
    email,
    name: email.split("@")[0] || "사용자",
    provider: "local",
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function loginSocial(provider: "google" | "kakao" | "naver") {
  const user: AuthUser = {
    email: `${provider}_user@example.com`,
    name:
      provider === "google"
        ? "Google 사용자"
        : provider === "kakao"
        ? "Kakao 사용자"
        : "Naver 사용자",
    provider,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
