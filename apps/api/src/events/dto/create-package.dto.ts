export class CreatePackageDto {
    title: string;
    championship: string;
    teamMatch: string;
    eventDate: string;
    priceCoins: number;
    stock: number;
    location: string;
    description?: string;
    imageUrl?: string;
    hasAirfare?: boolean;
    hasHotel?: boolean;
    hasTransfer?: boolean;
    hasFood?: boolean;
    region?: string;
    city?: string;
    departureAirport?: string;
    flightsInfo?: string;
    connectionNotice?: boolean;
    additionalFlightCost?: number;
    catalogPdfUrl?: string;
}
