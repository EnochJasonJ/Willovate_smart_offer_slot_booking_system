using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.Api.Data;
using SmartOfferBooking.Api.Models;

namespace SmartOfferBooking.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/customer/bookings")]
public class CustomerBookingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CustomerBookingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Booking>>> GetMyBookings()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = Guid.Parse(userIdClaim.Value);

        return await _context.Bookings
            .Include(b => b.Offer)
            .Include(b => b.Slot)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }
}
