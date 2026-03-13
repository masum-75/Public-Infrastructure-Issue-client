import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaDownload, FaReceipt, FaBolt } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";

const PaymentsAdmin = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allPaymentsAdmin"],
    queryFn: async () =>
      (await axiosSecure.get("/dashboard/admin/payments")).data,
  });

  const handleDownloadPDF = (transactionId) => {
    window.open(
      `${import.meta.env.VITE_API_URL}/invoices/${transactionId}/pdf`,
      "_blank",
    );
  };

  // Summary totals
  const totalRevenue = payments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0,
  );

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          Loading payments...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-500/5 border border-red-500/20 rounded-2xl">
        <p className="text-red-400 font-bold">Failed to load payment data.</p>
        <p className="text-red-400/60 text-sm mt-1">{error.message}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header + Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <MdAttachMoney className="text-violet-400 text-2xl" />
            Payment History
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            All subscription and transaction records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl">
            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest">
              Total Revenue
            </p>
            <p className="text-violet-300 font-black text-lg">
              ৳{totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="px-4 py-2.5 bg-slate-900 border border-slate-800/60 rounded-xl">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Transactions
            </p>
            <p className="text-white font-black text-lg">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden">
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-5">
              <FaReceipt className="text-slate-600 text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              No Payments Found
            </h3>
            <p className="text-slate-500 text-sm">
              Transaction records will appear here once payments are made.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    {[
                      "#",
                      "Transaction ID",
                      "Customer",
                      "Type",
                      "Amount",
                      "Date",
                      "Invoice",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {payments.map((payment, index) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-5 py-4 text-slate-600 text-sm tabular-nums">
                        {index + 1}
                      </td>
                      <td className="px-5 py-4">
                        <code className="text-[11px] font-mono text-slate-400 bg-slate-800 border border-slate-700/60 px-2 py-1 rounded-lg">
                          {payment.transactionId?.slice(-12) || "—"}
                        </code>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-white text-sm">
                          {payment.customerEmail?.split("@")[0]}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {payment.customerEmail}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            payment.type === "boost"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {payment.type === "boost" && (
                            <FaBolt className="text-[9px]" />
                          )}
                          {payment.type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-black text-white text-base">
                          ৳{payment.amount}
                        </span>
                        {payment.currency && (
                          <span className="text-slate-600 text-[10px] font-bold ml-1">
                            {payment.currency.toUpperCase()}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-sm font-medium">
                        {new Date(payment.paidAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            handleDownloadPDF(payment.transactionId)
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 text-[10px] font-bold rounded-lg transition-all"
                          title="Download PDF Invoice"
                        >
                          <FaDownload className="text-[9px]" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-800/40">
              {payments.map((payment, index) => (
                <div key={payment._id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white text-sm">
                        {payment.customerEmail?.split("@")[0]}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {payment.customerEmail}
                      </p>
                    </div>
                    <span className="font-black text-white text-base shrink-0">
                      ৳{payment.amount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          payment.type === "boost"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {payment.type}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {new Date(payment.paidAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownloadPDF(payment.transactionId)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg transition-all"
                    >
                      <FaDownload className="text-[9px]" /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentsAdmin;
