// This file is auto-generated by @hey-api/openapi-ts

export type WeatherForecast = {
    date: string;
    temperatureC: number;
    summary: (string) | null;
    temperatureF?: number;
};

export type GetWeatherForecastResponse = (Array<WeatherForecast>);

export type GetWeatherForecastError = unknown;