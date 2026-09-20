import { StatCard } from "@/components/admin/StatCard";
import { getDashboardStats } from "@/server/dashboard/actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total packages" value={stats.totalPackages} />
        <StatCard label="Total destinations" value={stats.totalDestinations} />
        <StatCard label="Total places" value={stats.totalPlaces} />
        <StatCard label="Total enquiries" value={stats.totalEnquiries} />
      </div>
    </main>
  );
}
