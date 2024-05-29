import supertest from "supertest";
import app from "../../app";
import { User, UserWithoutPassword, role } from "../../models/user.model";
import db from "../../database/db";

const userFixture = (id: number, role: role): UserWithoutPassword => ({
  id,
  username: `${role.toLocaleLowerCase}${id}`,
  role: role,
  disabled: false,
  created_at: new Date(0),
  last_login_at: new Date(0),
});

const request = supertest(app);

beforeAll(async () => {
  db.prepare("BEGIN TRANSACTION").run();
});

afterAll(() => {
  db.prepare("ROLLBACK").run();
  db.close();
});

beforeEach(() => {
  db.prepare("SAVEPOINT beforeEach").run();
});

afterEach(() => {
  db.prepare("ROLLBACK TO beforeEach").run();
});

describe("Auth routes", () => {
  test("POST /auth/login should return a JWT token", async () => {
    const response = await request
      .post("/v1/auth/login")
      .send({ username: "user1", password: "12345678" })
      .expect(200);

    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});

describe("User routes", () => {
  describe("Without authentication", () => {
    test("GET /users/:username should return a user by username", async () => {
      const response = await request.get("/v1/users/user1").expect(200);

      expect(response.body).toEqual({
        user: {
          id: expect.any(Number),
          username: "user1",
          role: "USER",
          disabled: false,
          created_at: expect.any(String),
          last_login_at: expect.any(String),
        },
      });
    });
  });
  describe("With authentication", () => {
    let token: string;

    beforeAll(async () => {
      const response = await request
        .post("/v1/auth/login")
        .send({ username: "admin1", password: "12345678" });

      token = response.body.token;
    });

    test("GET /users should return a list of users", async () => {
      const response = await request
        .get("/v1/users?take=10&skip=0")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.users.length).toBe(9);
    });

    test("POST /users should create a new user", async () => {
      const response = await request
        .post("/v1/users")
        .send({ username: "newuser", password: "12345678", role: "USER" })
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      expect(response.body).toEqual({
        user: {
          // id: expect.any(Number), @TODO
          username: "newuser",
          role: "USER",
          disabled: false,
          created_at: expect.any(String),
          last_login_at: expect.any(String),
        },
      });
    });
    test("DELETE /users/:username should delete a user", async () => {
      const response = await request
        .delete("/v1/users/user1")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual({ message: "User deleted" });
    });
    test("PATCH /users/:username/disable should disable a user", async () => {
      const response = await request
        .patch("/v1/users/user1/disable")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual({
        message: "User disabled",
      });
    });
    test("PATCH /users/:username/enable should enable a user", async () => {
      const response = await request
        .patch("/v1/users/user1/enable")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual({
        message: "User enabled",
      });
    });
  });
});
