"use client";
import { signOut } from "next-auth/react";
export default function LogoutButton() {
  return <button className="logout" onClick={() => signOut({ callbackUrl: "/signIn" })}>Cerrar sesión</button>;
}
