import { DeleteButton } from "@/components/admin/DeleteButton";
import { approveReview, deleteReview, listPendingReviews } from "@/server/reviews/actions";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const pendingReviews = await listPendingReviews();

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold">Pending Reviews</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Reviews only appear on a package page once approved here.
      </p>

      {pendingReviews.length === 0 ? (
        <p className="mt-8 text-zinc-600 dark:text-zinc-400">No pending reviews.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {pendingReviews.map((review) => (
            <li key={review.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {review.name} <span className="font-normal text-zinc-500">({review.email})</span>
                  </p>
                  <p className="text-sm text-zinc-500">
                    {review.package.name} · {review.rating} / 5
                  </p>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <form action={approveReview}>
                    <input type="hidden" name="id" value={review.id} />
                    <button type="submit" className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50">
                      Approve
                    </button>
                  </form>
                  <DeleteButton action={deleteReview} id={review.id} label="this review" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
