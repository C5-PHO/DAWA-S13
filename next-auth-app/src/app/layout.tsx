import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Provider from "@/components/SessionProvider";
import LogoutButton from "@/components/LogoutButton";
import "./globals.css";

export const metadata: Metadata = { title: "Next Auth App", description: "Laboratorio de autenticación y sesiones" };
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);
  return <html lang="es"><body><Provider session={session}>
    <header className="header"><nav className="nav" aria-label="Navegación principal">
      <Link className="brand" href="/dashboard"><Image src="/logo.svg" alt="" width={40} height={40} priority />Next Auth App</Link>
      {session && <div className="navlinks"><Link href="/dashboard">Dashboard</Link><Link href="/profile">Perfil</Link><LogoutButton /></div>}
    </nav></header><main>{children}</main>
  </Provider></body></html>;
}
