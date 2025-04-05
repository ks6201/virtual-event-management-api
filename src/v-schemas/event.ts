import { isUUID } from "../libs/types";
import { Validator, type VInfer } from "@d3vtool/utils";


export const vEventSchema = {
    eventId: Validator.string().custom(isUUID, "Event id must be in valid UUID format"),
    name: Validator.string().minLength(5),
    date: Validator.string().regex(
        /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, 
        "Date should be in format yyyy-mm-dd."
    ),
    description: Validator.string().minLength(5),
    time: Validator.string().regex(
        /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/,
        "Time should in 24-hour format hh:mm."
    )
}

export const Event = Validator.object(vEventSchema);
export type Event = VInfer<typeof Event>;

export const vEventId = Validator.object({
    eventId: vEventSchema.eventId
});
export type EventId = VInfer<typeof vEventId>;

export const vCreateEventSchema = Validator.object({
    name: vEventSchema.name,
    date: vEventSchema.date,
    time: vEventSchema.time,
    description: vEventSchema.description
});

export type CreateEvent = VInfer<typeof vCreateEventSchema>;

export const vUpdateEventSchema = Validator.object({
    name: Validator.string().minLength(5).optional(),
    date: Validator.string().regex(
        /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, 
        "Date should be in format yyyy-mm-dd."
    ).optional(),
    description: Validator.string().minLength(5).optional(),
    time: Validator.string().regex(
        /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/,
        "Time should in 24-hour format hh:mm."
    ).optional()
});

export type UpdateEvent = VInfer<typeof vUpdateEventSchema>;