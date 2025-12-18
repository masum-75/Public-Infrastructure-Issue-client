import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaDownload, FaWallet, FaReceipt } from 'react-icons/fa';

const PaymentsAdmin = () => {
    const axiosSecure = useAxiosSecure();

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['allPaymentsAdmin'],
        queryFn: async () => {
             const res = await axiosSecure.get('/dashboard/admin/payments');
             return res.data;
        }
    });

    const handleDownloadPDF = (transactionId) => {
        window.open(`${import.meta.env.VITE_API_URL}/invoices/${transactionId}/pdf`, '_blank');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-infinity loading-lg text-primary"></span>
        </div>;
    }

    return (
        <div className='p-6 bg-white rounded-2xl shadow-sm min-h-screen'>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-gray-50 pb-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight flex items-center">
                        <FaWallet className='mr-3 text-primary' /> All Payments History
                    </h2>
                    <p className="text-gray-400 font-medium text-sm mt-1 ml-10">Manage and track all infrastructure billing</p>
                </div>
                <div className="bg-primary/10 px-6 py-2 rounded-full border border-primary/20">
                    <span className="text-primary font-bold">Total Transactions: {payments.length}</span>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="table w-full">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                        <tr>
                            <th className="py-5 pl-6">#</th>
                            <th>Transaction ID</th>
                            <th>Customer Info</th>
                            <th>Service Type</th>
                            <th>Amount</th>
                            <th>Payment Date</th>
                            <th className="text-center">Invoice</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-20">
                                    <div className="flex flex-col items-center opacity-20">
                                        <FaReceipt className="text-6xl mb-4" />
                                        <p className="text-xl font-bold">No Payments Found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment, index) => (
                                <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                                    <th className="pl-6 text-gray-400 font-medium">{index + 1}</th>
                                    <td>
                                        <span className='font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200'>
                                            {payment.transactionId}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-700">{payment.customerEmail.split('@')[0]}</span>
                                            <span className="text-xs text-gray-400 italic">{payment.customerEmail}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm font-bold uppercase tracking-wider py-3 px-4 ${
                                            payment.type === 'boost' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-orange-50 text-orange-600 border-orange-200'
                                        }`}>
                                            {payment.type}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-black text-gray-800 text-lg">{payment.amount}</span>
                                            <span className="text-[10px] font-bold text-gray-400">{payment.currency.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="text-gray-500 font-medium">
                                        {new Date(payment.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="text-center">
                                        <button 
                                            onClick={() => handleDownloadPDF(payment.transactionId)}
                                            className="btn btn-sm btn-ghost hover:bg-green-50 hover:text-green-600 text-gray-400 transition-all rounded-xl"
                                            title="Download PDF Invoice"
                                        >
                                            <FaDownload className="mr-2" /> PDF
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentsAdmin;