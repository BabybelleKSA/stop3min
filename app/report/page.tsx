import { ReportForm } from "../../components/ReportForm";

export default function ReportPage() {
  return (
    <div className="container-page py-12">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold text-primary">Report a store</p>
        <h1 className="text-3xl font-bold text-gray-900">Debit minimum spotted? Tell us.</h1>
        <p className="text-gray-700">
          Debit minimums are banned by card networks. Share what you saw and we&apos;ll add it to the public record.
        </p>
      </div>
      <ReportForm />
    </div>
  );
}
