import type { Metadata } from "next";

import { EditPenulisClient } from "./edit-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Ubah Penulis",
};

export default async function EditPenulisPage({ params }: PageProps) {
  const { id } = await params;
  return <EditPenulisClient id={id} />;
}
