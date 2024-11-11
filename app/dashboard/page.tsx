// export default function Page() {
//   return <p>Dashboard page</p>;
// }

import { lusitana } from "@/app/ui/fonts";
import { fetchCardData, fetchLatestInvoices, fetchRevenue } from "@/app/lib/data";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { Card } from "@/app/ui/dashboard/cards";

export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  const cardData = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2x1`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={cardData.totalPaidInvoices} type="collected" />
        <Card title="Pending" value={cardData.totalPendingInvoices} type="pending" />
        <Card title="Total invoices" value={cardData.numberOfInvoices} type="invoices" />
        <Card title="Total consumers" value={cardData.numberOfCustomers} type="customers" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
