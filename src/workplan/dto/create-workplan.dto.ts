import { WorkPlan } from "@prisma/client"

export type CreateWorkplanDto = Omit<WorkPlan, "id">;
