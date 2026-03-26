"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { slugify } from "@/lib/utils";
import { saveProject } from "./actions";

const PROJECT_STATUSES = ["inquiry", "consultation", "design", "production", "completed", "delivered", "archived"] as const;

const schema = z.object({
  client_id: z.string().uuid("Please select a client"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  short_code: z.string().optional(),
  status: z.enum(PROJECT_STATUSES),
  hourly_rate_snapshot: z.coerce.number().positive("Must be a positive number").optional().or(z.literal("")),
  start_date: z.string().optional(),
  target_delivery_date: z.string().optional(),
  overhead_amount: z.coerce.number().min(0).optional().or(z.literal("")),
  private_notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Client = { id: string; full_name: string };

export function ProjectForm({
  clients,
  defaultValues,
  projectId,
  defaultClientId,
}: {
  clients: Client[];
  defaultValues?: Partial<FormValues>;
  projectId?: string;
  defaultClientId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!projectId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "inquiry",
      overhead_amount: 0,
      client_id: defaultClientId ?? "",
      ...defaultValues,
    },
  });

  const titleValue = watch("title");

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const supabase = createClient();
    const payload = {
      client_id: values.client_id,
      title: values.title,
      slug: values.slug,
      short_code: values.short_code || null,
      status: values.status,
      hourly_rate_snapshot: values.hourly_rate_snapshot ? Number(values.hourly_rate_snapshot) : null,
      start_date: values.start_date || null,
      target_delivery_date: values.target_delivery_date || null,
      overhead_amount: Number(values.overhead_amount ?? 0),
      private_notes: values.private_notes || null,
    };

    const result = await saveProject(projectId, payload);

    if (result.error) {
      setError(result.error);
      return;
    }

    const targetId = result.targetId;
    router.push(`/app/projects/${targetId}`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
      <Field label="Client *" error={errors.client_id?.message}>
        <select {...register("client_id")} className={inputClass(!!errors.client_id)}>
          <option value="">Select a client…</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.full_name}</option>
          ))}
        </select>
      </Field>

      <Field label="Project title *" error={errors.title?.message}>
        <input
          {...register("title", {
            onChange: (e) => {
              if (!isEdit) setValue("slug", slugify(e.target.value));
            },
          })}
          className={inputClass(!!errors.title)}
          placeholder="e.g. Weekend Tote — Sarah"
        />
      </Field>

      <Field label="Slug *" error={errors.slug?.message}>
        <input {...register("slug")} className={inputClass(!!errors.slug)} placeholder="weekend-tote-sarah" />
        <p className="text-xs text-gray-400 mt-1">Used in the public showcase URL. Auto-generated from title.</p>
      </Field>

      <Field label="Short code" error={errors.short_code?.message}>
        <input {...register("short_code")} className={inputClass(false)} placeholder="e.g. WTS-001" />
        <p className="text-xs text-gray-400 mt-1">Optional. Used for calendar event matching.</p>
      </Field>

      <Field label="Status *" error={errors.status?.message}>
        <select {...register("status")} className={inputClass(!!errors.status)}>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date">
          <input type="date" {...register("start_date")} className={inputClass(false)} />
        </Field>
        <Field label="Target delivery">
          <input type="date" {...register("target_delivery_date")} className={inputClass(false)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Hourly rate (€)" error={errors.hourly_rate_snapshot?.message}>
          <input type="number" step="0.01" {...register("hourly_rate_snapshot")} className={inputClass(!!errors.hourly_rate_snapshot)} placeholder="0.00" />
        </Field>
        <Field label="Overhead amount (€)" error={errors.overhead_amount?.message}>
          <input type="number" step="0.01" {...register("overhead_amount")} className={inputClass(!!errors.overhead_amount)} placeholder="0.00" />
        </Field>
      </div>

      <Field label="Private notes">
        <textarea {...register("private_notes")} rows={3} className={inputClass(false)} placeholder="Internal notes — never shown publicly" />
      </Field>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] disabled:opacity-60 transition-colors"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium text-gray-600 hover:bg-[#faf9f7] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1714] mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] ${
    hasError ? "border-red-300 bg-red-50" : "border-[#e5e0d8] bg-white hover:border-gray-300"
  }`;
}
