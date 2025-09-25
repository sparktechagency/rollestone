import PassengerTable from "./passenger-table";
import PassengersAnalytics from "./passengers-analytics";
export default function Page() {
  return (
    <main className="h-full w-full p-2">
      <PassengersAnalytics />
      <PassengerTable />
    </main>
  );
}
