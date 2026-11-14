import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser } from "@/lib/db";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!name || name.length > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || Buffer.byteLength(password, "utf8") > 72) return NextResponse.json({ error: "Revisa los datos. La contraseña debe tener al menos 8 caracteres y máximo 72 bytes." }, { status: 400 });
    const hash = await bcrypt.hash(password, 12);
    try { await createUser(name, email, hash); }
    catch (error) { if ((error as { code?: string }).code === "SQLITE_CONSTRAINT_UNIQUE" || (error as { code?: string }).code === "23505") return NextResponse.json({ error: "No se pudo registrar la cuenta." }, { status: 409 }); throw error; }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "No se pudo procesar la solicitud." }, { status: 400 }); }
}
