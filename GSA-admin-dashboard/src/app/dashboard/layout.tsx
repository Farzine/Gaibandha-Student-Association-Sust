import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DefaultLayout >
      {children}
    </DefaultLayout>
  );
}
