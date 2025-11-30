import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

export default function SendTransactionForm({ note, onSubmit, onCancel, loading }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [attachNote, setAttachNote] = useState(true);
  const [error, setError] = useState('');

  const validateAddress = (address) => {
    // Basic Cardano address validation (starts with addr1 for mainnet or addr_test1 for testnet)
    return address.startsWith('addr1') || address.startsWith('addr_test1');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!recipient.trim()) {
      setError('Recipient address is required');
      return;
    }

    if (!validateAddress(recipient)) {
      setError('Invalid Cardano address format');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    // Convert ADA to Lovelace (1 ADA = 1,000,000 Lovelace)
    const lovelace = Math.floor(amountNum * 1_000_000);

    const txData = {
      recipient,
      amount: lovelace,
      noteData: attachNote ? {
        noteId: note.id,
        title: note.title,
        description: note.description,
      } : null,
    };

    try {
      await onSubmit(txData);
    } catch (err) {
      setError(err.message || 'Transaction failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipient Address *
        </label>
        <Input
          type="text"
          placeholder="addr1..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter a valid Cardano address
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount (ADA) *
        </label>
        <Input
          type="number"
          step="0.000001"
          min="0.000001"
          placeholder="1.5"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Minimum: 1 ADA (network fees apply)
        </p>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={attachNote}
            onChange={(e) => setAttachNote(e.target.checked)}
            className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <div className="flex-1">
            <p className="font-medium text-indigo-900">Attach Note to Transaction</p>
            <p className="text-sm text-indigo-700 mt-1">
              Include this note's content in the transaction metadata
            </p>
            {attachNote && note && (
              <div className="mt-2 p-2 bg-white rounded border border-indigo-200">
                <p className="text-xs font-semibold text-gray-900">{note.title || 'Untitled'}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{note.description}</p>
              </div>
            )}
          </div>
        </label>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex items-center gap-2">
          <Send className="w-4 h-4" />
          {loading ? 'Sending...' : 'Send Transaction'}
        </Button>
      </div>
    </form>
  );
}