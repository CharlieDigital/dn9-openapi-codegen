// This file is auto-generated by @hey-api/openapi-ts

export const WeatherForecastSchema = {
    required: ['date', 'temperatureC', 'summary'],
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
        summary: {
            type: 'string',
            nullable: true
        },
        temperatureF: {
            type: 'integer',
            format: 'int32'
        }
    }
} as const;