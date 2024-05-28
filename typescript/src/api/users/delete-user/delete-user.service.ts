import { StatusCodes } from "http-status-codes";
import { AppError } from "../../error-handler";
import { UserWithoutPassword, role } from "../../../models/user.model";
import UserRepository from "../users.repository";

export type DeleteUserRequest = {
  username: string;
  requestingUser: UserWithoutPassword;
};

export type DeleteUserResponse = {
  message: string;
};

async function deleteUserService(
  getUsersRequest: DeleteUserRequest
): Promise<DeleteUserResponse> {
  if (getUsersRequest.requestingUser.role !== role.ADMIN) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only ADMIN role is allowed to delete an user"
    );
  }

  if (getUsersRequest.requestingUser.username === getUsersRequest.username) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Users are not allowed to delete themselves"
    );
  }

  const userRepository = new UserRepository();

  const user = await userRepository.delete(getUsersRequest.username);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return { message: "User deleted" };
}

export default deleteUserService;
