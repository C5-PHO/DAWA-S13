import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signIn");
  return <section className="content"><span className="eyebrow">ÁREA PROTEGIDA</span><h1>Perfil</h1><p className="lead">Información de tu cuenta.</p><div className="panel profile">
    {session.user?.image && <Image src={session.user.image} alt="Foto de perfil" width={80} height={80} className="avatar" />}
    <dl><div><dt>Nombre</dt><dd>{session.user?.name ?? "No disponible"}</dd></div><div><dt>Correo electrónico</dt><dd>{session.user?.email ?? "No disponible"}</dd></div></dl>
  </div></section>;
}
