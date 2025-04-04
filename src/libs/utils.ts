import bcrypt from "bcrypt";
import { promisify } from "node:util";
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
 * @param {RequestHandler} fn - The controller function that returns a promise.
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
 * Hashes a given string or buffer using bcrypt algorithm.
 * 
 * @param {string | Buffer<ArrayBufferLike>} arg1 - The string or buffer to be hashed.
 * @param {string | number} arg2 - The salt rounds or salt string to be used in hashing.
 * @returns {Promise<string>} A promise that resolves to the hashed string.
 */
export const bcryptHash = promisify(bcrypt.hash);

/**
 * Compares a given string or buffer with a hashed string to check if they match.
 * 
 * @param {string | Buffer<ArrayBufferLike>} arg1 - The string or buffer to compare.
 * @param {string} arg2 - The hashed string to compare against.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the input matches the hash.
 */
export const bcryptCompare = promisify(bcrypt.compare);

/**
 * Checks if the application is running in development mode.
 * 
 * @returns {boolean} `true` if the application is in development mode, `false` otherwise.
 */
export function isInDevelopmentMode() {
    return process.env.NODE_ENV === "development";
}

export const asyncSleep = (ms: number) => 
    new Promise(resolve => setTimeout(resolve, ms));


/**
 * Freezes an object to make it immutable, preventing modification of its properties.
 * 
 * @param {Object} obj - The object to be made read-only.
 * @returns {Object} The frozen (read-only) object.
 */
export function makeReadOnly<T>(obj: T): Readonly<T> {
    return Object.freeze(obj);    
}
