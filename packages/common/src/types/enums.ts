export enum UserIdentityProvider {
  CREDENTIALS = 'credentials',
  GOOGLE = 'google'
}


export enum EventCategory {
  CONCERT = 'concert',
  SPORTS = 'sports',
  THEATER = 'theater',
  COMEDY = 'comedy'
}

export enum EventStatus {
  ONSALE = 'onsale',
  OFFSALE = 'offsale',
  CANCELLED = 'cancelled',
  POSTPONED = 'postponed',
  RESCHEDULED = 'rescheduled'
}

export enum SeatStatus {
  AVAILABLE = 'available',
  HELD = 'held',
  BOOKED = 'booked'
}

export enum HoldStatus {
  ACTIVE = 'active',
  CONVERTED = 'converted',
  RELEASED = 'released'
}

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}
