import type { Metadata } from "next";

import { EditPeminjamanClient } from "./edit-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Ubah Peminjaman · Perpuskita",
};

export default async function EditPeminjamanPage({ params }: PageProps) {
  const { id } = await params;
  return <EditPeminjamanClient id={id} />;
}
