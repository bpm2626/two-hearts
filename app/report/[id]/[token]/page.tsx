import ReportView from "./ReportView";

export const dynamic = "force-dynamic";

export default function ReportPage({ params }: { params: { id: string; token: string } }) {
  return <ReportView sessionId={params.id} token={params.token} />;
}
