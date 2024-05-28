import { StatusCodes } from "http-status-codes";
import { AppError } from "../../error-handler";
import { UserWithoutPassword, role } from "../../../models/user.model";
import UserRepository from "../users.repository";
import { hash } from "bcrypt";

export type CreateUserRequest = {
  username: string;
  password: string;
  role: role;
  requestingUser: UserWithoutPassword;
};

export type CreateUserResponse = {
  user: UserWithoutPassword;
};

async function createUserService(
  createUsersRequest: CreateUserRequest
): Promise<CreateUserResponse> {
  if (createUsersRequest.requestingUser.role !== role.ADMIN) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Requesting user should be an ADMIN"
    );
  }

  const saltedHashedPassword = await hash(createUsersRequest.password, 10);

  const userRepository = new UserRepository();
  const user = await userRepository.create(
    createUsersRequest.username,
    saltedHashedPassword,
    createUsersRequest.role
  );

  return { user };
}

export default createUserService;
