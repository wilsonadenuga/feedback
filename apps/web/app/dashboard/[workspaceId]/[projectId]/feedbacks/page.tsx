import { FeedbackList } from "./_components/feedback-list";
import feedbacks from "./feedbacks.json";

export default async function FeedbacksPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  await params;

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <FeedbackList data={feedbacks} />
    </div>
  );
}
