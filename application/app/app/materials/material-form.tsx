"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const emptyToUndefined = z.literal("").transform(() => undefined);
const optionalNumber = (validator: z.ZodNumber) =>
  z.preprocess((val) => (val === "" ? undefined : val), validator.optional());
const optionalInt = (validator: z.ZodNumber) =>
  z.preprocess((val) => (val === "" ? undefined : val === undefined ? undefined : Number(val)), validator.int().optional());

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit is required"),
  cost_per_unit: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().positive("Must be a positive number")),
  supplier_name: z.string().optional(),
  supplier_url: z.union([z.string().url("Must be a valid URL"), emptyToUndefined]).optional(),
  stock_level: optionalNumber(z.number().min(0)),
  // Story fields
  origin_story: z.string().optional(),
  production_method: z.string().optional(),
  end_of_life: z.string().optional(),
  carbon_footprint: z.string().optional(),
  biodegradability: z.string().optional(),
  compostability: z.string().optional(),
  color_options: z.string().optional(),
  availability_notes: z.string().optional(),
  // Rating fields (1–10)
  strength_rating: optionalInt(z.number().min(1).max(10)),
  durability_rating: optionalInt(z.number().min(1).max(10)),
  bendability_rating: optionalInt(z.number().min(1).max(10)),
});

// z.input = what the form inputs hold (strings from HTML)
// z.output = what zod returns after preprocess transforms (numbers)
type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export function MaterialForm({
  defaultValues,
  materialId,
}: {
  defaultValues?: Partial<FormInput>;
  materialId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!materialId;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  });

  const onSubmit = async (values: FormOutput) => {
    setError(null);
    const supabase = createClient();
    const payload = {
      name: values.name,
      unit: values.unit,
      cost_per_unit: values.cost_per_unit as number,
      supplier_name: values.supplier_name || null,
      supplier_url: values.supplier_url || null,
      stock_level: values.stock_level ?? null,
      origin_story: values.origin_story || null,
      production_method: values.production_method || null,
      end_of_life: values.end_of_life || null,
      carbon_footprint: values.carbon_footprint || null,
      biodegradability: values.biodegradability || null,
      compostability: values.compostability || null,
      color_options: values.color_options || null,
      availability_notes: values.availability_notes || null,
      strength_rating: values.strength_rating ?? null,
      durability_rating: values.durability_rating ?? null,
      bendability_rating: values.bendability_rating ?? null,
    };

    let result;
    if (isEdit) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = await supabase.from("materials").update(payload as any).eq("id", materialId);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = await supabase.from("materials").insert(payload as any);
    }

    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.push("/app/materials");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      {/* Core */}
      <section>
        <h2 className="text-sm font-semibold text-[#1a1714] mb-4 uppercase tracking-wide">Core details</h2>
        <div className="space-y-4">
          <Field label="Name *" error={errors.name?.message}>
            <input {...register("name")} className={inputClass(!!errors.name)} placeholder="e.g. Vegetable-tanned leather" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Unit *" error={errors.unit?.message}>
              <input {...register("unit")} className={inputClass(!!errors.unit)} placeholder="e.g. dm², meter, piece" />
            </Field>
            <Field label="Cost per unit (€) *" error={errors.cost_per_unit?.message}>
              <input type="number" step="0.0001" {...register("cost_per_unit")} className={inputClass(!!errors.cost_per_unit)} placeholder="0.0000" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Supplier name" error={errors.supplier_name?.message}>
              <input {...register("supplier_name")} className={inputClass(false)} placeholder="e.g. Horween Leather Co." />
            </Field>
            <Field label="Stock level" error={errors.stock_level?.message}>
              <input type="number" step="0.0001" {...register("stock_level")} className={inputClass(!!errors.stock_level)} placeholder="0" />
            </Field>
          </div>

          <Field label="Supplier URL" error={errors.supplier_url?.message}>
            <input {...register("supplier_url")} className={inputClass(!!errors.supplier_url)} placeholder="https://..." />
          </Field>
        </div>
      </section>

      <div className="border-t border-[#e5e0d8]" />

      {/* Story */}
      <section>
        <h2 className="text-sm font-semibold text-[#1a1714] mb-4 uppercase tracking-wide">Sustainability story</h2>
        <div className="space-y-4">
          <Field label="Origin story">
            <textarea {...register("origin_story")} rows={2} className={inputClass(false)} placeholder="Where this material comes from…" />
          </Field>
          <Field label="Production method">
            <textarea {...register("production_method")} rows={2} className={inputClass(false)} placeholder="How it is made…" />
          </Field>
          <Field label="End of life">
            <textarea {...register("end_of_life")} rows={2} className={inputClass(false)} placeholder="Biodegradable? Recyclable? Landfill?" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Carbon footprint">
              <input {...register("carbon_footprint")} className={inputClass(false)} placeholder="e.g. Low, Medium, High" />
            </Field>
            <Field label="Biodegradability">
              <input {...register("biodegradability")} className={inputClass(false)} placeholder="e.g. Fully biodegradable" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Compostability">
              <input {...register("compostability")} className={inputClass(false)} placeholder="e.g. Home compostable" />
            </Field>
            <Field label="Color options">
              <input {...register("color_options")} className={inputClass(false)} placeholder="e.g. Natural, Black, Tan" />
            </Field>
          </div>
          <Field label="Availability notes">
            <input {...register("availability_notes")} className={inputClass(false)} placeholder="e.g. Lead time 3–4 weeks" />
          </Field>
        </div>
      </section>

      <div className="border-t border-[#e5e0d8]" />

      {/* Ratings */}
      <section>
        <h2 className="text-sm font-semibold text-[#1a1714] mb-1 uppercase tracking-wide">Ratings</h2>
        <p className="text-xs text-gray-400 mb-4">Scale 1–10. Leave blank if not applicable.</p>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Strength" error={errors.strength_rating?.message}>
            <input type="number" min={1} max={10} {...register("strength_rating")} className={inputClass(!!errors.strength_rating)} placeholder="1–10" />
          </Field>
          <Field label="Durability" error={errors.durability_rating?.message}>
            <input type="number" min={1} max={10} {...register("durability_rating")} className={inputClass(!!errors.durability_rating)} placeholder="1–10" />
          </Field>
          <Field label="Bendability" error={errors.bendability_rating?.message}>
            <input type="number" min={1} max={10} {...register("bendability_rating")} className={inputClass(!!errors.bendability_rating)} placeholder="1–10" />
          </Field>
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-[#be7b3b] text-white text-sm font-medium hover:bg-[#a86330] disabled:opacity-60 transition-colors"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add material"}
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
