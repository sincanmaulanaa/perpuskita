# Perpuskita

Sistem informasi perpustakaan modern berbasis Next.js. Memberi pegawai tampilan kaya untuk mengelola koleksi buku, anggota, peminjaman, dan denda di atas REST API yang sudah ada.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) dengan React 19 & TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan `@theme` untuk skala warna brand kustom
- **Data fetching**: [Axios](https://axios-http.com/) + [TanStack Query](https://tanstack.com/query) (cache, retry, invalidation)
- **State management**: [Zustand](https://github.com/pmndrs/zustand) (auth session, UI state lintas-komponen)
- **Form**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) untuk validasi yang type-safe
- **Notifikasi**: [Sonner](https://sonner.emilkowal.ski/)
- **Font**: [Poppins](https://fonts.google.com/specimen/Poppins) via `next/font`
- **Package manager**: [Bun](https://bun.sh/)

## Fitur

**Modul Master Data** — semua dengan list, detail, create, update, delete:
- 📚 Buku (read-only — endpoint create belum tersedia di backend)
- 🏷️ Jenis Buku
- ✍️ Penulis
- 🏢 Penerbit
- 👥 Anggota (read-only)

**Modul Transaksi** — full CRUD:
- 📅 Peminjaman dengan combobox pencarian anggota, badge status (aktif / lewat batas), dan halaman detail yang menampilkan daftar buku yang dipinjam
- 🧾 Denda dengan form yang otomatis mengisi data peminjaman saat dipilih, format Rupiah, dan kalkulasi hari telat

**Beranda (Dashboard)**
- 4 kartu statistik (Total Buku, Total Anggota, Peminjaman Aktif, Lewat Batas)
- Daftar 5 peminjaman paling lama lewat batas
- Akumulasi total denda

**Aplikasi**
- Otentikasi JWT dengan halaman login, route guard, dan logout
- Sidebar responsif (drawer di mobile)
- Toast notifikasi untuk semua aksi
- Search dengan debounce di setiap list page (250ms)
- Pagination 10 baris per halaman
- Empty / loading / error state yang konsisten di semua tabel
- Show/hide password di field login
- PWA-ready (favicon set lengkap + web manifest dengan brand color)

## Struktur Proyek

```
app/
├── (admin)/                     # route group untuk halaman terproteksi
│   ├── _components/             # admin shell + sidebar
│   ├── anggota/                 # list, [id]
│   ├── buku/                    # list, [id]
│   ├── denda/                   # list, baru, [id]/edit
│   ├── jenis-buku/              # list, baru, [id]/edit
│   ├── peminjaman/              # list, baru, [id], [id]/edit
│   ├── penerbit/                # list, baru, [id]/edit
│   ├── penulis/                 # list, baru, [id]/edit
│   ├── layout.tsx               # menerapkan auth guard
│   └── page.tsx                 # dashboard "/"
├── login/page.tsx               # halaman publik
├── globals.css                  # tema Tailwind + skala warna brand
└── layout.tsx                   # root layout, font, providers, metadata

features/                        # modul domain (one folder per entity)
├── anggota/
├── auth/
├── buku/
├── dashboard/
├── denda/
├── jenis-buku/
├── peminjaman/
├── penerbit/
└── penulis/
    Tiap folder berisi:
      <name>.types.ts            # DTO sesuai kontrak backend
      <name>.api.ts              # axios calls
      <name>.queries.ts          # TanStack Query hooks (useList, useById, …)
      <name>.mutations.ts        # useCreate, useUpdate, useDelete
      <name>.schema.ts           # Zod schema untuk form validation
      <name>-form.tsx            # form component (create + edit)
      <name>-list.tsx            # tabel + delete dialog
      <name>-detail.tsx          # halaman detail (jika ada)

components/ui/                   # primitif yang reusable
├── button.tsx                   # variants: primary, secondary, ghost, destructive
├── confirm-dialog.tsx           # native <dialog> untuk konfirmasi destruktif
├── data-table.tsx               # tabel generik dengan search & pagination
├── page-header.tsx
├── stat-card.tsx
├── text-field.tsx
└── textarea-field.tsx

lib/
├── api-error.ts                 # normalisasi error axios + helper pesan ramah
└── axios.ts                     # instance dengan interceptor JWT

providers/
└── query-provider.tsx           # QueryClient + Toaster
```

## Setup

### Prasyarat

- [Bun](https://bun.sh/) terinstal (`bun --version` ≥ 1.0)
- Backend [Golang-Perpustakaan-Restful-API](https://github.com/afrizal423/Golang-Perpustakaan-Restful-API) berjalan di `http://localhost:8001`

### Instalasi

```bash
bun install
cp .env.example .env.local
```

Edit `.env.local` jika base URL backend berbeda:

```
NEXT_PUBLIC_API_BASE_URL=/api/v1
BACKEND_API_URL=http://localhost:8001/api/v1
```

> Frontend selalu memanggil path same-origin `/api/v1/*`. Next.js merewrite ke `BACKEND_API_URL` di server, sehingga browser tidak terkena CORS.

### Menjalankan

```bash
bun dev
```

Buka [http://localhost:3000](http://localhost:3000).

Login dengan akun seed:
- **Username**: `admin`
- **Password**: `Perpus@2026`

## Scripts

| Perintah | Kegunaan |
|---|---|
| `bun dev` | Dev server dengan Turbopack |
| `bun run build` | Build produksi + type-check |
| `bun start` | Jalankan hasil build |
| `bun run lint` | ESLint |

## Konvensi

- **Naming**: kebab-case untuk file dan direktori, PascalCase untuk komponen
- **Domain language**: nama entitas tetap dalam Bahasa Indonesia (`Buku`, `Peminjaman`, `Denda`) sesuai kontrak API
- **Copy**: semua teks user-facing dalam Bahasa Indonesia natural — tidak ada jargon teknis seperti "submit", "endpoint", "validate"
- **Form**: validasi dengan Zod, error inline per field, server error via toast
- **TanStack Query**: cache key hierarkis (`[entity, list]`, `[entity, detail, id]`), invalidate setelah mutation
- **Axios interceptor**: otomatis menempelkan `Authorization: Bearer <token>` dari Zustand store, dan clear session pada response 401

## Arsitektur

**Pemisahan kepentingan**:
- Server state (data dari backend) → TanStack Query, tidak pernah disimpan di Zustand
- Client state (sesi auth, UI flag) → Zustand
- Form state → React Hook Form

**Pola umum** untuk halaman CRUD baru:

1. Definisikan `types`, `api`, `queries`, `mutations`, `schema` di `features/<entity>/`
2. Buat komponen `<entity>-form.tsx` (dipakai create + edit)
3. Buat komponen `<entity>-list.tsx` yang memakai `DataTable`
4. Buat 4 route: `/<entity>` (list), `/<entity>/baru` (create), `/<entity>/[id]/edit` (edit, server component yang `await params`), opsional `/<entity>/[id]` (detail)

## Catatan Backend

Beberapa keterbatasan backend yang ditangani di frontend:
- Backend membalas `500` dengan SQL error mentah saat constraint foreign key ditolak. Frontend mendeteksi pesan `"foreign key constraint"` lalu menampilkan pesan ramah: *"Tidak bisa dihapus karena masih digunakan oleh data lain."*
- Backend tidak punya endpoint create/update/delete untuk entitas `buku`, sehingga halaman buku bersifat read-only.
- Beberapa endpoint membalas dengan key `status` alih-alih `msg`. Tipe response dibuat tolerant.

## Lisensi

Project pribadi untuk keperluan portofolio.
