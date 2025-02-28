# MingleBridge
A decentralized platform for organizing and discovering social events with friend suggestions on the Stacks blockchain.

## Features
- Create and manage social events
- Search events by location and category
- Friend suggestions based on mutual interests
- Join/RSVP to events
- Event attendance tracking
- Rating system for events and organizers

## Setup and Installation
1. Clone the repository
2. Install Clarinet (if not already installed)
3. Run `clarinet check` to verify the contract
4. Run `clarinet test` to run the test suite

## Usage Examples
```clarity
;; Create a new event
(contract-call? .mingle-bridge create-event "Blockchain Meetup" "Tech meetup for blockchain enthusiasts" u1677852800 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

;; RSVP to an event
(contract-call? .mingle-bridge rsvp-event u1 true)

;; Get event details
(contract-call? .mingle-bridge get-event-details u1)
```

## Dependencies
- Clarity language
- Clarinet for testing and deployment
