namespace SmartOfferBooking.Api.DTOs;

public record BookingRequest(
    Guid OfferId,
    Guid SlotId,
    string CustomerName,
    string CustomerPhone,
    string? CustomerEmail,
    int PeopleCount,
    string? SpecialNote
);
