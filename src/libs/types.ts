import type { Brand } from "./utils";

export type UUID = Brand<string, "UUID">;

/**
 * Checks if the 'value' is valid uuid string'.
 *
 * @param value 
 */
export function isUUID(value: unknown): value is UUID {
    try {
        return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value as string);
    } catch {
        return false;
    }
}
