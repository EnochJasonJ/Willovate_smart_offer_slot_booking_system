using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.Api.Data;
using SmartOfferBooking.Api.DTOs;
using SmartOfferBooking.Api.Enums;
using SmartOfferBooking.Api.Models;

namespace SmartOfferBooking.Api.Controllers;

[ApiController]
[Route("api/slots")]
public class SlotController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SlotController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OfferSlot>>> GetSlots()
    {
        return await _context.OfferSlots.ToListAsync();
    }

    [HttpGet("/api/offers/{offerId}/slots")]
    public async Task<ActionResult<IEnumerable<OfferSlot>>> GetSlotsByOffer(Guid offerId)
    {
        return await _context.OfferSlots.Where(s => s.OfferId == offerId).ToListAsync();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<OfferSlot>> CreateSlot(SlotDto dto)
    {
        var slot = new OfferSlot
        {
            Id = Guid.NewGuid(),
            OfferId = dto.OfferId,
            SlotDate = DateOnly.Parse(dto.SlotDate),
            StartTime = TimeOnly.Parse(dto.StartTime),
            EndTime = TimeOnly.Parse(dto.EndTime),
            Capacity = dto.Capacity,
            BookedCount = 0,
            Status = SlotStatus.Available,
            CreatedAt = DateTime.UtcNow
        };

        _context.OfferSlots.Add(slot);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSlots), new { id = slot.Id }, slot);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSlot(Guid id, SlotDto dto)
    {
        var slot = await _context.OfferSlots.FindAsync(id);
        if (slot == null) return NotFound();

        slot.SlotDate = DateOnly.Parse(dto.SlotDate);
        slot.StartTime = TimeOnly.Parse(dto.StartTime);
        slot.EndTime = TimeOnly.Parse(dto.EndTime);
        slot.Capacity = dto.Capacity;
        slot.Status = dto.Status;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSlot(Guid id)
    {
        var slot = await _context.OfferSlots.FindAsync(id);
        if (slot == null) return NotFound();

        _context.OfferSlots.Remove(slot);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
