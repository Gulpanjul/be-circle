import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "";

export function signToken(id: string) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
}

export function forgotToken(email: string) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
