using Microsoft.EntityFrameworkCore;
using SmartOfferBooking.Api.Models;

namespace SmartOfferBooking.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Business> Businesses { get; set; }
    public DbSet<Offer> Offers { get; set; }
    public DbSet<OfferSlot> OfferSlots { get; set; }
    public DbSet<Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Additional configuration if needed
        modelBuilder.Entity<Booking>()
            .HasIndex(b => b.BookingReference)
            .IsUnique();
            
        // Configure decimal precision for prices
        modelBuilder.Entity<Offer>()
            .Property(o => o.OriginalPrice)
            .HasPrecision(18, 2);
            
        modelBuilder.Entity<Offer>()
            .Property(o => o.OfferPrice)
            .HasPrecision(18, 2);
    }
}
