import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Test event creation",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const block = chain.mineBlock([
      Tx.contractCall('mingle-bridge', 'create-event',
        [
          types.ascii("Test Event"),
          types.ascii("Test Description"),
          types.uint(1677852800),
          types.ascii("Test Location"),
          types.ascii("Test Category"),
          types.uint(100)
        ],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
    
    const response = chain.callReadOnlyFn(
      'mingle-bridge',
      'get-event-details',
      [types.uint(1)],
      deployer.address
    );
    
    const event = response.result.expectSome().expectTuple();
    assertEquals(event['title'].value, "Test Event");
  }
});

Clarinet.test({
  name: "Test RSVP functionality",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const user1 = accounts.get('wallet_1')!;
    
    // Create event first
    let block = chain.mineBlock([
      Tx.contractCall('mingle-bridge', 'create-event',
        [
          types.ascii("Test Event"),
          types.ascii("Test Description"),
          types.uint(1677852800),
          types.ascii("Test Location"),
          types.ascii("Test Category"),
          types.uint(100)
        ],
        deployer.address
      )
    ]);
    
    // Test RSVP
    block = chain.mineBlock([
      Tx.contractCall('mingle-bridge', 'rsvp-event',
        [types.uint(1), types.bool(true)],
        user1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  }
});

Clarinet.test({
  name: "Test user profile management",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const user1 = accounts.get('wallet_1')!;
    
    const block = chain.mineBlock([
      Tx.contractCall('mingle-bridge', 'update-user-profile',
        [types.list([types.ascii("Tech"), types.ascii("Music")])],
        user1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
    
    const response = chain.callReadOnlyFn(
      'mingle-bridge',
      'get-user-profile',
      [types.principal(user1.address)],
      user1.address
    );
    
    const profile = response.result.expectSome().expectTuple();
    assertEquals(profile['interests'].length, 2);
  }
});
