import DeleteUserService, { DeleteUserRequest } from "./delete-user.service";
import { UserWithoutPassword, role } from "../../../models/user.model";
import { AppError } from "../../error-handler";

const userFixture = (id: number, role: role): UserWithoutPassword => ({
  id,
  username: `user${id}`,
  role: role,
  disabled: false,
  created_at: new Date(0),
  last_login_at: new Date(0),
});

const mockDelete = jest.fn();

jest.mock("../users.repository.ts", () => {
  return jest.fn().mockImplementation(() => {
    return { delete: mockDelete };
  });
});

describe("deleteUserService", () => {
  test("should delete a user by username", async () => {
    const deleteUserRequest: DeleteUserRequest = {
      username: "user1",
      requestingUser: userFixture(2, role.ADMIN),
    };

    mockDelete.mockResolvedValue(userFixture(1, role.USER));

    const response = await DeleteUserService(deleteUserRequest);

    expect(response.message).toBe("User deleted");
  });
  test("should throw an error if the user is not found", async () => {
    const deleteUserRequest: DeleteUserRequest = {
      username: "user1",
      requestingUser: userFixture(2, role.ADMIN),
    };

    mockDelete.mockResolvedValue(null);

    await expect(DeleteUserService(deleteUserRequest)).rejects.toThrow(
      AppError
    );
  });
  test("should throw an error if the requesting user is not an ADMIN", async () => {
    const deleteUserRequest: DeleteUserRequest = {
      username: "user1",
      requestingUser: userFixture(2, role.USER),
    };

    mockDelete.mockResolvedValue(userFixture(1, role.USER));

    await expect(DeleteUserService(deleteUserRequest)).rejects.toThrow(
      AppError
    );
  });
  test("should throw an error if the requesting user is the same as the user to be deleted", async () => {
    const deleteUserRequest: DeleteUserRequest = {
      username: "user1",
      requestingUser: userFixture(1, role.ADMIN),
    };

    mockDelete.mockResolvedValue(userFixture(1, role.USER));

    await expect(DeleteUserService(deleteUserRequest)).rejects.toThrow(
      AppError
    );
  });
});
