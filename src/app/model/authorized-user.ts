/**
 * Created by daved_000 on 7/2/2017.
 */

export class AuthorizedUser {
    user_id: string;
    username: string;
    token: string;

    constructor() {
        this.user_id = '';
        this.username = '';
        this.token = '';
    }
}