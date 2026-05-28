import { z } from "zod";

export const penulisSchema = z.object({
  penulis_buku: z
    .string()
    .trim()
    .min(2, "Nama penulis minimal 2 karakter.")
    .max(100, "Nama penulis maksimal 100 karakter."),
  alamat_penulis: z
    .string()
    .trim()
    .max(200, "Alamat maksimal 200 karakter."),
  email_penulis: z
    .string()
    .trim()
    .email("Format email belum sesuai.")
    .or(z.literal("")),
  deskripsi: z
    .string()
    .trim()
    .max(500, "Deskripsi maksimal 500 karakter."),
});

export type PenulisFormValues = z.infer<typeof penulisSchema>;
