import api from "./axios";

export function getMe() {
  return api.get("/api/me");
}

export function updateMe(payload) {
  return api.put("/api/me", payload);
}
