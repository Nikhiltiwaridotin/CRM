import Link from "next/link";
import { PackageSearch, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight">
          Solar Panel CRM & Tracking
        </h1>
        <p className="text-xl text-gray-600">
          A complete solution for order management, real-time tracking, and inventory control.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link href="/track" className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <PackageSearch size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Track Order</h2>
              <p className="text-gray-500 text-center">
                Track your solar panel delivery in real-time using your tracking ID.
              </p>
            </div>
          </Link>

          <Link href="/login" className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <LayoutDashboard size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Portal</h2>
              <p className="text-gray-500 text-center">
                Manage inventory, update order statuses, and view analytics.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
