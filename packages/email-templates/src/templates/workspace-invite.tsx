import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import config from '../tailwind.config';

interface WorkspaceInviteProps {
  workspaceName?: string;
  inviterName?: string;
  inviteUrl?: string;
}

export const WorkspaceInvite = ({
  workspaceName,
  inviterName,
  inviteUrl,
}: WorkspaceInviteProps) => (
  <Html>
    <Head />
    <Tailwind config={config}>
      <Body className="bg-white font-slack mx-auto my-0">
        <Preview>
          {inviterName || 'Someone'} invited you to join {workspaceName || 'the workspace'}
        </Preview>
        <Container className="mx-auto my-0 py-0 px-5">
          <Section className="mt-8">
            <Img
              src="https://react-email-demo-fxebcpctn-resend.vercel.app/static/slack-logo.png"
              width="120"
              height="36"
              alt="Feedback"
            />
          </Section>
          <Heading className="text-[#1d1c1d] text-4xl font-bold my-[30px] mx-0 p-0 leading-[42px]">
            Join {workspaceName || 'the workspace'}
          </Heading>
          <Text className="text-xl mb-7.5">
            <strong>{inviterName || 'Someone'}</strong> has invited you to join{' '}
            <strong>{workspaceName || 'the workspace'}</strong> workspace.
          </Text>

          <Text className="text-base leading-6 text-black">
            Click the button below to accept the invitation and join the
            workspace.
          </Text>

          <Section className="text-center my-8">
            <Button
              href={inviteUrl}
              className="bg-[#2eb67d] rounded text-white text-base font-semibold no-underline text-center px-5 py-3 inline-block"
            >
              Accept Invitation
            </Button>
          </Section>

          <Text className="text-black text-sm leading-6">
            Or copy and paste this link into your browser:
          </Text>
          <Link href={inviteUrl} className="text-blue-600 underline text-sm">
            {inviteUrl}
          </Link>

          <Text className="text-black text-sm leading-6 mt-8">
            If you didn't expect this invitation, you can safely ignore this
            email. If you have any questions, please contact the person who
            invited you.
          </Text>

          <Section className="mt-8">
            <Link
              className="text-[#b7b7b7] underline"
              href="https://slackhq.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Our blog
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-[#b7b7b7] underline"
              href="https://slack.com/legal"
              target="_blank"
              rel="noopener noreferrer"
            >
              Policies
            </Link>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-[#b7b7b7] underline"
              href="https://slack.com/help"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help center
            </Link>
            <Text className="text-xs leading-[15px] text-left mb-[50px] text-[#b7b7b7] mt-4">
              ©2024 Feedback App. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

WorkspaceInvite.PreviewProps = {
  workspaceName: 'Acme Inc',
  inviterName: 'John Doe',
  inviteUrl: 'https://app.example.com/invites/123/accept?token=abc123',
} as WorkspaceInviteProps;

export default WorkspaceInvite;
