import { MembersTable } from "./_components/members-table";
import { InvitesTable } from "./_components/invites-table";
import { workspaceInviteSchema, workspaceMemberSchema } from "@feedback/schema";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@feedback/ui/components/tabs";

import members from "./members.json";
import invites from "./invites.json";

export default function MembersPage() {
  const membersData = workspaceMemberSchema.array().parse(members);
  const invitesData = workspaceInviteSchema.array().parse(invites);

  return (
    <Tabs defaultValue="members" className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="text-muted-foreground text-sm">
            Manage workspace members and invitations
          </p>
        </div>
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="members">
        <MembersTable data={membersData} />
      </TabsContent>
      <TabsContent value="invites">
        <InvitesTable data={invitesData} />
      </TabsContent>
    </Tabs>
  );
}
