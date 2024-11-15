// This file is auto-generated by @hey-api/openapi-ts

export const WeatherForecastSchema = {
    type: 'object',
    properties: {
        date: {
            type: 'string',
            format: 'date'
        },
        temperatureC: {
            type: 'integer',
            format: 'int32'
        },
        temperatureF: {
            type: 'integer',
            format: 'int32'
        },
        summary: {
            type: 'string',
            nullable: true
        }
    }
} as const;