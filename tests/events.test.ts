import { server } from "../setup.vitest";
import { beforeAll, describe, expect, it } from "vitest";
import type { CreateUser, LoginUser } from "../src/v-schemas/user";
import { db } from "../src/db";
import { events, users } from "../src/db/schema";
import { eq } from "drizzle-orm";

const organizerSignupCreds: CreateUser = {
    name: "Sudhanshu",
    email: "mail@mail.co",
    password: "Passwd@1234",
    role: "organizer"
}

const organizerLoginCreds: LoginUser = {
    email: "mail@mail.co",
    password: "Passwd@1234",
    role: "organizer"
}

const attendeeSignupCreds: CreateUser = {
    ...organizerSignupCreds,
    email: process.env.EMAIL_ID!, // email Id should be a valid one [ since a mail will be send ]
    role: "attendee"
}

const attendeeLoginCreds: LoginUser = {
    ...organizerLoginCreds,
    email: process.env.EMAIL_ID!, // email Id should be a valid one [ since a mail will be send ]
    role: "attendee"
}


let loginToken: string;
let registeredEventId: string;
let attendeeLoginToken: string;

describe("Event Organizer Registeration", () => {

    beforeAll(async() => {
        const signupResponse = await server.post("/users/register").send(organizerSignupCreds);

        const loginResponse = await server.post("/users/login").send(organizerLoginCreds);
        loginToken = loginResponse.body.token;
    });
    
    it("Should respond with status 401 with no login auth token. POST /events", async() => {

        const eventInfo = {
            name: "ExFrame overview",
            date: "2025-12-13",
            time: "12:45"
        }
        const response = await server
            .post("/events").send(eventInfo);

        expect(response.status).toBe(401);
    });

    it("Should respond with status 400 with bad login auth token. POST /events", async() => {

        const eventInfo = {
            name: "ExFrame overview",
            date: "2025-12-13",
            time: "12:45"
        }
        const response = await server
            .post("/events").send(eventInfo)
            .set("Authorization", `Bearer ${"loginToken"}`);

        expect(response.status).toBe(400);
    });

    it("Should create new event with status 201 having valid data. POST /events", async() => {

        const eventInfo = {
            name: "ExFrame overview",
            date: "2025-12-13",
            time: "12:45"
        }
        const response = await server
            .post("/events").send(eventInfo)
            .set("Authorization", `Bearer ${loginToken}`);

        expect(response.status).toBe(201);
    });

    it("Should respond with status 400 on having Invalid 'name' key in eventInfo for event registration. POST /events", async() => {

        const eventInfo = {
            name: "Ex",
            date: "2025-12-13",
            time: "12:45"
        }
        const response = await server
            .post("/events").send(eventInfo)
            .set("Authorization", `Bearer ${loginToken}`);

        expect(response.status).toBe(400);
    });

    it("Should respond with status 400 on having Invalid 'date' key in eventInfo for event registration. POST /events", async() => {

        const eventInfo = {
            name: "ExFrame overview",
            date: "2025", // invalid iso date string format
            time: "12:45"
        }
        const response = await server
            .post("/events").send(eventInfo)
            .set("Authorization", `Bearer ${loginToken}`);

        expect(response.status).toBe(400);
    });

    it("Should respond with status 400 on having Invalid 'time' key in eventInfo for event registration. POST /events", async() => {

        const eventInfo = {
            name: "ExFrame overview",
            date: "2025",
            time: "24:00" // invalid 24 hr format
        }
        const response = await server
            .post("/events").send(eventInfo)
            .set("Authorization", `Bearer ${loginToken}`);

        expect(response.status).toBe(400);
    });

    it("Should respond with status 200 and have all events for requestee organizer. GET /events", async() => {

        const response = await server
            .get("/events")
            .set("Authorization", `Bearer ${loginToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("events");

        const event = response.body["events"][0];

        registeredEventId = event["eventId"];
    });

    it("Should be able to register for an event POST /events/:eventId/register", async() => {
        const attendeSignupResponse = await server.post("/users/register").send(attendeeSignupCreds);
        expect(attendeSignupResponse.status).toBe(201);
        
        const attendeeLoginResponse = await server.post("/users/login").send(attendeeLoginCreds);
        expect(attendeeLoginResponse.status).toBe(200);
        expect(attendeeLoginResponse.body).toHaveProperty("token");

        attendeeLoginToken = attendeeLoginResponse.body["token"];
        

        // NOTE: this part literally sends mail to registered attendee email.
        const response = await server.post(`/events/${registeredEventId}/register`)
            .set("Authorization", `Bearer ${attendeeLoginToken}`);
    
        expect(response.status).toBe(200);
    }, 30000);
    
    
    it("Should fetch all attendees GET /events/:eventId/attendees", async() => {

        const response = await server.get(`/events/${registeredEventId}/attendees`)
            .set("Authorization", `Bearer ${loginToken}`);
            
            expect(response.status).toBe(200);
    });
        
        
    it("Should update any of these columns name | date | time in already registered event PUT /events/:eventId", async() => {
        const update = {
            "name": "How to use @d3vtool npm packages",// [ optional field ]
            "date": "2025-12-11", // iso format date, [ optional field ]
            "time": "10:00" // [ optional field ]
        }
        
        const response = await server.put(`/events/${registeredEventId}`)
            .send(update)
            .set("Authorization", `Bearer ${loginToken}`);

        expect(response.status).toBe(200);
    });

    it("Should update respond with 400 on with request having no update body. PUT /events/:eventId", async() => {
        
        const response = await server.put(`/events/${registeredEventId}`)
            .set("Authorization", `Bearer ${loginToken}`);

        expect(response.status).toBe(400);
    });

    it("Should delete event by eventId. DELETE /events/:eventId", async() => {
        
        const response = await server.delete(`/events/${registeredEventId}`)
            .set("Authorization", `Bearer ${loginToken}`);

        expect(response.status).toBe(200);
    });

    it("Should respond with 404 status on wrong eventId. DELETE /events/:eventId", async() => {
        const uuid = '8db7b3e9-a4f0-45f6-8272-c6800d8752fa';            
        const response = await server.delete(`/events/${uuid}`)
            .set("Authorization", `Bearer ${loginToken}`);

        expect(response.status).toBe(404);
    });

    it("Should respond with 400 status on invalid format eventId. DELETE /events/:eventId", async() => {    
        const response = await server.delete(`/events/${"anything..."}`)
            .set("Authorization", `Bearer ${loginToken}`);

        expect(response.status).toBe(400);
    });
});
