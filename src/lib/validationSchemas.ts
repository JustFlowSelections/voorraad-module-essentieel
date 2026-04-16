import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres"),
  password: z.string().min(6, "Wachtwoord moet minimaal 6 tekens bevatten"),
});

export const bugReportSchema = z.object({
  title: z.string().min(1, "Titel is verplicht").max(200, "Titel mag maximaal 200 tekens zijn"),
  description: z.string().min(1, "Beschrijving is verplicht").max(5000, "Beschrijving mag maximaal 5000 tekens zijn"),
});

export const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/gif", "application/pdf"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: "Alleen PNG, JPEG, GIF en PDF bestanden zijn toegestaan" };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Bestand mag maximaal 10MB zijn" };
  }
  return { valid: true };
}
