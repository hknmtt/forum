import CreateUserService, { CreateUserRequest } from "./create-user.service";
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

const mockCreate = jest.fn();

jest.mock("./users.repository.ts", () => {
  return jest.fn().mockImplementation(() => {
    return { create: mockCreate };
  });
});

describe("createUserService", () => {
  test("should create a user", async () => {
    const createUserRequest: CreateUserRequest = {
      username: "username",
      password: "password00",
      role: role.USER,
      requestingUser: userFixture(1, role.ADMIN),
    };

    mockCreate.mockResolvedValue(userFixture(1, role.USER));

    const response = await CreateUserService(createUserRequest);

    expect(response.user).toEqual(userFixture(1, role.USER));
  });
  test("should throw an error if requestingUser is not an admin", async () => {
    const createUserRequest: CreateUserRequest = {
      username: "username",
      password: "password00",
      role: role.USER,
      requestingUser: userFixture(1, role.USER),
    };

    await expect(CreateUserService(createUserRequest)).rejects.toThrow();
  });
  test("should throw an error if username already exists", async () => {
    const createUserRequest: CreateUserRequest = {
      username: "username",
      password: "password00",
      role: role.USER,
      requestingUser: userFixture(1, role.ADMIN),
    };

    mockCreate.mockRejectedValue(
      new Error("SQLITE_CONSTRAINT: UNIQUE constraint failed: user.username")
    );
    await expect(CreateUserService(createUserRequest)).rejects.toThrow();
  });
});
