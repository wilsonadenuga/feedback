import { MembersTable } from "./_components/members-table";
import { InvitesTable } from "./_components/invites-table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@feedback/ui/components/tabs";

import members from "./members.json";
import invites from "./invites.json";

export default function MembersPage() {
  return (
    <Tabs defaultValue="members" className="w-full">
      <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
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
        <MembersTable data={members} />
      </TabsContent>
      <TabsContent value="invites">
        <InvitesTable data={invites} />
      </TabsContent>
    </Tabs>
  );
}
