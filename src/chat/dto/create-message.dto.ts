import { Chat, Message, User } from '@prisma/client'

export type CreateMessagetDto = Omit<Message, "id" | "createdAt">;