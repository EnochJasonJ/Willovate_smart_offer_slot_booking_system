namespace SmartOfferBooking.Api.Enums;

public enum UserRole
{
    Admin,
    Customer
}

public enum OfferStatus
{
    Draft,
    Active,
    Paused,
    Expired,
    Cancelled
}

public enum SlotStatus
{
    Available,
    Full,
    Closed,
    Expired,
    Cancelled
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed,
    NoShow
}
