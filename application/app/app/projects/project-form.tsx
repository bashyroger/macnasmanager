"use client";

import { useForm, SubmitHandler } from "react-hook-form";
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
  public_title: z.string().optional(),
  public_description: z.string().optional(),
  hero_image_path: z.string().optional(),
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
    // @ts-ignore
    resolver: zodResolver(schema),
    defaultValues: {
      status: "inquiry",
      overhead_amount: 0,
      client_id: defaultClientId ?? "",
      ...defaultValues,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setError(null);
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
      public_title: values.public_title || null,
      public_description: values.public_description || null,
      hero_image_path: values.hero_image_path || null,
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
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5 max-w-xl">
      <Field id="client_id" label="Client *" error={errors.client_id?.message}>
        <select 
          id="client_id" 
          {...register("client_id")} 
          className={inputClass(!!errors.client_id)}
          aria-invalid={!!errors.client_id}
          aria-required="true"
        >
          <option value="">Select a client…</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.full_name}</option>
          ))}
        </select>
      </Field>

      <Field id="title" label="Project title *" error={errors.title?.message}>
        <input
          id="title"
          {...register("title", {
            onChange: (e) => {
              if (!isEdit) setValue("slug", slugify(e.target.value));
            },
          })}
          className={inputClass(!!errors.title)}
          placeholder="e.g. Weekend Tote — Sarah"
          aria-invalid={!!errors.title}
          aria-required="true"
        />
      </Field>

      <Field id="slug" label="Slug *" error={errors.slug?.message}>
        <input 
          id="slug" 
          {...register("slug")} 
          className={inputClass(!!errors.slug)} 
          placeholder="weekend-tote-sarah" 
          aria-invalid={!!errors.slug}
          aria-required="true"
        />
        <p id="slug-hint" className="text-xs text-gray-400 mt-1">Used in the public showcase URL. Auto-generated from title.</p>
      </Field>

      <Field id="short_code" label="Short code" error={errors.short_code?.message}>
        <input 
          id="short_code" 
          {...register("short_code")} 
          className={inputClass(false)} 
          placeholder="e.g. WTS-001" 
          aria-invalid={!!errors.short_code}
        />
        <p className="text-xs text-gray-400 mt-1">Optional. Used for calendar event matching.</p>
      </Field>

      <Field id="status" label="Status *" error={errors.status?.message}>
        <select 
          id="status" 
          {...register("status")} 
          className={inputClass(!!errors.status)}
          aria-invalid={!!errors.status}
          aria-required="true"
        >
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="start_date" label="Start date">
          <input id="start_date" type="date" {...register("start_date")} className={inputClass(false)} />
        </Field>
        <Field id="target_delivery_date" label="Target delivery">
          <input id="target_delivery_date" type="date" {...register("target_delivery_date")} className={inputClass(false)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field id="hourly_rate" label="Hourly rate (€)" error={errors.hourly_rate_snapshot?.message}>
          <input id="hourly_rate" type="number" step="0.01" {...register("hourly_rate_snapshot")} className={inputClass(!!errors.hourly_rate_snapshot)} placeholder="0.00" aria-invalid={!!errors.hourly_rate_snapshot} />
        </Field>
        <Field id="overhead_amount" label="Overhead amount (€)" error={errors.overhead_amount?.message}>
          <input id="overhead_amount" type="number" step="0.01" {...register("overhead_amount")} className={inputClass(!!errors.overhead_amount)} placeholder="0.00" aria-invalid={!!errors.overhead_amount} />
        </Field>
      </div>

      <Field id="private_notes" label="Private notes">
        <textarea id="private_notes" {...register("private_notes")} rows={3} className={inputClass(false)} placeholder="Internal notes — never shown publicly" />
      </Field>

      <div className="pt-4 border-t border-[#e5e0d8] mt-6 mb-2" role="group" aria-labelledby="showcase-heading">
        <h3 id="showcase-heading" className="text-sm font-semibold text-[#1a1714] mb-4">Public showcase data</h3>
        <div className="space-y-5">
          <Field id="public_title" label="Public title" error={errors.public_title?.message}>
            <input id="public_title" {...register("public_title")} className={inputClass(false)} placeholder="e.g. Weekend Tote (if different from internal)" />
          </Field>

          <Field id="public_description" label="Public description" error={errors.public_description?.message}>
            <textarea id="public_description" {...register("public_description")} rows={3} className={inputClass(false)} placeholder="Story of this project..." />
          </Field>

          <Field id="hero_image_path" label="Hero image path" error={errors.hero_image_path?.message}>
            <input id="hero_image_path" {...register("hero_image_path")} className={inputClass(false)} placeholder="/images/projects/tote.jpg" />
            <p className="text-xs text-gray-400 mt-1">Temporary text field for MVP image binding.</p>
          </Field>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] disabled:opacity-60 transition-colors focus:ring-2 focus:ring-[#be7b3b] focus:ring-offset-2"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-[#e5e0d8] text-sm font-medium text-gray-600 hover:bg-[#faf9f7] transition-colors focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#1a1714] mb-1.5">{label}</label>
      <div className="relative">
        {children}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[#be7b3b]/20 focus:border-[#be7b3b] ${
    hasError ? "border-red-300 bg-red-50" : "border-[#e5e0d8] bg-white hover:border-gray-300"
  }`;
}
