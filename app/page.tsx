import { buttonVariants } from "@/components/ui/button";
import User from "@/components/User";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="text-2xl">
      Home --&nbsp;
      <Link className={buttonVariants()} href={"/admin"}>
        Go To Admin
      </Link>
      <h2>Client Session</h2>
      <User />
      <h2>Server Session</h2>
      {JSON.stringify(session)}
    </div>
  );
}
