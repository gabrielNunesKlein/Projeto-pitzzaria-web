export class AuthTokenErrors extends Error {
    constructor(){
        super("Error with authorization token.")
    }
}