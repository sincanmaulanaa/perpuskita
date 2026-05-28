"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/ui/page-header";
import { PenerbitForm } from "@/features/penerbit/penerbit-form";
import { useCreatePenerbit } from "@/features/penerbit/penerbit.mutations";
import type { PenerbitFormValues } from "@/features/penerbit/penerbit.schema";
import { getFriendlyMessage } from "@/lib/api-error";

export default function CreatePenerbitPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreatePenerbit();

  const handleSubmit = async (values: PenerbitFormValues) => {
    try {
      await mutateAsync(values);
      toast.success("Penerbit berhasil ditambahkan.");
      router.push("/penerbit");
    } catch (err) {
      toast.error(getFriendlyMessage(err, "Tidak dapat menyimpan penerbit."));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Penerbit"
        description="Tambahkan penerbit baru ke daftar."
      />
      <div className="max-w-2xl">
        <PenerbitForm
          submitLabel="Simpan"
          pendingLabel="Menyimpan..."
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          cancelHref="/penerbit"
        />
      </div>
    </div>
  );
}
