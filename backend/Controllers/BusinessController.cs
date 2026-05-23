using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.Api.Data;
using SmartOfferBooking.Api.DTOs;
using SmartOfferBooking.Api.Models;

namespace SmartOfferBooking.Api.Controllers;

[ApiController]
[Route("api/business")]
public class BusinessController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BusinessController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<Business>> GetBusiness()
    {
        var business = await _context.Businesses.FirstOrDefaultAsync();
        if (business == null) return NotFound("Business profile not found.");
        return business;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Business>> CreateBusiness(BusinessDto dto)
    {
        if (await _context.Businesses.AnyAsync()) 
            return BadRequest("Business profile already exists. Use PUT to update.");

        var business = new Business
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            BusinessType = dto.BusinessType,
            OwnerName = dto.OwnerName,
            Phone = dto.Phone,
            Email = dto.Email,
            Address = dto.Address,
            City = dto.City,
            LogoUrl = dto.LogoUrl,
            OpeningTime = TimeOnly.Parse(dto.OpeningTime),
            ClosingTime = TimeOnly.Parse(dto.ClosingTime)
        };

        _context.Businesses.Add(business);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBusiness), new { id = business.Id }, business);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBusiness(Guid id, BusinessDto dto)
    {
        var business = await _context.Businesses.FindAsync(id);
        if (business == null) return NotFound();

        business.Name = dto.Name;
        business.BusinessType = dto.BusinessType;
        business.OwnerName = dto.OwnerName;
        business.Phone = dto.Phone;
        business.Email = dto.Email;
        business.Address = dto.Address;
        business.City = dto.City;
        business.LogoUrl = dto.LogoUrl;
        business.OpeningTime = TimeOnly.Parse(dto.OpeningTime);
        business.ClosingTime = TimeOnly.Parse(dto.ClosingTime);

        await _context.SaveChangesAsync();
        return NoContent();
    }
}
