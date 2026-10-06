export async function showErrorDialog(message) {
  const Swal = (await import("sweetalert2")).default;
  const result = await Swal.fire({
    title: "Terjadi Kesalahan",
    text: message,
    icon: "error",
    confirmButtonText: "Tutup",
    confirmButtonColor: "#ef4444",
  });
  if (result.isConfirmed) {
    Swal.close();
  }
  return result;
}

export async function showWarningDialog(message) {
  const Swal = (await import("sweetalert2")).default;
  const result = await Swal.fire({
    title: "Peringatan",
    text: message,
    icon: "warning",
    confirmButtonText: "Tutup",
    confirmButtonColor: "#f59e0b",
  });
  if (result.isConfirmed) {
    Swal.close();
  }
  return result;
}

export async function showSuccessDialog(message) {
  const Swal = (await import("sweetalert2")).default;
  const result = await Swal.fire({
    title: "Tindakan Berhasil",
    text: message,
    icon: "success",
    confirmButtonText: "Tutup",
    confirmButtonColor: "#10b981",
  });
  if (result.isConfirmed) {
    Swal.close();
  }
  return result;
}

export async function showConfirmDialog(message) {
  const Swal = (await import("sweetalert2")).default;
  return Swal.fire({
    title: "Konfirmasi",
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
    confirmButtonColor: "#6366f1",
    cancelButtonColor: "#94a3b8",
  });
}

export function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}