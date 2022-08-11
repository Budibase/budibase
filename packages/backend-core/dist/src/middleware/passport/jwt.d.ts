export namespace options {
    const secretOrKey: string | undefined;
    function jwtFromRequest(ctx: any): any;
}
export function authenticate(jwt: any, done: any): Promise<any>;
