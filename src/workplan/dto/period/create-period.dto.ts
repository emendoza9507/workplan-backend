import { Period } from "@prisma/client"

export type CreatePeriodDto = Omit<Period, "id">
