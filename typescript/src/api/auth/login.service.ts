import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../error-handler";
import UserRepository from "../users/users.repository";
import config from "../../config";

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

async function loginService(
  loginRequest: LoginRequest
): Promise<LoginResponse> {
  const userRepository = new UserRepository();
  const user = await userRepository.findOneWithPassword(loginRequest.username);

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid Credentials");
  }

  if (user.disabled) {
    throw new AppError(StatusCodes.FORBIDDEN, "User is disabled");
  }

  const isPasswordCorrect = await compare(loginRequest.password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid Credentials");
  }

  const last_login_at = new Date();
  await userRepository.updateLastLoginAt(user.username, last_login_at);

  const token = sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      disabled: user.disabled,
      created_at: user.created_at,
      last_login_at: user.last_login_at,
    },
    config.jwt_secret,
    { expiresIn: "1h" }
  );

  return { token };
}

export default loginService;
