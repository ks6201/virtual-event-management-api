import type { Request, Response } from "express";
import { validate } from "../../middlewares/validate";
import { loginError, signupError } from "./error-handlers";
import { EventService } from "../../services/event-service";
import { HttpSuccess } from "../../libs/http-response-code";
import { IdentityService } from "../../services/identity-service";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { verifyRole, type Claim } from "../../middlewares/verify-role";
import { ErrorHandler, Get, Middlewares, ParentRoute, Post } from "@d3vtool/ex-frame";
import { defaultServerError } from "../../errors/error-handlers/default-server-error";
import { vCreateUserSchema, type CreateUser, vLoginUserSchema, type LoginUser } from "../../v-schemas/user";
import type { TUserRoles } from "../../db/schema";

@ParentRoute("/users")
@ErrorHandler(defaultServerError)
export class UsersController {
    
    /**
     * Handles user signup requests
     * 
     * @param req The request object
     * @param res The response object
     */
    @Post("/register")
    @Middlewares(
        validate(vCreateUserSchema, "body")
    )
    @ErrorHandler(signupError)
    static async register(
        req: Request, 
        res: Response
    ) {

        const userInfo = req.body as CreateUser;
        
        await IdentityService.create(userInfo);
        
        res.status(HttpSuccess.Created.statusCode).send({
            status: "success"
        });
    }


    /**
     * Handles user login requests
     * 
     * @param req The request object
     * @param res The response object
     */
    @Post("/login")
    @Middlewares(
        validate(vLoginUserSchema, "body")
    )
    @ErrorHandler(loginError)
    static async login(
        req: Request,
        res: Response
    ) {
        const loginCreds = req.body as LoginUser;

        const userInfo = await IdentityService.authenticateUser(
            loginCreds,
            loginCreds.role as TUserRoles["role"]
        );

        const jwt = await IdentityService.generateJwtFor(
            req.host,
            loginCreds.email,
            userInfo
        );

        res.send({
            status: "success",
            token: jwt
        });
    }

    @Get("/attendee/events")
    @Middlewares(
        authMiddleware,
        verifyRole("attendee")
    )
    static async getEventsForAttendee(
        req: Request,
        res: Response
    ) {
        
        const claims = (req as any).claims as Claim;
        
        
        const events = await EventService.getAllEventByAttendeeId(
            claims.userId
        );

        res.json({
            status: "success",
            events
        });
    }
}
