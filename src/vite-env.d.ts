
/// <reference types="vite/client" />

// Define the DateRange type for React Day Picker to fix TypeScript issues
import { DateRange as RDPDateRange } from 'react-day-picker';

declare global {
  type DateRange = RDPDateRange;
}
