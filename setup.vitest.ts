import { app } from "./app";
import { db } from "./src/db";
import supertest from "supertest";

export const server = supertest(app);

await db.execute("TRUNCATE users CASCADE");