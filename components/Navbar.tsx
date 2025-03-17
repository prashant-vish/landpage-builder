import Link from "next/link";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="bg-zinc-100 py-3 border-b border-zinc-200 w-full fixed top-0 z-10">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-zinc-800">
          MyLogo
        </Link>

        {/* Login Button */}
        <Link href="/signin" className={buttonVariants()}>
          Sign in
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
