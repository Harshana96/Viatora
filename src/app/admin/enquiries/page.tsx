import Link from "next/link";

import { listEnquiries } from "@/server/enquiries/actions";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  CONTACTED: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  IN_PROGRESS: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  CANCELLED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

export default async function AdminEnquiriesPage() {
  const enquiries = await listEnquiries();

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Enquiries</h1>
      {enquiries.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No enquiries yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2">Name</th>
              <th className="py-2">Package</th>
              <th className="py-2">Travellers</th>
              <th className="py-2">Status</th>
              <th className="py-2">Received</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2">
                  <p className="font-medium">{enquiry.name}</p>
                  <p className="text-xs text-zinc-500">{enquiry.email}</p>
                </td>
                <td className="py-2">{enquiry.package?.name ?? "General enquiry"}</td>
                <td className="py-2">{enquiry.travellersCount}</td>
                <td className="py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[enquiry.status]}`}>
                    {enquiry.status}
                  </span>
                </td>
                <td className="py-2 text-zinc-500">{enquiry.createdAt.toLocaleDateString()}</td>
                <td className="py-2">
                  <Link
                    href={`/admin/enquiries/${enquiry.id}`}
                    className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
