/** Single buku entity as returned by the backend. Wire format keeps
 *  snake_case to match the API contract. */
export type Buku = {
  id_buku: string;
  isbn: string;
  id_kategori_buku: string;
  judul_buku: string;
  id_penulis_buku: string;
  id_penerbit_buku: string;
  tahun_terbit: string;
  stok_buku: number;
  rak_buku: string;
  deskripsi_buku: string | null;
  gambar_buku: string | null;
  kondisi_buku: string | null;
  created_at: string;
  updated_at: string;
};

export type BukuListResponse = {
  error: boolean;
  msg: string;
  data: Buku[] | null;
};
