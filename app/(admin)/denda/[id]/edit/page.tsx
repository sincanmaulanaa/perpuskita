import type { Metadata } from "next";

import { EditDendaClient } from "./edit-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Ubah Denda · Perpuskita",
};

export default async function EditDendaPage({ params }: PageProps) {
  const { id } = await params;
  return <EditDendaClient id={id} />;
}
