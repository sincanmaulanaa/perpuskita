export type JenisBuku = {
  id: string;
  jenis_buku: string;
  deskripsi: string;
  updated_at: string;
};

export type JenisBukuListResponse = {
  error?: boolean;
  msg?: string;
  data: JenisBuku[] | null;
};

export type JenisBukuDetailResponse = {
  status?: string;
  msg?: string;
  data: JenisBuku | null;
};

export type CreateJenisBukuPayload = {
  jenis_buku: string;
  deskripsi: string;
};

export type UpdateJenisBukuPayload = CreateJenisBukuPayload & {
  id: string;
};
