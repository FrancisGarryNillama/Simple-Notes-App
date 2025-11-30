import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function TransactionForm({ noteId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    tx_hash: '',
    amount: '',
    currency: 'ADA',
    external_ref: '',
    metadata: {},
  });
  
  const [metadataJson, setMetadataJson] = useState('{}');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Parse metadata JSON
      const metadata = JSON.parse(metadataJson);
      
      const txData = {
        note_id: noteId,
        tx_hash: formData.tx_hash.toLowerCase(),
        amount: formData.amount ? parseFloat(formData.amount) : null,
        currency: formData.currency,
        external_ref: formData.external_ref || null,
        metadata: metadata,
      };
      
      await onSubmit(txData);
      
      // Reset form
      setFormData({
        tx_hash: '',
        amount: '',
        currency: 'ADA',
        external_ref: '',
        metadata: {},
      });
      setMetadataJson('{}');
    } catch (err) {
      alert('Invalid JSON in metadata field');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Transaction Hash *
        </label>
        <Input
          placeholder="64 character hex hash"
          value={formData.tx_hash}
          onChange={(e) => setFormData({ ...formData, tx_hash: e.target.value })}
          maxLength={64}
          pattern="[0-9a-f]{64}"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Must be exactly 64 lowercase hex characters</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <Input
            type="number"
            step="0.000001"
            placeholder="1.234"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <Input
            placeholder="ADA"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          External Reference
        </label>
        <Input
          placeholder="Optional provider ID"
          value={formData.external_ref}
          onChange={(e) => setFormData({ ...formData, external_ref: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Metadata (JSON)
        </label>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none font-mono text-sm"
          rows={4}
          placeholder='{"key": "value"}'
          value={metadataJson}
          onChange={(e) => setMetadataJson(e.target.value)}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Transaction
        </Button>
      </div>
    </form>
  );
}