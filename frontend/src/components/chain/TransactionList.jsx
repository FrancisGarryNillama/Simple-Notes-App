import React from 'react';
import { Link, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TransactionList({ transactions, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Link className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No blockchain transactions yet</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(tx.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                  {tx.status}
                </span>
              </div>
              
              <p className="text-sm font-mono text-gray-600 truncate mb-2">
                <span className="font-semibold">TX:</span> {tx.tx_hash || tx.txHash}
              </p>
              
              {tx.amount && (
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Amount:</span> {tx.amount} {tx.currency || 'ADA'}
                </p>
              )}
              
              {tx.block_height && (
                <p className="text-xs text-gray-500 mt-1">
                  Block: {tx.block_height}
                </p>
              )}
              
              <p className="text-xs text-gray-400 mt-2">
                {new Date(tx.created_at || tx.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}