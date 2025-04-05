import { makeReadOnly } from "../libs/utils"


export const BACKEND = makeReadOnly({
    PROTOCOL: "http",
    PORT: Number(process.env.PORT) || 3000,
    get DOMAIN() {
        return `localhost:${this.PORT}`
    },
    get URL() {
        return `${this.PROTOCOL}://${this.DOMAIN}`
    },
});

export const MAIL = makeReadOnly({
    user: process.env.EMAIL_ID!,
    pass: process.env.EMAIL_APP_ID!
});