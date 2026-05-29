import type { Metadata } from "next";

import { PeminjamanDetailView } from "@/features/peminjaman/peminjaman-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Detail Peminjaman · Perpuskita",
};

export default async function PeminjamanDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <PeminjamanDetailView id={id} />;
}
