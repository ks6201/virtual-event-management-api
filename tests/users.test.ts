import { app } from "../app";
import supertest from "supertest";
import { describe, expect, it } from "vitest";


const server = supertest(app);

let loginToken: string;
describe("Attendee", () => {
    
    it("POST /users/register should respond with status 201 Ok with valid registeration data", async() => {
        
        const user = {
            "name": "Sudhanshu",
            "email": "mail2@mail.co",
            "password": "Passwd@1234",
            "role": "attendee"
        }

        const response = await server.post("/users/register").send(user);
        
        expect(response.status).toBe(201);
    });

    it("POST /users/register should respond with status 400 BadRequest with Invalid registeration data", async() => {
        const user = {
            "name": "Sudhanshu",
            "email": "mail2@mail.co",
            "password": "Passwd@1234",
            "role": "attendees"
        }

        const response = await server.post("/users/register").send(user);
        
        expect(response.status).toBe(400);
    });

    it("POST /users/register should respond with status 400 BadRequest with Invalid email format", async() => {
        const user = {
            "name": "Sudhanshu",
            "email": "mail@mai",
            "password": "Passwd@1234",
            "role": "attendee"
        }

        const response = await server.post("/users/register").send(user);
        
        expect(response.status).toBe(400);
    });

    it("POST /users/register should respond with status 400 BadRequest with Invalid password format", async() => {
        const user = {
            "name": "Sudhanshu",
            "email": "mail@mai",
            "password": "Passw",
            "role": "attendee"
        }

        const response = await server.post("/users/register").send(user);
        
        expect(response.status).toBe(400);
    });
    
    it("POST /users/login should response with status 200 and have token property in response json body", async() => {
        const loginCreds = {
            "email": "mail2@mail.co",
            "password": "Passwd@1234",
            "role": "attendee"
        }

        const response = await server.post("/users/login").send(loginCreds);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");

        loginToken = response.body["token"];
    });

    it("POST /users/login should response with status 400 with Invalid email format", async() => {
        const loginCreds = {
            "email": "mail@",
            "password": "Passwd@1234",
            "role": "attendee"
        }

        const response = await server.post("/users/login").send(loginCreds);
        
        expect(response.status).toBe(400);
    });

    it("POST /users/login should response with status 400 with Invalid password format", async() => {
        const loginCreds = {
            "email": "mail2@mail.co",
            "password": "Passw",
            "role": "attendee"
        }

        const response = await server.post("/users/login").send(loginCreds);
        
        expect(response.status).toBe(400);
    });

    it("POST /users/login should response with status 400 with Invalid password format", async() => {
        const loginCreds = {
            "email": "mail2@mail.co",
            "password": "Passw"
        }

        const response = await server.post("/users/login").send(loginCreds);
        
        expect(response.status).toBe(400);
    });

    it("POST /users/login should response with status 401 with Invalid user credentials", async() => {
        const loginCreds = {
            "email": "mail2@mail.co",
            "password": "Passwd@1254",
            "role": "attendee"
        }

        const response = await server.post("/users/login").send(loginCreds);
        expect(response.status).toBe(401);
    });
});

describe("Organizer", () => {
    it("POST /users/register should respond with status 201 Ok with valid registeration data", async() => {
        
        const user = {
            "name": "Sudhanshu",
            "email": "mail2@mail.co",
            "password": "Passwd@1234",
            "role": "organizer"
        }

        const response = await server.post("/users/register").send(user);
        
        expect(response.status).toBe(201);
    });

    it("POST /users/register should respond with status 400 BadRequest with Invalid registeration data", async() => {
        const user = {
            "name": "Sudhanshu",
            "email": "mail2@mail.co",
            "password": "Passwd@1234",
            "role": "organizers"
        }

        const response = await server.post("/users/register").send(user);
        
        expect(response.status).toBe(400);
    });

    it("POST /users/register should respond with status 400 BadRequest with Invalid email format", async() => {
        const user = {
            "name": "Sudhanshu",
            "email": "mail@mai",
            "password": "Passwd@1234",
            "role": "organizer"
        }

        const response = await server.post("/users/register").send(user);
        
        expect(response.status).toBe(400);
    });

    it("POST /users/register should respond with status 400 BadRequest with Invalid password format", async() => {
        const user = {
            "name": "Sudhanshu",
            "email": "mail@mai",
            "password": "Passw",
            "role": "organizer"
        }

        const response = await server.post("/users/register").send(user);
        
        expect(response.status).toBe(400);
    });

    it("POST /users/login should response with status 200 and have token property in response json body", async() => {
        const loginCreds = {
            "email": "mail2@mail.co",
            "password": "Passwd@1234",
            "role": "organizer"
        }

        const response = await server.post("/users/login").send(loginCreds);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    it("POST /users/login should response with status 400 with Invalid email format", async() => {
        const loginCreds = {
            "email": "mail@",
            "password": "Passwd@1234",
            "role": "organizer"
        }

        const response = await server.post("/users/login").send(loginCreds);
        
        expect(response.status).toBe(400);
    });

    it("POST /users/login should response with status 400 with Invalid password format", async() => {
        const loginCreds = {
            "email": "mail2@mail.co",
            "password": "Passw",
            "role": "organizer"
        }

        const response = await server.post("/users/login").send(loginCreds);
        
        expect(response.status).toBe(400);
    });

    it("POST /users/login should response with status 400 with Invalid password format", async() => {
        const loginCreds = {
            "email": "mail2@mail.co",
            "password": "Passw",
            "role": "organizer"
        }

        const response = await server.post("/users/login").send(loginCreds);
        
        expect(response.status).toBe(400);
    });

    it("POST /users/login should response with status 401 with Invalid user credentials", async() => {
        const loginCreds = {
            "email": "mail2@mail.co",
            "password": "Passwd@1254",
            "role": "organizer"
        }

        const response = await server.post("/users/login").send(loginCreds);
        expect(response.status).toBe(401);
    });
});
