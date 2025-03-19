import { authOptions } from "@/lib/auth";
import { Layout, PenTool, ScrollText, Zap } from "lucide-react";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}
export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="text-xl h-screen mt-40 mx-10">
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg text-center">
          Welcome to Landing Page Builder
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl text-center">
          Create and customize stunning landing pages effortlessly with our
          intuitive tools and templates.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <FeatureCard
          icon={<PenTool className="w-10 h-10 text-purple-500" />}
          title="Intuitive Design"
          description="Craft beautiful pages with our easy-to-use visual editor"
        />
        <FeatureCard
          icon={<Layout className="w-10 h-10 text-blue-500" />}
          title="Responsive Templates"
          description="Start with pre-designed layouts that look great on any device"
        />
        <FeatureCard
          icon={<Zap className="w-10 h-10 text-amber-500" />}
          title="Lightning Fast"
          description="Optimized for speed to keep your visitors engaged"
        />
        <FeatureCard
          icon={<ScrollText className="w-10 h-10 text-emerald-500" />}
          title="SEO Friendly"
          description="Built-in tools to help your pages rank higher"
        />
      </div>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white/60 p-6 rounded-xl shadow-md border border-white/50 hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-800 text-center">
      {title}
    </h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);
