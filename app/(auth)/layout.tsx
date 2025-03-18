export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return  <div className="bg-slate-200 p-10 rounded-md">{children}</div>;
}
