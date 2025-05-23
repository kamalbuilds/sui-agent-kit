// Test script to verify demo query matching functionality
const { findDemoQuery, getAllDemoQueries } = require('./lib/demo-queries.ts');

console.log('🧪 Testing Demo Query Integration\n');

// Test 1: Get all demo queries
console.log('📋 All Demo Queries:');
const allQueries = getAllDemoQueries();
console.log(`Found ${allQueries.length} demo queries\n`);

// Test 2: Test exact match
console.log('🎯 Testing Exact Match:');
const testQuery1 = "I want to maximize my yield with 50 SUI. First stake 30 SUI for afSUI on Aftermath, then provide liquidity to the afSUI-SUI pool on Cetus with the highest APR, and stake the remaining 20 SUI in the best validator through Aftermath.";
const match1 = findDemoQuery(testQuery1);
console.log(`Query: "${testQuery1.substring(0, 50)}..."`);
console.log(`Match found: ${match1 ? `✅ Demo ${match1.id} - ${match1.category}` : '❌ No match'}\n`);

// Test 3: Test fuzzy match
console.log('🔍 Testing Fuzzy Match:');
const testQuery2 = "maximize yield with SUI stake afSUI Aftermath liquidity Cetus";
const match2 = findDemoQuery(testQuery2);
console.log(`Query: "${testQuery2}"`);
console.log(`Match found: ${match2 ? `✅ Demo ${match2.id} - ${match2.category}` : '❌ No match'}\n`);

// Test 4: Test no match
console.log('❌ Testing No Match:');
const testQuery3 = "What is the weather today?";
const match3 = findDemoQuery(testQuery3);
console.log(`Query: "${testQuery3}"`);
console.log(`Match found: ${match3 ? `✅ Demo ${match3.id} - ${match3.category}` : '❌ No match (expected)'}\n`);

// Test 5: Show all demo query titles
console.log('📝 All Demo Query Titles:');
allQueries.forEach((query, index) => {
  console.log(`${index + 1}. ${query.category}: "${query.query.substring(0, 80)}..."`);
});

console.log('\n✅ Demo Query Integration Test Complete!'); 