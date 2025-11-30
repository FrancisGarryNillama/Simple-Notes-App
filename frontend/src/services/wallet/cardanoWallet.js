import { Blaze, Blockfrost, Core, WebWallet } from '@blaze-cardano/sdk';

class CardanoWalletService {
  constructor() {
    // Preprod Blockfrost project ID
    this.provider = new Blockfrost({
      network: 'preprod', // must match your wallet's network
      projectId: import.meta.env.VITE_BLOCKFROST_PROJECT_ID,
    });
    this.walletApi = null;
    this.blaze = null;
  }

  // Get available wallets
  getAvailableWallets() {
    if (typeof window !== 'undefined' && window.cardano) {
      return Object.keys(window.cardano).filter(key =>
        window.cardano[key]?.enable !== undefined
      );
    }
    return [];
  }

  // Connect to wallet
  async connectWallet(walletName) {
    try {
      if (!window.cardano || !window.cardano[walletName]) {
        throw new Error(`Wallet ${walletName} not found`);
      }

      // Enable wallet
      this.walletApi = await window.cardano[walletName].enable();

      // Ensure wallet is on Preprod (networkId = 0)
      const networkId = await this.walletApi.getNetworkId();
      if (networkId !== 0) {
        throw new Error('Wallet is not on Preprod/Testnet!');
      }

      const wallet = new WebWallet(this.walletApi);
      this.blaze = await Blaze.from(this.provider, wallet);

      const changeAddress = await this.walletApi.getChangeAddress();
      const bech32Address = Core.Address.fromBytes(
        Buffer.from(changeAddress, 'hex')
      ).toBech32();

      return {
        connected: true,
        address: bech32Address,
        addressHex: changeAddress,
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  // Disconnect wallet
  disconnectWallet() {
    this.walletApi = null;
    this.blaze = null;
  }

  // Check if wallet is connected
  isConnected() {
    return this.walletApi !== null && this.blaze !== null;
  }

  // Send transaction with note metadata
  async sendTransactionWithNote(recipientAddress, amountLovelace, noteData) {
    if (!this.isConnected()) throw new Error('Wallet not connected');

    try {
      const tx = await this.blaze
        .newTransaction()
        .payLovelace(Core.Address.fromBech32(recipientAddress), BigInt(amountLovelace))
        .addMetadata(674, {
          msg: [noteData.title || 'Untitled Note'],
          description: [noteData.description || ''],
          noteId: noteData.noteId || null,
        })
        .complete();

      const signedTx = await this.blaze.signTransaction(tx);
      const txHash = await this.blaze.provider.postTransactionToChain(signedTx);

      return { success: true, txHash, tx };
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  // Get wallet balance
  async getBalance() {
    if (!this.isConnected()) throw new Error('Wallet not connected');

    try {
      const balanceCbor = await this.walletApi.getBalance();
      return { ada: '0', lovelace: balanceCbor }; // Simplified
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }
}

export default new CardanoWalletService();
