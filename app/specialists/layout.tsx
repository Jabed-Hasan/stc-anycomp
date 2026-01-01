import DashboardLayout from '@/components/layout/DashboardLayout';

export default function SpecialistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
