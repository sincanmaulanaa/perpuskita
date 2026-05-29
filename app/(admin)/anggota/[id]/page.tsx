import type { Metadata } from "next";

import { AnggotaDetail } from "@/features/anggota/anggota-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Detail Anggota · Perpuskita",
};

export default async function AnggotaDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AnggotaDetail id={id} />;
}
