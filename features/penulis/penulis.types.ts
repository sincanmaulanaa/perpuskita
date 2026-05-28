export type Penulis = {
  id: string;
  penulis_buku: string;
  alamat: string;
  email_penulis: string;
  deskripsi: string;
  updated_at: string;
};

export type PenulisListResponse = {
  error?: boolean;
  status?: string;
  msg?: string;
  data: Penulis[] | null;
};

export type PenulisDetailResponse = {
  status?: string;
  msg?: string;
  data: Penulis | null;
};

export type CreatePenulisPayload = {
  penulis_buku: string;
  alamat_penulis: string;
  email_penulis: string;
  deskripsi: string;
};

export type UpdatePenulisPayload = CreatePenulisPayload & {
  id: string;
};
