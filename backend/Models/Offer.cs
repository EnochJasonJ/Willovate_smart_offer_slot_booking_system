using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SmartOfferBooking.Api.Enums;

namespace SmartOfferBooking.Api.Models;

public class Offer
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid BusinessId { get; set; }
    
    [ForeignKey(nameof(BusinessId))]
    public Business? Business { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    public string Category { get; set; } = string.Empty;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal OriginalPrice { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal OfferPrice { get; set; }
    
    public int DiscountPercentage { get; set; }
    
    public DateOnly StartDate { get; set; }
    
    public DateOnly EndDate { get; set; }
    
    public string? TermsAndConditions { get; set; }
    
    public OfferStatus Status { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<OfferSlot> Slots { get; set; } = new List<OfferSlot>();
}
