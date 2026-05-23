using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SmartOfferBooking.Api.Enums;

namespace SmartOfferBooking.Api.Models;

public class OfferSlot
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid OfferId { get; set; }
    
    [ForeignKey(nameof(OfferId))]
    public Offer? Offer { get; set; }

    public DateOnly SlotDate { get; set; }
    
    public TimeOnly StartTime { get; set; }
    
    public TimeOnly EndTime { get; set; }
    
    public int Capacity { get; set; }
    
    public int BookedCount { get; set; }
    
    public SlotStatus Status { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
