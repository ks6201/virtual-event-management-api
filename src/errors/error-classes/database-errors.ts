
export type ErrorType = "log" | "respond";

/**
 * Creates an instance of DatabaseError.
 * 
 * @param {string} message - The error message describing the database issue.
 * @param {string} type - The specific type of database error either "query" | "transaction".
 */
export class DatabaseError extends Error {
    type;
    constructor(
        message: string,
        type: ErrorType
    ) {
        super(`${message}`);
        this.type = type;
        this.name = "DatabaseError";
    }
}

/**
 * Creates an instance of the DuplicateError class.
 * 
 * @param {string} col - The column name where the duplicate error occurred.
 * @param {any} value - The value that caused the duplicate error in the specified column.
 */
export class DuplicateError extends Error {
    col;
    value;
    constructor(
        col: string,
        value: string
    ) {
        super();
        this.col = col;
        this.value = value;
        this.name = "DuplicateError";
    }
}
