require('dotenv').config();

console.log('\n🔍 Blockchain Configuration Verification\n');
console.log('='.repeat(50));

// Check each required variable
const checks = {
  'BLOCKCHAIN_ENABLED': process.env.BLOCKCHAIN_ENABLED,
  'ETHEREUM_RPC_URL': process.env.ETHEREUM_RPC_URL,
  'CONTRACT_ADDRESS': process.env.CONTRACT_ADDRESS,
  'BACKEND_PRIVATE_KEY': process.env.BACKEND_PRIVATE_KEY,
  'CHAIN_ID': process.env.CHAIN_ID
};

let allGood = true;

for (const [key, value] of Object.entries(checks)) {
  const hasValue = value && value !== `YOUR_${key}` && !value.includes('YOUR_');
  const status = hasValue ? '✅' : '❌';
  
  if (!hasValue) allGood = false;
  
  // Mask sensitive data
  let displayValue = value;
  if (key === 'BACKEND_PRIVATE_KEY' && value) {
    displayValue = value.substring(0, 10) + '...' + value.substring(value.length - 4);
  }
  
  console.log(`${status} ${key}: ${displayValue || 'NOT SET'}`);
}

console.log('='.repeat(50));

// Specific validations
console.log('\n📋 Validation Details:\n');

if (checks.BLOCKCHAIN_ENABLED !== 'true') {
  console.log('⚠️  BLOCKCHAIN_ENABLED is not "true"');
}

if (checks.CONTRACT_ADDRESS) {
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(checks.CONTRACT_ADDRESS);
  if (isValidAddress) {
    console.log('✅ CONTRACT_ADDRESS format is valid');
  } else {
    console.log('❌ CONTRACT_ADDRESS format is INVALID');
    console.log('   Expected format: 0x followed by 40 hex characters');
    console.log('   Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8');
    console.log(`   Your value: ${checks.CONTRACT_ADDRESS}`);
  }
}

if (checks.BACKEND_PRIVATE_KEY) {
  const isValidKey = /^0x[a-fA-F0-9]{64}$/.test(checks.BACKEND_PRIVATE_KEY);
  if (isValidKey) {
    console.log('✅ BACKEND_PRIVATE_KEY format is valid');
  } else {
    console.log('❌ BACKEND_PRIVATE_KEY format is INVALID');
    console.log('   Expected format: 0x followed by 64 hex characters');
  }
}

if (checks.ETHEREUM_RPC_URL) {
  if (checks.ETHEREUM_RPC_URL.includes('4933373fd4eb4bc6aeff4cd94f6e8b53')) {
    console.log('✅ ETHEREUM_RPC_URL is configured with your Infura key');
  } else {
    console.log('⚠️  ETHEREUM_RPC_URL may not be configured correctly');
  }
}

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('\n🎉 All configuration looks good!');
  console.log('✅ Ready to connect to blockchain\n');
} else {
  console.log('\n⚠️  Some configuration values are missing or invalid');
  console.log('❌ Please update your .env file\n');
}
