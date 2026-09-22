import { prisma } from "@/lib/prisma";
import { ENTITIES, type FieldDef } from "@/lib/admin/entities";
import { saveRecord } from "@/lib/actions/crud";
import { BackToEntityList } from "@/components/admin/entity-list";
import { DeleteRecordButton } from "@/components/admin/delete-button";
import { deleteRecord } from "@/lib/actions/crud";
import { AdminCard } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";
import { formatDate } from "@/lib/utils";

/**
 * Renders a structured editor for a single CMS record. Layout and section
 * order are fixed; the admin only controls the content of each field.
 */
export async function EntityEditor({
  entity,
  id,
}: {
  entity: string;
  id: string;
}) {
  const def = ENTITIES[entity];
  if (!def) throw new Error(`Unknown entity: ${entity}`);

  const isNew = id === "new";
  let record: Record<string, unknown> | null = null;

  if (!isNew) {
    const delegate = (prisma as unknown as Record<string, {
      findUnique: (a: unknown) => Promise<Record<string, unknown> | null>;
    }>)[def.model];
    record = await delegate.findUnique({ where: { id } });
    if (!record) throw new Error(`${def.label} not found`);
  }

  const action = saveRecord.bind(null, entity, isNew ? null : id);

  return (
    <div>
      <BackToEntityList entity={entity} />

      <form action={action}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">
              {isNew ? `New ${def.label}` : `Edit ${def.label}`}
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              {isNew
                ? "Fill in the fields below to create this record."
                : "Changes take effect on your website immediately after saving."}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {!isNew ? (
              <DeleteRecordButton
                action={deleteRecord.bind(null, entity, id)}
                label={def.label}
              />
            ) : null}
            <button type="submit" className="btn btn-primary">
              <Icon name="save" size={16} />
              {isNew ? "Create" : "Save Changes"}
            </button>
          </div>
        </div>

        <AdminCard>
          <div className="grid gap-5 sm:grid-cols-2">
            {def.fields.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={record?.[field.name] ?? null}
              />
            ))}
          </div>
        </AdminCard>

        {!isNew && record ? (
          <p className="mt-5 text-xs text-muted">
            Last updated {formatDate(record.updatedAt as Date) || "—"}
          </p>
        ) : null}
      </form>
    </div>
  );
}

function FieldInput({ field, value }: { field: FieldDef; value: unknown }) {
  const baseClass =
    field.type === "checkbox"
      ? "h-5 w-5 rounded border-line text-secondary"
      : field.type === "color"
      ? "h-10 w-full rounded-md border border-line p-1.5"
      : "field-input";

  const stringValue = (() => {
    if (field.type === "list") {
      return Array.isArray(value) ? (value as unknown[]).map(String).join("\n") : "";
    }
    if (field.type === "pipeList") {
      if (!Array.isArray(value)) return "";
      const [a, b] = field.keys || ["a", "b"];
      return (value as Record<string, string>[])
        .map((item) => `${item[a] || ""} | ${item[b] || ""}`)
        .join("\n");
    }
    if (value instanceof Date) {
      return field.type === "date"
        ? value.toISOString().slice(0, 10)
        : formatDate(value);
    }
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "on" : "";
    return String(value);
  })();

  const wrapperClass = field.type === "checkbox" ? "flex items-center gap-3 pt-1" : "";
  const spanClass = field.half && field.type !== "checkbox" ? "sm:col-span-1" : "sm:col-span-2";
  const isWide = !field.half || field.type === "list" || field.type === "pipeList" || field.type === "textarea";

  return (
    <div className={`${wrapperClass} ${isWide ? "sm:col-span-2" : spanClass}`}>
      {field.type !== "checkbox" ? (
        <label htmlFor={`field-${field.name}`} className="field-label">
          {field.label}
          {field.required ? <span className="ml-0.5 text-red-600">*</span> : null}
        </label>
      ) : null}

      {field.type === "textarea" ? (
        <textarea
          id={`field-${field.name}`}
          name={field.name}
          rows={5}
          required={field.required}
          placeholder={field.placeholder}
          defaultValue={stringValue}
          className="field-textarea"
        />
      ) : field.type === "select" ? (
        <select
          id={`field-${field.name}`}
          name={field.name}
          defaultValue={stringValue || ""}
          className="field-select"
        >
          <option value="">— Select —</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === "checkbox" ? (
        <>
          <input
            id={`field-${field.name}`}
            name={field.name}
            type="checkbox"
            defaultChecked={stringValue === "on"}
            className={baseClass}
          />
          <label htmlFor={`field-${field.name}`} className="text-sm font-medium text-ink">
            {field.label}
          </label>
        </>
      ) : (
        <input
          id={`field-${field.name}`}
          name={field.name}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "color" ? "color" : "text"}
          required={field.required}
          placeholder={field.placeholder}
          defaultValue={stringValue}
          className={baseClass}
        />
      )}

      {field.helpText ? (
        <p className="mt-1.5 text-xs text-muted">{field.helpText}</p>
      ) : null}
    </div>
  );
}
