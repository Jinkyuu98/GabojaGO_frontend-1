import { api } from "../lib/api";

// [MOD] api 인스턴스 사용하도록 통일 및 중복 코드 정리
export const signup = async (data) => {
  const res = await api.post("/auth/register", data);

  // ⭐ 회원가입 즉시 로그인 처리
  if (res.data?.access_token) {
    localStorage.setItem("token", res.data.access_token);
  }

  return res.data;
};

// [MOD] api 인스턴스 사용 및 데이터 형식({id, pw}) 유지
export const login = async (id, password) => {
  const res = await api.post("/auth/login", { id: id, pw: password });

  if (res.data?.access_token) {
    localStorage.setItem("token", res.data.access_token);
  }

  return res.data;
};
