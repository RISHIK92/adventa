import { BACKEND_URL } from "./config";
import { auth } from "./firebase";

const getIdToken = async () => {
  const user = auth?.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

export const signupUser = async () => {
  const idToken = await getIdToken();

  const res = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  console.log(res, "res");
  if (!res.ok) throw new Error(data.msg || "Signup failed");
  return data;
};

export const loginUser = async () => {
  const idToken = await getIdToken();

  const res = await fetch(`${BACKEND_URL}/auth/signin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || "Login failed");
  return data.token;
};
