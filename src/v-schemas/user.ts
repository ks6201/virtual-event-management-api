import { isUUID } from "../libs/types";
import { Validator, type VInfer } from "@d3vtool/utils";

export const acceptedRoles = [
    "attendee", 
    "organizer"
] as const;

const userSchema = {
    userId: Validator.string().custom(isUUID, "User id must be in UUID format."),
    name: Validator.string().minLength(3),
    email: Validator.string().email(),
    password: Validator.string().password(),
    role: Validator.string().oneOf(acceptedRoles as any)
}

const vUser = Validator.object(userSchema);

export type User = VInfer<typeof vUser>;


export const vCreateUserSchema = Validator.object({
    name: userSchema.name,
    email: userSchema.email,
    password: userSchema.password,
    role: userSchema.role
});

export type CreateUser = VInfer<typeof vCreateUserSchema>;

export const vLoginUserSchema = Validator.object({
    email: userSchema.email,
    password: userSchema.password,
    role: userSchema.role
});

export type LoginUser = VInfer<typeof vLoginUserSchema>;

