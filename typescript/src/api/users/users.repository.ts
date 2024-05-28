import { User, UserWithoutPassword, role } from "../../models/user.model";
import db from "../../database/db";
import { AppError } from "../error-handler";
import { StatusCodes } from "http-status-codes";
import { SqliteError } from "better-sqlite3";

class UserRepository {
  async findPaginated(
    take: number,
    skip: number
  ): Promise<UserWithoutPassword[]> {
    const users = db
      .prepare("SELECT * FROM user LIMIT :take OFFSET :skip")
      .all({ take, skip });

    return users.map((user: any) => {
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        disabled: Boolean(user.disabled),
        created_at: new Date(user.created_at),
        last_login_at: new Date(user.last_login_at),
      };
    });
  }

  async findOne(username: string): Promise<UserWithoutPassword | null> {
    const user: any = db
      .prepare("SELECT * FROM user WHERE username = :username")
      .get({ username });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      disabled: Boolean(user.disabled),
      created_at: new Date(user.created_at),
      last_login_at: new Date(user.last_login_at),
    };
  }

  async findOneWithPassword(username: string): Promise<User | null> {
    const user: any = db
      .prepare("SELECT * FROM user WHERE username = :username")
      .get({ username });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      password: user.password,
      role: user.role,
      disabled: Boolean(user.disabled),
      created_at: new Date(user.created_at),
      last_login_at: new Date(user.last_login_at),
    };
  }

  async create(
    username: string,
    password: string,
    role: role
  ): Promise<UserWithoutPassword> {
    try {
      const user: any = db
        .prepare(
          "INSERT INTO user (username, password, role) VALUES (:username, :password, :role)"
        )
        .run({ username, password, role });

      return {
        id: user.id,
        username,
        role,
        disabled: false,
        created_at: new Date(0),
        last_login_at: new Date(0),
      };
    } catch (err) {
      if (err instanceof SqliteError) {
        if (err.message.includes("UNIQUE constraint failed")) {
          throw new AppError(StatusCodes.CONFLICT, "Username already exists");
        }
      }

      throw err;
    }
  }

  async delete(username: string): Promise<Boolean> {
    const res: any = db
      .prepare("DELETE FROM user WHERE username = :username")
      .run({ username });

    if (res.changes === 0) {
      return false;
    } else {
      return true;
    }
  }

  async updateDisabledStatus(
    username: string,
    disabled: boolean
  ): Promise<boolean> {
    const sqlite_disabled = disabled ? 1 : 0;
    const res: any = db
      .prepare(
        "UPDATE user SET disabled = :disabled WHERE username = :username"
      )
      .run({ username, disabled: sqlite_disabled });

    console.log(res);

    if (res.changes === 0) {
      return false;
    } else {
      return true;
    }
  }

  async updateLastLoginAt(
    username: string,
    last_login_at: Date
  ): Promise<void> {
    const sqliteDate = last_login_at.toISOString();
    db.prepare(
      "UPDATE user SET last_login_at = :sqliteDate WHERE username = :username"
    ).run({ username, sqliteDate });
  }
}

export default UserRepository;
