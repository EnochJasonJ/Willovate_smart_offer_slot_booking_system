using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.Api.Data;
using SmartOfferBooking.Api.DTOs;
using SmartOfferBooking.Api.Enums;
using SmartOfferBooking.Api.Models;
using System.Security.Claims;

namespace SmartOfferBooking.Api.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BookingController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
    {
        return await _context.Bookings
            .Include(b => b.Offer)
            .Include(b => b.Slot)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Booking>> CreateBooking(BookingRequest request)
    {
        var offer = await _context.Offers.FindAsync(request.OfferId);
        var slot = await _context.OfferSlots.FindAsync(request.SlotId);

        if (offer == null || slot == null) return NotFound("Offer or Slot not found.");

        // Validations
        if (offer.Status != OfferStatus.Active) return BadRequest("Offer is not active.");
        if (slot.Status != SlotStatus.Available) return BadRequest("Slot is not available.");
        if (offer.EndDate < DateOnly.FromDateTime(DateTime.UtcNow)) return BadRequest("Offer has expired.");
        
        if (slot.BookedCount + request.PeopleCount > slot.Capacity)
            return BadRequest("Requested seats exceed available capacity.");

        // Business rule: Same phone number should not exceed max booking limit (1 per customer in example)
        var existingBooking = await _context.Bookings
            .AnyAsync(b => b.SlotId == request.SlotId && b.CustomerPhone == request.CustomerPhone && b.Status != BookingStatus.Cancelled);
        
        if (existingBooking)
            return BadRequest("A booking already exists for this phone number for this slot.");

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        Guid? userId = userIdClaim != null ? Guid.Parse(userIdClaim.Value) : null;

        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            BookingReference = "BR-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
            OfferId = request.OfferId,
            SlotId = request.SlotId,
            CustomerName = request.CustomerName,
            CustomerPhone = request.CustomerPhone,
            CustomerEmail = request.CustomerEmail,
            PeopleCount = request.PeopleCount,
            SpecialNote = request.SpecialNote,
            Status = BookingStatus.Confirmed, // Auto-confirming for this prototype
            CreatedAt = DateTime.UtcNow
        };

        // Business rule: Booked count should increase after booking
        slot.BookedCount += request.PeopleCount;
        if (slot.BookedCount >= slot.Capacity)
        {
            slot.Status = SlotStatus.Full;
        }

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBookings), new { id = booking.Id }, booking);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateBookingStatus(Guid id, [FromBody] BookingStatus status)
    {
        var booking = await _context.Bookings.Include(b => b.Slot).FirstOrDefaultAsync(b => b.Id == id);
        if (booking == null) return NotFound();

        if (status == BookingStatus.Cancelled && booking.Status != BookingStatus.Cancelled)
        {
            // Revert capacity if cancelled
            if (booking.Slot != null)
            {
                booking.Slot.BookedCount -= booking.PeopleCount;
                if (booking.Slot.Status == SlotStatus.Full && booking.Slot.BookedCount < booking.Slot.Capacity)
                {
                    booking.Slot.Status = SlotStatus.Available;
                }
            }
        }

        booking.Status = status;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
