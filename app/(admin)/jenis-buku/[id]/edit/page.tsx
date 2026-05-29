import type { Metadata } from "next";

import { EditJenisBukuClient } from "./edit-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Ubah Jenis Buku",
};

export default async function EditJenisBukuPage({ params }: PageProps) {
  const { id } = await params;
  return <EditJenisBukuClient id={id} />;
}
