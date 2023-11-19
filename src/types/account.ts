export class UserClass {
  usermail!: string;
  username!: string;
  password!: string;
  constructor(username = "", usermail = "", password = "") {
    this.username = username;
    this.usermail = username;
    this.password = password;
  }
}
