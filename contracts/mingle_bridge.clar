;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-found (err u404))
(define-constant err-unauthorized (err u401))
(define-constant err-invalid-data (err u400))

;; Data Variables
(define-data-var next-event-id uint u1)
(define-data-var next-user-id uint u1)

;; Data Maps
(define-map Events 
  { event-id: uint } 
  {
    title: (string-ascii 100),
    description: (string-ascii 500),
    timestamp: uint,
    organizer: principal,
    location: (string-ascii 100),
    category: (string-ascii 50),
    max-participants: uint,
    current-participants: uint
  }
)

(define-map EventRSVPs 
  { event-id: uint, user: principal } 
  { attending: bool }
)

(define-map UserProfiles
  { user: principal }
  {
    interests: (list 10 (string-ascii 50)),
    attended-events: (list 50 uint),
    rating: uint
  }
)

;; Public functions
(define-public (create-event (title (string-ascii 100)) 
                            (description (string-ascii 500))
                            (timestamp uint)
                            (location (string-ascii 100))
                            (category (string-ascii 50))
                            (max-participants uint))
  (let ((event-id (var-get next-event-id)))
    (map-set Events
      { event-id: event-id }
      {
        title: title,
        description: description,
        timestamp: timestamp,
        organizer: tx-sender,
        location: location,
        category: category,
        max-participants: max-participants,
        current-participants: u0
      }
    )
    (var-set next-event-id (+ event-id u1))
    (ok event-id)
  )
)

(define-public (rsvp-event (event-id uint) (attending bool))
  (let ((event (unwrap! (get-event-details event-id) err-not-found)))
    (if (< (get current-participants event) (get max-participants event))
      (begin
        (map-set EventRSVPs
          { event-id: event-id, user: tx-sender }
          { attending: attending }
        )
        (ok true)
      )
      err-invalid-data
    )
  )
)

(define-read-only (get-event-details (event-id uint))
  (map-get? Events { event-id: event-id })
)

(define-read-only (get-user-profile (user principal))
  (map-get? UserProfiles { user: user })
)

(define-public (update-user-profile (interests (list 10 (string-ascii 50))))
  (begin
    (map-set UserProfiles
      { user: tx-sender }
      {
        interests: interests,
        attended-events: (default-to (list) (get attended-events (get-user-profile tx-sender))),
        rating: (default-to u0 (get rating (get-user-profile tx-sender)))
      }
    )
    (ok true)
  )
)
