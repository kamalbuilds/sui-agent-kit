// Test script to verify demo query functionality
const testDemoQuery = async () => {
  const testQuery = "I have 1000 USDC. Supply 800 USDC to Navi Protocol, borrow 400 USDC against it, then use the borrowed USDC to buy SUI and stake it for afSUI. Monitor my health factor and set up alerts if it drops below 2.0";
  
  try {
    const response = await fetch('http://localhost:3002/api/sui-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        privateKeyBech32: 'test-key',
        query: testQuery
      })
    });
    
    const data = await response.json();
    console.log('Demo Query Response:', JSON.stringify(data, null, 2));
    
    // Check if it's a demo query response
    if (data.result && data.result[0] && data.result[0].type === 'demo_query') {
      console.log('✅ Demo query detected correctly');
      console.log('📝 Message length:', data.result[0].message.length);
      console.log('🏷️ Category:', data.result[0].category);
      console.log('🔗 Protocols:', data.result[0].protocols);
    } else {
      console.log('❌ Demo query not detected or wrong format');
    }
    
  } catch (error) {
    console.error('Error testing demo query:', error);
  }
};

// Run the test
testDemoQuery();

