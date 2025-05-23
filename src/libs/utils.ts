import type { NextFunction } from "express";
import type { Request, RequestHandler, Response } from "express";


export type Brand<T, F> = T & {__brand: F};
export type OptionalKey<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * A utility function that wraps an asynchronous controller function, ensuring 
 * proper error handling when the controller returns a promise. This function 
 * allows errors thrown inside the controller to be passed to Express's global 
 * error handler, which would otherwise not catch them, if express version is 
 * below 5.
 *
 * @param fn - The controller function that returns a promise.
 */
export const asyncHandler = (fn: RequestHandler) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        next(err);
    });
}

/**
 * Checks if the application is running in development mode.
 */
export function isInDevelopmentMode() {
    return process.env.NODE_ENV === "development";
}

export const asyncSleep = (ms: number) => 
    new Promise(resolve => setTimeout(resolve, ms));


/**
 * Freezes an object to make it immutable, preventing modification of its properties.
 * 
 * @param obj - The object to be made read-only.
 * @returns The frozen (read-only) object.
 */
export function makeReadOnly<T>(obj: T): Readonly<T> {
    return Object.freeze(obj);    
}
