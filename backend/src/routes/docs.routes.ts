import { Router } from 'express'

const openapiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'FleetPulse API',
    version: '1.0.0',
    description:
      'FleetPulse fleet telemetry generation, streaming, vehicle management, and real-time analytics API.',
  },
  servers: [
    {
      url: '/',
      description: 'Current environment',
    },
  ],
  tags: [
    { name: 'System', description: 'System health and status' },
    { name: 'Auth', description: 'Authentication and session management' },
    { name: 'Dashboard', description: 'Aggregated fleet metrics, trends, and alerts' },
    { name: 'Vehicles', description: 'Vehicle fleet management and history' },
    { name: 'Telemetry', description: 'Real-time telemetry event streaming' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Service Health Check',
        description: 'Returns service operational status and uptime.',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    uptime: { type: 'integer', example: 120 },
                  },
                  required: ['status', 'uptime'],
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log In User',
        description:
          'Validates demo credentials, creates a session, and sets the HTTP-only session cookie.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email', example: 'demo@fleetpulse.com' },
                  password: { type: 'string', format: 'password', example: 'password123' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Authentication successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Invalid input payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid email or password',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/session': {
      get: {
        tags: ['Auth'],
        summary: 'Get Current Session',
        description: 'Returns the active session for the authenticated user.',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Current session data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized / session expired',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Log Out User',
        description: 'Destroys the current user session and clears the session cookie.',
        security: [{ cookieAuth: [] }],
        responses: {
          '204': {
            description: 'Session destroyed successfully',
          },
        },
      },
    },
    '/api/dashboard/summary': {
      get: {
        tags: ['Dashboard'],
        summary: 'Fleet KPI Summary',
        description: 'Retrieves fleet vehicle counts by status and 10-minute sliding averages.',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Fleet KPI summary metrics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DashboardSummary' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/dashboard/alerts': {
      get: {
        tags: ['Dashboard'],
        summary: 'Active Fleet Alerts',
        description:
          'Retrieves active warnings and critical alerts, with optional custom temperature threshold.',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'tempThreshold',
            in: 'query',
            required: false,
            description: 'Clamped temperature warning threshold (60-100 °C)',
            schema: { type: 'number', minimum: 60, maximum: 100, example: 75 },
          },
        ],
        responses: {
          '200': {
            description: 'Active fleet alerts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DashboardAlerts' },
              },
            },
          },
          '400': {
            description: 'Invalid tempThreshold parameter',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/dashboard/trends': {
      get: {
        tags: ['Dashboard'],
        summary: 'Fleet Telemetry Trends',
        description: 'Time-series buckets with averages and fleet status distribution.',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Trend time-series points',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DashboardTrends' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/vehicles': {
      get: {
        tags: ['Vehicles'],
        summary: 'List All Vehicles',
        description: 'Returns all vehicles with their most recent telemetry snapshot.',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'List of fleet vehicles',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VehicleListResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/vehicles/{id}': {
      get: {
        tags: ['Vehicles'],
        summary: 'Get Vehicle by ID',
        description: 'Returns vehicle metrics, recent history (up to 30 events), and active alerts.',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Vehicle ID (e.g. veh-01)',
            schema: { type: 'string', example: 'veh-01' },
          },
        ],
        responses: {
          '200': {
            description: 'Vehicle detail with history and alerts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VehicleDetailResponse' },
              },
            },
          },
          '404': {
            description: 'Vehicle not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/telemetry/stream': {
      get: {
        tags: ['Telemetry'],
        summary: 'Stream Live Telemetry (SSE)',
        description:
          'Long-lived Server-Sent Events (SSE) stream emitting real-time vehicle telemetry ticks and keepalive pings.',
        security: [{ cookieAuth: [] }],
        responses: {
          '200': {
            description: 'Text Event Stream (SSE)',
            content: {
              'text/event-stream': {
                schema: {
                  type: 'string',
                  example: 'data: {"vehicleId":"veh-01","speed":45.2,"temperature":72.1,"fuelLevel":68.0,"status":"ACTIVE","eventType":"UPDATE","timestamp":"2026-09-10T14:53:00.000Z"}\n\n',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'fleetpulse_session',
        description: 'Session cookie set upon successful login at `/api/auth/login`.',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'UNAUTHORIZED' },
          message: { type: 'string', example: 'Your session has expired' },
        },
        required: ['error', 'message'],
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email', example: 'demo@fleetpulse.com' },
              expiresAt: { type: 'string', format: 'date-time', example: '2026-09-10T15:23:00.000Z' },
            },
            required: ['email', 'expiresAt'],
          },
        },
        required: ['user'],
      },
      VehicleStatus: {
        type: 'string',
        enum: ['ACTIVE', 'IDLE', 'WARNING', 'CRITICAL'],
        example: 'ACTIVE',
      },
      Vehicle: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'veh-01' },
          vehicleNumber: { type: 'string', example: 'FP-101' },
          driverName: { type: 'string', example: 'Marcus Vance' },
          location: { type: 'string', example: 'Route 101 N, Mile 42' },
          speed: { type: 'number', example: 54.2 },
          temperature: { type: 'number', example: 78.4 },
          fuelLevel: { type: 'number', example: 64.0 },
          status: { $ref: '#/components/schemas/VehicleStatus' },
          lastUpdated: { type: 'string', format: 'date-time', example: '2026-09-10T14:53:00.000Z' },
        },
        required: [
          'id',
          'vehicleNumber',
          'driverName',
          'location',
          'speed',
          'temperature',
          'fuelLevel',
          'status',
          'lastUpdated',
        ],
      },
      VehicleListResponse: {
        type: 'object',
        properties: {
          vehicles: {
            type: 'array',
            items: { $ref: '#/components/schemas/Vehicle' },
          },
          total: { type: 'integer', example: 10 },
          generatedAt: { type: 'string', format: 'date-time', example: '2026-09-10T14:53:00.000Z' },
        },
        required: ['vehicles', 'total', 'generatedAt'],
      },
      VehicleDetailResponse: {
        type: 'object',
        properties: {
          vehicle: { $ref: '#/components/schemas/Vehicle' },
          history: {
            type: 'array',
            items: { $ref: '#/components/schemas/TelemetryEvent' },
          },
          alerts: {
            type: 'array',
            items: { $ref: '#/components/schemas/Alert' },
          },
        },
        required: ['vehicle', 'history', 'alerts'],
      },
      MetricDelta: {
        type: 'object',
        properties: {
          value: { type: 'number', example: 48.6 },
          delta: { type: 'number', example: 2.3 },
        },
        required: ['value', 'delta'],
      },
      DashboardSummary: {
        type: 'object',
        properties: {
          totalVehicles: { type: 'integer', example: 10 },
          activeVehicles: { type: 'integer', example: 6 },
          idleVehicles: { type: 'integer', example: 2 },
          warningVehicles: { type: 'integer', example: 1 },
          criticalVehicles: { type: 'integer', example: 1 },
          averageSpeed: { $ref: '#/components/schemas/MetricDelta' },
          averageTemperature: { $ref: '#/components/schemas/MetricDelta' },
          averageFuel: { $ref: '#/components/schemas/MetricDelta' },
          windowSeconds: { type: 'integer', example: 600 },
          generatedAt: { type: 'string', format: 'date-time', example: '2026-09-10T14:53:00.000Z' },
        },
        required: [
          'totalVehicles',
          'activeVehicles',
          'idleVehicles',
          'warningVehicles',
          'criticalVehicles',
          'averageSpeed',
          'averageTemperature',
          'averageFuel',
          'windowSeconds',
          'generatedAt',
        ],
      },
      Alert: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'alt-01' },
          vehicleId: { type: 'string', example: 'veh-03' },
          vehicleNumber: { type: 'string', example: 'FP-103' },
          severity: { type: 'string', enum: ['WARNING', 'CRITICAL'], example: 'CRITICAL' },
          type: { type: 'string', enum: ['SPEED', 'TEMPERATURE', 'FUEL'], example: 'TEMPERATURE' },
          message: { type: 'string', example: 'Engine temperature 94.2°C exceeds threshold 85°C' },
          value: { type: 'number', example: 94.2 },
          threshold: { type: 'number', example: 85 },
          status: { type: 'string', enum: ['OPEN', 'RESOLVED'], example: 'OPEN' },
          timestamp: { type: 'string', format: 'date-time', example: '2026-09-10T14:53:00.000Z' },
        },
        required: [
          'id',
          'vehicleId',
          'vehicleNumber',
          'severity',
          'type',
          'message',
          'value',
          'threshold',
          'status',
          'timestamp',
        ],
      },
      AlertThresholds: {
        type: 'object',
        properties: {
          speed: { type: 'number', example: 80 },
          temperatureWarning: { type: 'number', example: 75 },
          temperatureCritical: { type: 'number', example: 85 },
          fuelWarning: { type: 'number', example: 20 },
          fuelCritical: { type: 'number', example: 10 },
        },
        required: ['speed', 'temperatureWarning', 'temperatureCritical', 'fuelWarning', 'fuelCritical'],
      },
      DashboardAlerts: {
        type: 'object',
        properties: {
          alerts: {
            type: 'array',
            items: { $ref: '#/components/schemas/Alert' },
          },
          totalAlerts: { type: 'integer', example: 3 },
          criticalCount: { type: 'integer', example: 1 },
          warningCount: { type: 'integer', example: 2 },
          thresholds: { $ref: '#/components/schemas/AlertThresholds' },
          generatedAt: { type: 'string', format: 'date-time', example: '2026-09-10T14:53:00.000Z' },
        },
        required: ['alerts', 'totalAlerts', 'criticalCount', 'warningCount', 'thresholds', 'generatedAt'],
      },
      TrendPoint: {
        type: 'object',
        properties: {
          timestamp: { type: 'string', format: 'date-time', example: '2026-09-10T14:50:00.000Z' },
          averageSpeed: { type: 'number', example: 52.4 },
          averageTemperature: { type: 'number', example: 76.1 },
          averageFuel: { type: 'number', example: 67.8 },
          eventCount: { type: 'integer', example: 15 },
        },
        required: ['timestamp', 'averageSpeed', 'averageTemperature', 'averageFuel', 'eventCount'],
      },
      StatusDistribution: {
        type: 'object',
        properties: {
          status: { $ref: '#/components/schemas/VehicleStatus' },
          count: { type: 'integer', example: 6 },
        },
        required: ['status', 'count'],
      },
      DashboardTrends: {
        type: 'object',
        properties: {
          points: {
            type: 'array',
            items: { $ref: '#/components/schemas/TrendPoint' },
          },
          bucketSeconds: { type: 'integer', example: 60 },
          statusDistribution: {
            type: 'array',
            items: { $ref: '#/components/schemas/StatusDistribution' },
          },
          generatedAt: { type: 'string', format: 'date-time', example: '2026-09-10T14:53:00.000Z' },
        },
        required: ['points', 'bucketSeconds', 'statusDistribution', 'generatedAt'],
      },
      TelemetryEventType: {
        type: 'string',
        enum: ['UPDATE', 'SPEED_ALERT', 'TEMPERATURE_ALERT', 'LOW_FUEL', 'RECOVERY'],
        example: 'UPDATE',
      },
      TelemetryEvent: {
        type: 'object',
        properties: {
          vehicleId: { type: 'string', example: 'veh-01' },
          speed: { type: 'number', example: 51.3 },
          temperature: { type: 'number', example: 74.5 },
          fuelLevel: { type: 'number', example: 63.2 },
          status: { $ref: '#/components/schemas/VehicleStatus' },
          eventType: { $ref: '#/components/schemas/TelemetryEventType' },
          timestamp: { type: 'string', format: 'date-time', example: '2026-09-10T14:53:00.000Z' },
        },
        required: ['vehicleId', 'speed', 'temperature', 'fuelLevel', 'status', 'eventType', 'timestamp'],
      },
    },
  },
}

const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FleetPulse API - Swagger UI</title>
  <link rel="shortcut icon" href="https://fastapi.tiangolo.com/img/favicon.png">
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
  <style>
    html {
      box-sizing: border-box;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #fafafa;
    }
    .swagger-ui .topbar {
      display: none;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: 'BaseLayout',
        showExtensions: true,
        showCommonExtensions: true,
      })
    }
  </script>
</body>
</html>`

const router = Router()

router.get('/openapi.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.json(openapiSpec)
})

router.get(['/', '/docs'], (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(swaggerHtml)
})

export default router
