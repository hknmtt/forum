import { StatusCodes } from "http-status-codes";
import { AppError } from "../../error-handler";
import { UserWithoutPassword, role } from "../../../models/user.model";
import UserRepository from "../users.repository";

export type GetUserRequest = {
  username: string;
};

export type GetUserResponse = {
  user: UserWithoutPassword;
};

async function getUserService(
  getUsersRequest: GetUserRequest
): Promise<GetUserResponse> {
  const userRepository = new UserRepository();

  const user = await userRepository.findOne(getUsersRequest.username);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
  }

  return { user };
}

export default getUserService;
