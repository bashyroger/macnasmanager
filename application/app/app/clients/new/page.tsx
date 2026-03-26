import { ClientForm } from "../client-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New Client" };

export default function NewClientPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#1a1714] mb-8">New client</h1>
      <ClientForm />
    </div>
  );
}
