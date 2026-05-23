using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SmartOfferBooking.Api.Enums;

namespace SmartOfferBooking.Api.Models;

public class Booking
{
    public Guid Id { get; set; }
    
    public Guid? UserId { get; set; }
    
    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    [Required]
    public string BookingReference { get; set; } = string.Empty;
    
    [Required]
    public Guid OfferId { get; set; }
    
    [ForeignKey(nameof(OfferId))]
    public Offer? Offer { get; set; }
    
    [Required]
    public Guid SlotId { get; set; }
    
    [ForeignKey(nameof(SlotId))]
    public OfferSlot? Slot { get; set; }

    [Required]
    public string CustomerName { get; set; } = string.Empty;
    
    [Required]
    public string CustomerPhone { get; set; } = string.Empty;
    
    public string? CustomerEmail { get; set; }
    
    public int PeopleCount { get; set; }
    
    public string? SpecialNote { get; set; }
    
    public BookingStatus Status { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
