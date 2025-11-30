import React, { useState, useEffect } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import cardanoWallet from '../../services/wallet/cardanoWallet';

export default function WalletConnect({ isConnected, walletAddress, onConnect, onDisconnect, loading }) {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');

  useEffect(() => {
    const available = cardanoWallet.getAvailableWallets();
    setWallets(available);
    if (available.includes('lace')) setSelectedWallet('lace');
  }, []);

  const handleConnect = async () => {
    if (selectedWallet) {
      try {
        await onConnect(selectedWallet);
      } catch (error) {
        console.error('Connection failed:', error);
        alert(error.message);
      }
    }
  };

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Wallet Connected</p>
              <p className="text-xs text-green-700 font-mono truncate max-w-xs">
                {walletAddress}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onDisconnect} className="text-green-700 hover:bg-green-100">
            <LogOut className="w-4 h-4 mr-2" /> Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <Wallet className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Connect Cardano Wallet</h3>
      </div>

      {wallets.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            No Cardano wallet detected. Please install{' '}
            <a href="https://www.lacewallet.com/" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              Lace
            </a> or another Cardano wallet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Wallet</option>
            {wallets.map((wallet) => (
              <option key={wallet} value={wallet}>
                {wallet.charAt(0).toUpperCase() + wallet.slice(1)}
              </option>
            ))}
          </select>

          <Button onClick={handleConnect} disabled={!selectedWallet || loading} className="w-full">
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>
      )}
    </div>
  );
}
