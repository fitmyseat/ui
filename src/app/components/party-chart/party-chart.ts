import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sale } from '../../core/services/sales';

@Component({
  selector: 'app-party-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './party-chart.html',
  styleUrl: './party-chart.css'
})
export class PartyChart {
  sales = input<Sale[]>([]);

  getMonthlyPartyAnalysis(): { month: string; parties: { name: string; count: number }[] }[] {
    const salesData = this.sales();
    if (!salesData || salesData.length === 0) return [];

    const monthlyData: { [key: string]: { [key: string]: number } } = {};

    salesData.forEach(sale => {
      if (!sale.sale_date) return;
      const date = new Date(sale.sale_date);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      const partyName = sale.party_name || 'Unknown';

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }
      monthlyData[monthKey][partyName] = (monthlyData[monthKey][partyName] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, parties]) => ({
        month,
        parties: Object.entries(parties)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) // Top 5 parties per month
      }))
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
  }

  getTopPartiesOverall(): { name: string; count: number }[] {
    const salesData = this.sales();
    if (!salesData || salesData.length === 0) return [];

    const partyCounts: { [key: string]: number } = {};
    salesData.forEach(sale => {
      const partyName = sale.party_name || 'Unknown';
      partyCounts[partyName] = (partyCounts[partyName] || 0) + 1;
    });

    return Object.entries(partyCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 parties
  }

  getMaxCount(): number {
    const topParties = this.getTopPartiesOverall();
    return Math.max(...topParties.map(p => p.count), 1);
  }
}
