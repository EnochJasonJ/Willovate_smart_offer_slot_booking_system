using SmartOfferBooking.Api.Models;

namespace SmartOfferBooking.Api.DTOs;

public record DashboardSummaryDto(
    int TotalOffers,
    int ActiveOffers,
    int TotalBookings,
    int TodayBookings,
    int TotalCapacity,
    int BookedSeats,
    int AvailableSeats,
    double ConversionRate,
    List<Booking> RecentBookings
);
