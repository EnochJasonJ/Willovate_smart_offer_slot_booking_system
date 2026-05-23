using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.Api.Data;
using SmartOfferBooking.Api.DTOs;
using SmartOfferBooking.Api.Enums;

namespace SmartOfferBooking.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
    {
        var totalOffers = await _context.Offers.CountAsync();
        var activeOffers = await _context.Offers.CountAsync(o => o.Status == OfferStatus.Active);
        var totalBookings = await _context.Bookings.CountAsync();
        
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var todayBookings = await _context.Bookings.CountAsync(b => b.CreatedAt >= DateTime.UtcNow.Date);

        var slots = await _context.OfferSlots.ToListAsync();
        var totalCapacity = slots.Sum(s => s.Capacity);
        var bookedSeats = slots.Sum(s => s.BookedCount);
        var availableSeats = totalCapacity - bookedSeats;

        // Simplified conversion rate: Booked seats / Total capacity
        double conversionRate = totalCapacity > 0 ? (double)bookedSeats / totalCapacity * 100 : 0;

        var recentBookings = await _context.Bookings
            .Include(b => b.Offer)
            .Include(b => b.Slot)
            .OrderByDescending(b => b.CreatedAt)
            .Take(5)
            .ToListAsync();

        return new DashboardSummaryDto(
            totalOffers,
            activeOffers,
            totalBookings,
            todayBookings,
            totalCapacity,
            bookedSeats,
            availableSeats,
            Math.Round(conversionRate, 2),
            recentBookings
        );
    }
}
