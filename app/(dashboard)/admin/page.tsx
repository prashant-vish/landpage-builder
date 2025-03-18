import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const admin = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div className="text-2xl">
        Admin Page - Welcome Back{" "}
        <span className="text-green-300 font-extrabold">
          {session?.user.username}
        </span>
      </div>
    );
  }
  console.log("Session:", session);
  return <div>Please Login to See this Admin page</div>;
};

export default admin;
