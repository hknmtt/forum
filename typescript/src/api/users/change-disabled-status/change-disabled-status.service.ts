import { StatusCodes } from "http-status-codes";
import { AppError } from "../../error-handler";
import { UserWithoutPassword, role } from "../../../models/user.model";
import UserRepository from "../users.repository";

export type ChangeDisabledStatusRequest = {
  username: string;
  disabled: boolean;
  requestingUser: UserWithoutPassword;
};

export type ChangeDisabledStatusResponse = {
  message: string;
};

async function changeDisabledStatusService(
  request: ChangeDisabledStatusRequest
): Promise<ChangeDisabledStatusResponse> {
  if (request.requestingUser.username === request.username) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Cannot change own disabled status"
    );
  }

  if (request.requestingUser.role === role.USER) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Only ADMIN and MODERATOR roles are allowed to change disabled status"
    );
  }

  const userRepository = new UserRepository();

  const targetUser = await userRepository.findOne(request.username);

  if (!targetUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (request.requestingUser.role === role.MODERATOR) {
    if (targetUser.role != role.USER) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "MODERATOR can only change disabled status of USER"
      );
    }
  }

  const updated = await userRepository.updateDisabledStatus(
    request.username,
    request.disabled
  );

  if (!updated) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error updating user disabled status"
    );
  }

  return { message: "User " + (request.disabled ? "disabled" : "enabled") };
}

export default changeDisabledStatusService;
