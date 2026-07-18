import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sale } from '../../core/services/sales';

@Component({
  selector: 'app-vehicle-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-chart.html',
  styleUrl: './vehicle-chart.css'
})
export class VehicleChart {
  sales = input<Sale[]>([]);

  getVehicleAnalysis(): { vehicle: string; count: number; percentage: number }[] {
    const salesData = this.sales();
    if (!salesData || salesData.length === 0) return [];

    const vehicleCounts: { [key: string]: number } = {};
    salesData.forEach(sale => {
      const vehicle = sale.vehicle_name || 'Unknown';
      vehicleCounts[vehicle] = (vehicleCounts[vehicle] || 0) + 1;
    });

    const total = salesData.length;
    return Object.entries(vehicleCounts)
      .map(([vehicle, count]) => ({
        vehicle,
        count,
        percentage: (count / total) * 100
      }))
      .sort((a, b) => b.count - a.count);
  }

  getMaxCount(): number {
    const analysis = this.getVehicleAnalysis();
    return Math.max(...analysis.map(a => a.count), 1);
  }
}
