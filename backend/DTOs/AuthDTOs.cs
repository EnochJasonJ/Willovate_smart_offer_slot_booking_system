namespace SmartOfferBooking.Api.DTOs;

public record LoginRequest(string Email, string Password);

public record AuthResponse(string Token, string Name, string Email, string Role);

public record RegisterRequest(string Name, string Email, string Password);
