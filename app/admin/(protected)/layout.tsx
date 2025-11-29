import { AdminNav } from "../../../components/AdminNav";
import { requireAdminSession } from "../../../lib/auth";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  requireAdminSession();

  return (
    <div className="container-page space-y-6 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Admin</p>
          <h1 className="text-3xl font-bold text-gray-900">Stop the $3 Minimum</h1>
        </div>
        <AdminNav />
      </div>
      {children}
    </div>
  );
}
