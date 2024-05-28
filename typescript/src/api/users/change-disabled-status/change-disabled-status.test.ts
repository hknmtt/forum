import ChangeDisabledStatusUserService, {
  ChangeDisabledStatusRequest,
} from "./change-disabled-status.service";
import { UserWithoutPassword, role } from "../../../models/user.model";
import { AppError } from "../../error-handler";
import { mock } from "node:test";

const userFixture = (id: number, role: role): UserWithoutPassword => ({
  id,
  username: `user${id}`,
  role: role,
  disabled: false,
  created_at: new Date(0),
  last_login_at: new Date(0),
});

const mockFindOne = jest.fn();
const mockUpdateDisabledStatus = jest.fn();

jest.mock("../users.repository.ts", () => {
  return jest.fn().mockImplementation(() => {
    return {
      findOne: mockFindOne,
      updateDisabledStatus: mockUpdateDisabledStatus,
    };
  });
});

describe("changeDisabledStatusUserService", () => {
  test("should change the disabled status of a user", async () => {
    const admin = userFixture(1, role.ADMIN);

    const request: ChangeDisabledStatusRequest = {
      username: "user2",
      disabled: true,
      requestingUser: admin,
    };

    mockFindOne.mockResolvedValue(userFixture(2, role.USER));
    mockUpdateDisabledStatus.mockResolvedValue(true);

    const response = await ChangeDisabledStatusUserService(request);

    expect(response.message).toBe("User disabled");

    const request2: ChangeDisabledStatusRequest = {
      username: "user2",
      disabled: false,
      requestingUser: admin,
    };

    const response2 = await ChangeDisabledStatusUserService(request2);

    expect(response2.message).toBe("User enabled");
  });
  test("should throw an error if the user is not found", async () => {
    const admin = userFixture(1, role.ADMIN);

    const request: ChangeDisabledStatusRequest = {
      username: "user2",
      disabled: true,
      requestingUser: admin,
    };

    mockFindOne.mockResolvedValue(null);

    await expect(ChangeDisabledStatusUserService(request)).rejects.toThrow(
      AppError
    );
  });
  test("should throw an error if the requesting user is changing their own disabled status", async () => {
    const user = userFixture(1, role.USER);

    const request: ChangeDisabledStatusRequest = {
      username: "user1",
      disabled: true,
      requestingUser: user,
    };

    mockFindOne.mockResolvedValue(user);

    await expect(ChangeDisabledStatusUserService(request)).rejects.toThrow(
      AppError
    );
  });
  test("should throw an error if the requesting user is not an ADMIN or MODERATOR", async () => {
    const user = userFixture(1, role.USER);

    const request: ChangeDisabledStatusRequest = {
      username: "user2",
      disabled: true,
      requestingUser: user,
    };

    mockFindOne.mockResolvedValue(user);

    await expect(ChangeDisabledStatusUserService(request)).rejects.toThrow(
      AppError
    );
  });
  test("should throw an error if the requesting user is a MODERATOR and the target user is not a USER", async () => {
    const moderator = userFixture(1, role.MODERATOR);

    const request: ChangeDisabledStatusRequest = {
      username: "user2",
      disabled: true,
      requestingUser: moderator,
    };

    mockFindOne.mockResolvedValue(userFixture(2, role.MODERATOR));

    await expect(ChangeDisabledStatusUserService(request)).rejects.toThrow(
      AppError
    );
  });
  test("should throw an error if the update fails", async () => {
    const admin = userFixture(1, role.ADMIN);

    const request: ChangeDisabledStatusRequest = {
      username: "user2",
      disabled: true,
      requestingUser: admin,
    };

    mockFindOne.mockResolvedValue(userFixture(2, role.USER));
    mockUpdateDisabledStatus.mockResolvedValue(false);

    await expect(ChangeDisabledStatusUserService(request)).rejects.toThrow(
      AppError
    );
  });
});
