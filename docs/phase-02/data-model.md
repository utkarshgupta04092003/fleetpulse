# Phase 02 - Data Model

## Vehicle

```ts
type Vehicle = {
  id: string;
  vehicleNumber: string;
  driverName: string;
  location: string;
  speed: number;
  temperature: number;
  fuelLevel: number;
  status: VehicleStatus;
  lastUpdated: string;
};
```

## Vehicle Status

```ts
type VehicleStatus =
  | "ACTIVE"
  | "IDLE"
  | "WARNING"
  | "CRITICAL";
```

## Telemetry Event

```ts
type TelemetryEvent = {
  vehicleId: string;
  speed: number;
  temperature: number;
  fuelLevel: number;
  status: VehicleStatus;
  eventType: TelemetryEventType;
  timestamp: string;
};
```

## Event Type

```ts
type TelemetryEventType =
  | "UPDATE"
  | "SPEED_ALERT"
  | "TEMPERATURE_ALERT"
  | "LOW_FUEL"
  | "RECOVERY";
```

## Alert

```ts
type Alert = {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  severity: "WARNING" | "CRITICAL";
  type: "SPEED" | "TEMPERATURE" | "FUEL";
  message: string;
  value: number;
  threshold: number;
  status: "OPEN" | "RESOLVED";
  timestamp: string;
};
```

## Historical Telemetry

Keep approximately 500-1000 records in memory.

Purpose:
- trends
- recent activity
- derived analytics
- vehicle detail charts

## Seed Data

Initial dataset:
- approximately 100 vehicles
- approximately 20 drivers
- approximately 10-15 locations

Vehicle IDs should be stable across the application.

## Relationships

```text
Driver 1 ---- * Vehicle
Vehicle 1 ---- * TelemetryEvent
Vehicle 1 ---- * Alert
Vehicle * ---- 1 Location
```

The relationship is represented in application memory rather than a database.

## Data Consistency

The same vehicle must have consistent:
- vehicle number
- driver
- current location

Telemetry and alerts must reference valid vehicle IDs.
