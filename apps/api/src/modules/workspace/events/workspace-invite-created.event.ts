export class WorkspaceInviteCreatedEvent {
  constructor(
    public readonly email: string,
    public readonly workspaceName: string,
    public readonly inviterName: string,
    public readonly token: string,
    public readonly inviteId: string,
  ) {}
}
