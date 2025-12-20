import {
  Body,
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

interface LoginCodeProps {
  code?: string;
}

export const LoginCode = ({ code }: LoginCodeProps) => (
  <Html>
    <Head />
    <Tailwind config={config}>
      <Body className="bg-white font-slack mx-auto my-0">
        <Preview>Your login code</Preview>
        <Container className="mx-auto my-0 py-0 px-5">
          <Section className="mt-8">
            <Img
              src="https://react-email-demo-fxebcpctn-resend.vercel.app/static/slack-logo.png"
              width="120"
              height="36"
              alt="Slack"
            />
          </Section>
          <Heading className="text-[#1d1c1d] text-4xl font-bold my-[30px] mx-0 p-0 leading-[42px]">
            Your login code
          </Heading>
          <Text className="text-xl mb-7.5">
            Your login code is below - enter it in your open browser window to
            sign in.
          </Text>

          <Section className="bg-[rgb(245,244,245)] rounded mb-[30px] py-10 px-[10px]">
            <Text className="text-3xl leading-[24px] text-center align-middle">
              {code}
            </Text>
          </Section>

          <Text className="text-black text-sm leading-6">
            If you didn't request this email, there's nothing to worry about,
            you can safely ignore it.
          </Text>

          <Section>
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
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <Link
              className="text-[#b7b7b7] underline"
              href="https://slack.com/community"
              target="_blank"
              rel="noopener noreferrer"
              data-auth="NotApplicable"
              data-linkindex="6"
            >
              Slack Community
            </Link>
            <Text className="text-xs leading-[15px] text-left mb-[50px] text-[#b7b7b7]">
              ©2022 Slack Technologies, LLC, a Salesforce company. <br />
              500 Howard Street, San Francisco, CA 94105, USA <br />
              <br />
              All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

LoginCode.PreviewProps = {
  code: '123456',
} as LoginCodeProps;

export default LoginCode;
