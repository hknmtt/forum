import GetUserService, { GetUserRequest } from "./get-user.service";
import { UserWithoutPassword, role } from "../../../models/user.model";
import { AppError } from "../../error-handler";

const userFixture = (id: number): UserWithoutPassword => ({
  id,
  username: `user${id}`,
  role: role.USER,
  disabled: false,
  created_at: new Date(0),
  last_login_at: new Date(0),
});

const mockFindOne = jest.fn();

jest.mock("../users.repository.ts", () => {
  return jest.fn().mockImplementation(() => {
    return { findOne: mockFindOne };
  });
});

describe("getUserService", () => {
  test("should return a user by username", async () => {
    const getUserRequest: GetUserRequest = {
      username: "user1",
    };

    mockFindOne.mockResolvedValue(userFixture(1));

    const response = await GetUserService(getUserRequest);

    expect(response.user).toEqual(userFixture(1));
  });
  test("should throw an error if the user is not found", async () => {
    const getUserRequest: GetUserRequest = {
      username: "user1",
    };

    mockFindOne.mockResolvedValue(null);

    await expect(GetUserService(getUserRequest)).rejects.toThrow(AppError);
  });
});
