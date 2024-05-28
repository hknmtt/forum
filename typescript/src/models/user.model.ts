export type User = {
  id: number;
  username: string;
  password: string;
  role: role;
  disabled: boolean;
  created_at: Date;
  last_login_at: Date;
};

export type UserWithoutPassword = Omit<User, "password">;

export enum role {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}
