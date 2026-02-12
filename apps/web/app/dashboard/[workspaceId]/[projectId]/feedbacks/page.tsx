import { FeedbackList } from "./_components/feedback-list";
import feedbacks from "./feedbacks.json";

export default async function FeedbacksPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  await params;

  return <FeedbackList data={feedbacks} />;
}
