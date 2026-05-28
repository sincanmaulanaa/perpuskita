export type Penerbit = {
  id: string;
  penerbit_buku: string;
  alamat_penerbit: string;
  telp_penerbit: string | null;
  email_penerbit: string;
  deskripsi_penerbit: string | null;
  updated_at: string;
};

export type PenerbitListResponse = {
  error?: boolean;
  status?: string;
  msg?: string;
  data: Penerbit[] | null;
};

export type PenerbitDetailResponse = {
  status?: string;
  msg?: string;
  data: Penerbit | null;
};

export type CreatePenerbitPayload = {
  penerbit_buku: string;
  alamat_penerbit: string;
  telp_penerbit: string;
  email_penerbit: string;
  deskripsi: string;
};

export type UpdatePenerbitPayload = CreatePenerbitPayload & {
  id: string;
};
