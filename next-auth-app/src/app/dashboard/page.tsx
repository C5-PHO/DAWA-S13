import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signIn");
  return <section className="content"><span className="eyebrow">ÁREA PROTEGIDA</span><h1>Dashboard</h1><p className="lead">Bienvenido, <strong>{session.user?.name ?? "usuario"}</strong>.</p><div className="panel"><h2>Tu sesión está activa</h2><p>Has iniciado sesión correctamente. Puedes consultar la información de tu cuenta en tu perfil.</p><Link className="link" href="/profile">Ver mi perfil →</Link></div></section>;
}
