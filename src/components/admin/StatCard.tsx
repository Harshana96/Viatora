type Props = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: Props) {
  return (
    <div className="rounded-lg border border-stone-200 p-6 dark:border-stone-800">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
