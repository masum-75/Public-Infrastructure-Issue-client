import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaDownload, FaWallet } from 'react-icons/fa';

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
        return <span className="loading loading-infinity loading-xl block mx-auto mt-20"></span>;
    }

    return (
        <div className='p-4'>
            <h2 className="text-4xl font-bold mb-6 text-secondary flex items-center"><FaWallet className='mr-3' /> All Payments History ({payments.length})</h2>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Transaction ID</th>
                            <th>Customer Email</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={payment._id}>
                                <th>{index + 1}</th>
                                <td className='font-mono text-sm'>{payment.transactionId}</td>
                                <td>{payment.customerEmail}</td>
                                <td><span className={`badge badge-lg capitalize ${payment.type === 'boost' ? 'badge-info' : 'badge-warning'} text-white`}>{payment.type}</span></td>
                                <td><span className="font-bold text-lg">{payment.amount} {payment.currency.toUpperCase()}</span></td>
                                <td>{new Date(payment.paidAt).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDownloadPDF(payment.transactionId)}
                                        className="btn btn-sm btn-success text-white tooltip"
                                        data-tip="Download Invoice PDF"
                                    >
                                        <FaDownload /> PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentsAdmin;