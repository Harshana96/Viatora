import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createReview, listApprovedReviews } from "@/server/reviews/actions";

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} className="text-amber-500">
      {"★".repeat(rating)}
      <span className="text-zinc-300 dark:text-zinc-700">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export async function ReviewsSection({
  packageId,
  packageSlug,
  justSubmitted,
}: {
  packageId: string;
  packageSlug: string;
  justSubmitted?: boolean;
}) {
  const reviews = await listApprovedReviews(packageId);
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null;

  return (
    <section className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <div className="mb-6 flex items-baseline gap-3">
        <h2 className="text-2xl font-semibold">Traveller Reviews</h2>
        {averageRating ? (
          <p className="text-sm text-zinc-500">
            <Stars rating={Math.round(averageRating)} /> {averageRating.toFixed(1)} ({reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"})
          </p>
        ) : null}
      </div>

      {reviews.length > 0 ? (
        <ul className="mb-8 flex flex-col gap-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <p className="font-medium">{review.name}</p>
                <Stars rating={review.rating} />
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{review.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-8 text-sm text-zinc-500">No reviews yet — be the first to share your experience.</p>
      )}

      {justSubmitted ? (
        <p className="mb-4 rounded-md border border-zinc-200 p-3 text-sm dark:border-zinc-800">
          Thanks for your review! It&apos;ll appear here once our team approves it.
        </p>
      ) : null}

      <div className="max-w-lg">
        <h3 className="mb-3 text-lg font-semibold">Write a Review</h3>
        <form action={createReview} className="flex flex-col gap-4">
          <input type="hidden" name="packageId" value={packageId} />
          <input type="hidden" name="packageSlug" value={packageSlug} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
          </div>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Select id="rating" name="rating" defaultValue="5" required>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} star{value === 1 ? "" : "s"}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="comment">Your review</Label>
            <Textarea id="comment" name="comment" rows={3} required />
          </div>
          <Button type="submit" variant="secondary" className="self-start">
            Submit Review
          </Button>
        </form>
      </div>
    </section>
  );
}
