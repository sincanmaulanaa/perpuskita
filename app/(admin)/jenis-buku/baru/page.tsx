"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { JenisBukuForm } from "@/features/jenis-buku/jenis-buku-form";
import { useCreateJenisBuku } from "@/features/jenis-buku/jenis-buku.mutations";
import type { JenisBukuFormValues } from "@/features/jenis-buku/jenis-buku.schema";
import { getFriendlyMessage } from "@/lib/api-error";

export default function CreateJenisBukuPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateJenisBuku();

  const handleSubmit = async (values: JenisBukuFormValues) => {
    try {
      await mutateAsync(values);
      toast.success("Jenis buku berhasil ditambahkan.");
      router.push("/jenis-buku");
    } catch (err) {
      toast.error(
        getFriendlyMessage(err, "Tidak dapat menyimpan jenis buku."),
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Jenis Buku"
        description="Buat kategori baru untuk mengelompokkan koleksi."
      />

      <div className="max-w-2xl">
        <JenisBukuForm
          submitLabel="Simpan"
          pendingLabel="Menyimpan..."
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          cancelHref="/jenis-buku"
        />
      </div>
    </div>
  );
}
