"use client";

type Props = {
  action: (formData: FormData) => void;
  id: string;
  label: string;
};

export function DeleteButton({ action, id, label }: Props) {
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
      <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-500">
        Delete
      </button>
    </form>
  );
}
