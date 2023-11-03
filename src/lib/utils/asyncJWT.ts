import jwt from "jsonwebtoken";

export async function verifyToken(token: string, secret: string): Promise<any> {
  return new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, decoded) =>
      err ? reject({}) : resolve(decoded),
    ),
  );
}
