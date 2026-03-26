"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { slugify } from "@/lib/utils";

const schema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  phone: z.string().optional(),
  instagram_handle: z.string().optional(),
  preferences: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ClientForm({
  defaultValues,
  clientId,
}: {
  defaultValues?: Partial<FormValues>;
  clientId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!clientId;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const supabase = createClient();
    const payload = {
      full_name: values.full_name,
      email: values.email || null,
      phone: values.phone || null,
      instagram_handle: values.instagram_handle || null,
      preferences: values.preferences || null,
      notes: values.notes || null,
    };

    let result;
    if (isEdit) {
      result = await supabase.from("clients").update(payload).eq("id", clientId);
    } else {
      result = await supabase.from("clients").insert(payload).select("id").single();
    }

    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.push(isEdit ? `/app/clients/${clientId}` : `/app/clients/${(result.data as { id: string }).id}`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
      <Field label="Full name *" error={errors.full_name?.message}>
        <input
          {...register("full_name")}
          className={inputClass(!!errors.full_name)}
          placeholder="e.g. Jane Smith"
        />
      </Field>

      <Field label="Email" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          className={inputClass(!!errors.email)}
          placeholder="jane@example.com"
        />
      </Field>

      <Field label="Phone">
        <input {...register("phone")} className={inputClass(false)} placeholder="+353 87 000 0000" />
      </Field>

      <Field label="Instagram handle">
        <input {...register("instagram_handle")} className={inputClass(false)} placeholder="@handle" />
      </Field>

      <Field label="Preferences / style notes">
        <textarea {...register("preferences")} rows={3} className={inputClass(false)} placeholder="e.g. prefers earthy tones, no metal hardware" />
      </Field>

      <Field label="Internal notes">
        <textarea {...register("notes")} rows={3} className={inputClass(false)} placeholder="Private notes about this client" />
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
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create client"}
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
