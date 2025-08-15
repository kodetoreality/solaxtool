#!/usr/bin/env node

/**
 * Devnet Payment Testing Script
 * 
 * This script helps test the payment system on Solana devnet
 * Run with: node test-devnet.js
 */

const { Connection, PublicKey, clusterApiUrl, Keypair } = require('@solana/web3.js');

// Configuration
const DEVNET_RPC = 'https://api.devnet.solana.com';
const PAYMENT_AMOUNT = 0.1; // SOL

console.log('🧪 Solana Tax Tool - Devnet Payment Testing');
console.log('=============================================\n');

// Create connection to devnet
const connection = new Connection(DEVNET_RPC, 'confirmed');

async function testDevnetConnection() {
  try {
    console.log('1. Testing devnet connection...');
    const slot = await connection.getSlot();
    console.log(`   ✅ Connected to devnet (Slot: ${slot})`);
    return true;
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    return false;
  }
}

async function createTestWallet() {
  try {
    console.log('\n2. Creating test wallet...');
    const keypair = Keypair.generate();
    const address = keypair.publicKey.toBase58();
    console.log(`   ✅ Test wallet created: ${address}`);
    console.log(`   📝 Add this to your .env file as EXPORT_PAYMENT_ADDRESS`);
    return { keypair, address };
  } catch (error) {
    console.log(`   ❌ Failed to create wallet: ${error.message}`);
    return null;
  }
}

async function checkWalletBalance(address) {
  try {
    console.log('\n3. Checking wallet balance...');
    const balance = await connection.getBalance(new PublicKey(address));
    const solBalance = balance / 1e9;
    console.log(`   💰 Balance: ${solBalance} SOL`);
    
    if (solBalance < PAYMENT_AMOUNT) {
      console.log(`   ⚠️  Insufficient balance for testing`);
      console.log(`   💡 Run: solana airdrop 2 ${address} --url devnet`);
    } else {
      console.log(`   ✅ Sufficient balance for testing`);
    }
    return solBalance;
  } catch (error) {
    console.log(`   ❌ Failed to check balance: ${error.message}`);
    return 0;
  }
}

async function simulatePayment(fromAddress, toAddress) {
  try {
    console.log('\n4. Simulating payment...');
    console.log(`   📤 From: ${fromAddress}`);
    console.log(`   📥 To: ${toAddress}`);
    console.log(`   💸 Amount: ${PAYMENT_AMOUNT} SOL`);
    
    // Note: This is just a simulation - you'll need to actually send SOL
    console.log(`   💡 To test payment detection:`);
    console.log(`      1. Send ${PAYMENT_AMOUNT} SOL from ${fromAddress} to ${toAddress}`);
    console.log(`      2. Use: solana transfer ${toAddress} ${PAYMENT_AMOUNT} --url devnet`);
    console.log(`      3. Or use Phantom wallet on devnet network`);
    
    return true;
  } catch (error) {
    console.log(`   ❌ Simulation failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('Starting devnet payment system test...\n');
  
  // Test 1: Connection
  const connected = await testDevnetConnection();
  if (!connected) {
    console.log('\n❌ Cannot proceed without devnet connection');
    return;
  }
  
  // Test 2: Create test wallet
  const wallet = await createTestWallet();
  if (!wallet) {
    console.log('\n❌ Cannot proceed without test wallet');
    return;
  }
  
  // Test 3: Check balance
  await checkWalletBalance(wallet.address);
  
  // Test 4: Simulate payment
  await simulatePayment(wallet.address, wallet.address);
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Copy the test wallet address to your .env file');
  console.log('2. Start your backend: cd backend && npm start');
  console.log('3. Start your frontend: cd frontend && npm run dev');
  console.log('4. Test the payment flow in the browser');
  console.log('5. Send 0.1 SOL from your devnet wallet to test payment detection');
  
  console.log('\n📚 For more help, see DEVNET_SETUP.md');
}

// Run the test
main().catch(console.error); 