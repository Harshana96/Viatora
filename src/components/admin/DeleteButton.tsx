"use client";

type Props = {
  action: (formData: FormData) => void;
  id: string;
  label: string;
  extraFields?: Record<string, string>;
};

export function DeleteButton({ action, id, label, extraFields }: Props) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(`Delete "${label}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      {extraFields
        ? Object.entries(extraFields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))
        : null}
      <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-500">
        Delete
      </button>
    </form>
  );
}
