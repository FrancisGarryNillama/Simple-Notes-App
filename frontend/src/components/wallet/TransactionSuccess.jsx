import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';

export default function TransactionSuccess({ txHash, onClose }) {
  const explorerUrl = `https://preview.cardanoscan.io/transaction/${txHash}`;

  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Transaction Sent!
      </h3>

      <p className="text-gray-600 mb-4">
        Your transaction has been submitted to the blockchain
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
        <p className="font-mono text-sm text-gray-900 break-all">{txHash}</p>
      </div>

      <div className="flex gap-3 justify-center">
        <Button
          variant="secondary"
          onClick={() => window.open(explorerUrl, '_blank')}
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View on Explorer
        </Button>
        <Button onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}