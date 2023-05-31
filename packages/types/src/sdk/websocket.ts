export interface SocketUser {
    _id: string,
    email: string,
    firstName?: string,
    lastName?: string,
    appId: string,
    sessionId: string,
    room?: string
}