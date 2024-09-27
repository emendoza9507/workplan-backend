import { Activity } from "@prisma/client";

export type CreateActivityDto = Omit<Activity, "id">;