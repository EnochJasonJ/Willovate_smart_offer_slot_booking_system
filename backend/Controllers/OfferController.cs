using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.Api.Data;
using SmartOfferBooking.Api.DTOs;
using SmartOfferBooking.Api.Enums;
using SmartOfferBooking.Api.Models;

namespace SmartOfferBooking.Api.Controllers;

[ApiController]
[Route("api/offers")]
[EnableRateLimiting("PublicPolicy")]
public class OfferController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OfferController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [OutputCache(PolicyName = "OffersCache")]
    public async Task<ActionResult<IEnumerable<Offer>>> GetOffers([FromQuery] string? businessType, [FromQuery] string? category, [FromQuery] DateOnly? date)
    {
        var query = _context.Offers
            .Include(o => o.Business)
            .Include(o => o.Slots)
            .AsQueryable();

        // Business rules: Cancelled/expired offers should not appear on public page
        // For simplicity, public page only shows 'Active' offers.
        if (!User.IsInRole("Admin"))
        {
            query = query.Where(o => o.Status == OfferStatus.Active && o.EndDate >= DateOnly.FromDateTime(DateTime.UtcNow));
        }

        if (!string.IsNullOrEmpty(businessType))
            query = query.Where(o => o.Business!.BusinessType == businessType);

        if (!string.IsNullOrEmpty(category))
            query = query.Where(o => o.Category == category);

        if (date.HasValue)
            query = query.Where(o => o.StartDate <= date.Value && o.EndDate >= date.Value);

        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Offer>> GetOffer(Guid id)
    {
        var offer = await _context.Offers
            .Include(o => o.Business)
            .Include(o => o.Slots)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (offer == null) return NotFound();
        return offer;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Offer>> CreateOffer(OfferDto dto, [FromServices] IOutputCacheStore cache)
    {
        // Business rule: Offer price must be less than original price
        if (dto.OfferPrice >= dto.OriginalPrice)
            return BadRequest("Offer price must be less than original price.");

        var offer = new Offer
        {
            Id = Guid.NewGuid(),
            BusinessId = dto.BusinessId,
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category,
            OriginalPrice = dto.OriginalPrice,
            OfferPrice = dto.OfferPrice,
            DiscountPercentage = dto.DiscountPercentage,
            StartDate = DateOnly.Parse(dto.StartDate),
            EndDate = DateOnly.Parse(dto.EndDate),
            TermsAndConditions = dto.TermsAndConditions,
            Status = dto.Status,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Offers.Add(offer);
        await _context.SaveChangesAsync();
        
        // Evict cache
        await cache.EvictByTagAsync("offers", default);

        return CreatedAtAction(nameof(GetOffer), new { id = offer.Id }, offer);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOffer(Guid id, OfferDto dto, [FromServices] IOutputCacheStore cache)
    {
        var offer = await _context.Offers.FindAsync(id);
        if (offer == null) return NotFound();

        offer.Title = dto.Title;
        offer.Description = dto.Description;
        offer.Category = dto.Category;
        offer.OriginalPrice = dto.OriginalPrice;
        offer.OfferPrice = dto.OfferPrice;
        offer.DiscountPercentage = dto.DiscountPercentage;
        offer.StartDate = DateOnly.Parse(dto.StartDate);
        offer.EndDate = DateOnly.Parse(dto.EndDate);
        offer.TermsAndConditions = dto.TermsAndConditions;
        offer.Status = dto.Status;
        offer.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        
        // Evict cache
        await cache.EvictByTagAsync("offers", default);
        
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOffer(Guid id, [FromServices] IOutputCacheStore cache)
    {
        var offer = await _context.Offers.FindAsync(id);
        if (offer == null) return NotFound();

        _context.Offers.Remove(offer);
        await _context.SaveChangesAsync();
        
        // Evict cache
        await cache.EvictByTagAsync("offers", default);
        
        return NoContent();
    }
}
