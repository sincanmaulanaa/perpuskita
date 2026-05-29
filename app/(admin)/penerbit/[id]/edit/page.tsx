import type { Metadata } from "next";

import { EditPenerbitClient } from "./edit-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Ubah Penerbit",
};

export default async function EditPenerbitPage({ params }: PageProps) {
  const { id } = await params;
  return <EditPenerbitClient id={id} />;
}
