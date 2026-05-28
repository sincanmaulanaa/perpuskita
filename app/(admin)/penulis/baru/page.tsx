"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { PenulisForm } from "@/features/penulis/penulis-form";
import { useCreatePenulis } from "@/features/penulis/penulis.mutations";
import type { PenulisFormValues } from "@/features/penulis/penulis.schema";
import { getFriendlyMessage } from "@/lib/api-error";

export default function CreatePenulisPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreatePenulis();

  const handleSubmit = async (values: PenulisFormValues) => {
    try {
      await mutateAsync(values);
      toast.success("Penulis berhasil ditambahkan.");
      router.push("/penulis");
    } catch (err) {
      toast.error(getFriendlyMessage(err, "Tidak dapat menyimpan penulis."));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Penulis"
        description="Tambahkan penulis baru ke daftar."
      />
      <div className="max-w-2xl">
        <PenulisForm
          submitLabel="Simpan"
          pendingLabel="Menyimpan..."
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          cancelHref="/penulis"
        />
      </div>
    </div>
  );
}
