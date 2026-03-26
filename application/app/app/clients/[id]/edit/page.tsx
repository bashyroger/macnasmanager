import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientForm } from "../../client-form";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("clients").select("full_name").eq("id", id).single();
  return { title: `Edit — ${data?.full_name ?? "Client"}` };
}

export default async function EditClientPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();
  if (!client) notFound();

  return (
    <div>
      <p className="text-sm text-gray-400 mb-4">
        <Link href="/app/clients" className="hover:text-[#be7b3b]">Clients</Link> /{" "}
        <Link href={`/app/clients/${id}`} className="hover:text-[#be7b3b]">{client.full_name}</Link> / Edit
      </p>
      <h1 className="text-2xl font-semibold text-[#1a1714] mb-8">Edit client</h1>
      <ClientForm 
        clientId={id} 
        defaultValues={{
          ...client,
          email: client.email ?? undefined,
          phone: client.phone ?? undefined,
          instagram_handle: client.instagram_handle ?? undefined,
          preferences: client.preferences ?? undefined,
          notes: client.notes ?? undefined,
        }} 
      />
    </div>
  );
}
