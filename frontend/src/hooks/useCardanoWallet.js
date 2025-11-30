import { useState, useEffect } from 'react';
import cardanoWallet from '../services/wallet/cardanoWallet';

export default function useCardanoWallet() {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const availableWallets = cardanoWallet.getAvailableWallets();
    setWallets(availableWallets);
  }, []);

  const connectWallet = async (walletName) => {
    setLoading(true);
    setError('');
    try {
      const result = await cardanoWallet.connectWallet(walletName);
      setSelectedWallet(walletName);
      setWalletAddress(result.address);
      setIsConnected(true);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    cardanoWallet.disconnectWallet();
    setIsConnected(false);
    setWalletAddress('');
    setSelectedWallet('');
  };

  const sendTransaction = async (recipient, amount, noteData) => {
    setLoading(true);
    setError('');
    try {
      const result = await cardanoWallet.sendTransactionWithNote(
        recipient,
        amount,
        noteData
      );
      return result;
    } catch (err) {
      setError(err.message || 'Failed to send transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    wallets,
    selectedWallet,
    isConnected,
    walletAddress,
    error,
    loading,
    connectWallet,
    disconnectWallet,
    sendTransaction,
  };
}