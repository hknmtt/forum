import getUsersService, { GetUsersRequest } from "./get-users.service";
import { UserWithoutPassword, role } from "../../../models/user.model";
import { AppError } from "../../error-handler";

const userFixture = (id: number, role: role): UserWithoutPassword => ({
  id,
  username: `user${id}`,
  role,
  disabled: false,
  created_at: new Date(0),
  last_login_at: new Date(0),
});

const usersFixture = [
  userFixture(1, role.USER),
  userFixture(2, role.USER),
  userFixture(3, role.USER),
];

const mockFindPaginated = jest.fn();

jest.mock("./users.repository", () => {
  return jest.fn().mockImplementation(() => {
    return { findPaginated: mockFindPaginated };
  });
});

describe("getUsersService", () => {
  test("should return a list of users", async () => {
    const getUsersRequest: GetUsersRequest = {
      take: 10,
      skip: 0,
      requestingUser: userFixture(1, role.ADMIN),
    };

    mockFindPaginated.mockResolvedValue(usersFixture);

    const response = await getUsersService(getUsersRequest);

    expect(response.users).toEqual(usersFixture);
  });
  test("should throw an error if the requesting user is not an ADMIN or MODERATOR", async () => {
    const getUsersRequest: GetUsersRequest = {
      take: 10,
      skip: 0,
      requestingUser: userFixture(1, role.USER),
    };

    await expect(getUsersService(getUsersRequest)).rejects.toThrow(AppError);
  });
});
