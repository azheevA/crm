export interface SocketUser {
  id: number;
}

export interface JwtPayload {
  sub: number;
  [key: string]: any;
}
