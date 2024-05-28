import { StatusCodes } from "http-status-codes";
import { AppError } from "../../error-handler";
import { UserWithoutPassword, role } from "../../../models/user.model";
import UserRepository from "../users.repository";

export type GetUsersRequest = {
  take: number;
  skip: number;
  requestingUser: UserWithoutPassword;
};

export type GetUsersResponse = {
  users: UserWithoutPassword[];
};

async function getUsersService(
  getUsersRequest: GetUsersRequest
): Promise<GetUsersResponse> {
  if (getUsersRequest.requestingUser.role === role.USER) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only ADMINS and MODERATORS are allowed to access this resource."
    );
  }

  const userRepository = new UserRepository();

  const users = await userRepository.findPaginated(
    getUsersRequest.take,
    getUsersRequest.skip
  );

  return { users };
}

export default getUsersService;
