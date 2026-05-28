import { z } from "zod";

export const jenisBukuSchema = z.object({
  jenis_buku: z
    .string()
    .trim()
    .min(2, "Nama jenis minimal 2 karakter.")
    .max(60, "Nama jenis maksimal 60 karakter."),
  deskripsi: z
    .string()
    .trim()
    .max(500, "Deskripsi maksimal 500 karakter.")
    .default(""),
});

export type JenisBukuFormValues = z.infer<typeof jenisBukuSchema>;
