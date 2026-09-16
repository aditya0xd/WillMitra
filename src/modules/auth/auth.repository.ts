import { randomUUID } from "crypto";

const user: { email: string; id: string; password: string }[] = [
  {
    email: "example@gmail.com",
    id: "1",
    password: "pass123",
  },
];

export function createUser(email: string, password: string) {
  const id = randomUUID();
  user.push({ email, id, password });
  return id;
}

export function getUser(email: string) {
  const User = user.find((user) => user.email === email);
  return User;
}
