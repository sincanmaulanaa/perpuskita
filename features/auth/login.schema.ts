import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Mohon masukkan nama pengguna Anda."),
  password: z.string().min(1, "Mohon masukkan kata sandi Anda."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
