import { createSupportClient } from "@entrext/support-client";

export const supportClient = createSupportClient({
    endpoint: "/api/support",
    anonKey: process.env.NEXT_PUBLIC_ANON_KEY || "client-side-placeholder"
});
