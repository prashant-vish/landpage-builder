import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <nav className="fixed top-0 z-10 w-full border-b border-zinc-200/70 bg-gradient-to-r from-zinc-50 to-zinc-100 py-4 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500"
        >
          MyLogo
        </Link>

        {/* Login Button */}
        {session?.user ? (
          <UserAccountNav />
        ) : (
          <Link
            href="/signin"
            className={buttonVariants({
              className:
                "bg-black hover:bg-gray-800 transition-all duration-300 text-2xl px-4 py-3 rounded-lg font-bold text-white shadow-md",
            })}
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
