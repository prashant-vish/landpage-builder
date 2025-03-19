import { buttonVariants } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

const admin = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div className="flex flex-col gap-2 justify-center">
        <div className="text-2xl">
          Admin Page - Welcome Back{" "}
          <span className="text-green-300 font-extrabold">
            {session?.user.username || session?.user.name}
          </span>
        </div>
        <Link
          href={"/chat"}
          className={buttonVariants({
            className:
              "bg-black hover:bg-gray-800 transition-all duration-300 text-2xl px-4 py-3 rounded-lg font-bold text-white shadow-md",
          })}
        >
          Go To Chat
        </Link>
      </div>
    );
  }
  console.log("Session:", session);
  return <div>Please Login to See this Admin page</div>;
};

export default admin;
