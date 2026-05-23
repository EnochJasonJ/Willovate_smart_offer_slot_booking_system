using SmartOfferBooking.Api.Enums;

namespace SmartOfferBooking.Api.DTOs;

public class OfferDto
{
    public Guid? Id { get; set; }
    public Guid BusinessId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal OfferPrice { get; set; }
    public int DiscountPercentage { get; set; }
    public string StartDate { get; set; } = string.Empty; // Format: YYYY-MM-DD
    public string EndDate { get; set; } = string.Empty;   // Format: YYYY-MM-DD
    public string? TermsAndConditions { get; set; }
    public OfferStatus Status { get; set; }
}

public class SlotDto
{
    public Guid? Id { get; set; }
    public Guid OfferId { get; set; }
    public string SlotDate { get; set; } = string.Empty; // Format: YYYY-MM-DD
    public string StartTime { get; set; } = string.Empty; // Format: HH:mm
    public string EndTime { get; set; } = string.Empty;   // Format: HH:mm
    public int Capacity { get; set; }
    public int BookedCount { get; set; }
    public SlotStatus Status { get; set; }
}
