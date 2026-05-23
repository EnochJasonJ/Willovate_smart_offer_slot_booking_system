using System.ComponentModel.DataAnnotations;

namespace SmartOfferBooking.Api.Models;

public class Business
{
    public Guid Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string BusinessType { get; set; } = string.Empty;
    
    public string OwnerName { get; set; } = string.Empty;
    
    public string Phone { get; set; } = string.Empty;
    
    public string Email { get; set; } = string.Empty;
    
    public string Address { get; set; } = string.Empty;
    
    public string City { get; set; } = string.Empty;
    
    public string? LogoUrl { get; set; }
    
    public TimeOnly OpeningTime { get; set; }
    
    public TimeOnly ClosingTime { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
}
