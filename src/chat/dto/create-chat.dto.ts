import { Chat, User } from '@prisma/client'

export type CreateChatDto = {
    participants: User[]
}