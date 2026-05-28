import type { Metadata } from "next";

import { BukuDetail } from "@/features/buku/buku-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Detail Buku · Perpuskita",
  description: "Informasi lengkap buku.",
};

export default async function BukuDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <BukuDetail id={id} />;
}
