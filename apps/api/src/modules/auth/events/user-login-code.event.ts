export class UserLoginCodeEvent {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}
