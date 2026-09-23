import { notFound } from "next/navigation";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { listGroupSizeRanges } from "@/server/group-size-ranges/actions";
import { createPricingRule, deletePricingRule, listPricingRules } from "@/server/pricing/actions";
import { listSeasons } from "@/server/seasons/actions";
import { getPackage } from "@/server/tours/actions";

export const dynamic = "force-dynamic";

export default async function PricingRulesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tourPackage, rules, groupSizeRanges, seasons] = await Promise.all([
    getPackage(id),
    listPricingRules(id),
    listGroupSizeRanges(),
    listSeasons(),
  ]);

  if (!tourPackage) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold">Pricing — {tourPackage.name}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Set the estimated price per person for each group size × season combination. Travellers only ever see
        the single resulting total, never these individual line items.
      </p>

      {groupSizeRanges.length === 0 || seasons.length === 0 ? (
        <p className="mt-6 text-sm text-amber-600">
          Add at least one group size range and season before configuring pricing.
        </p>
      ) : (
        <form action={createPricingRule} className="mt-6 flex flex-wrap items-end gap-4">
          <input type="hidden" name="packageId" value={id} />
          <div>
            <Label htmlFor="groupSizeRangeId">Group size</Label>
            <Select id="groupSizeRangeId" name="groupSizeRangeId" required>
              {groupSizeRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="seasonId">Season</Label>
            <Select id="seasonId" name="seasonId" required>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="pricePerPerson">Price per person (USD)</Label>
            <Input id="pricePerPerson" name="pricePerPerson" type="number" min={0} step="1" required />
          </div>
          <Button type="submit">Save price</Button>
        </form>
      )}

      {rules.length === 0 ? (
        <p className="mt-8 text-zinc-600 dark:text-zinc-400">No pricing rules yet.</p>
      ) : (
        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2">Season</th>
              <th className="py-2">Group size</th>
              <th className="py-2">Price / person</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2">{rule.season.name}</td>
                <td className="py-2">{rule.groupSizeRange.label}</td>
                <td className="py-2 text-zinc-500">{formatCurrency(Number(rule.pricePerPerson))}</td>
                <td className="py-2 text-right">
                  <DeleteButton action={deletePricingRule} id={rule.id} label="this price" extraFields={{ packageId: id }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
