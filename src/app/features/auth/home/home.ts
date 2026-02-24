import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly chartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [22, 18, 24, 20, 28, 26, 31],
        fill: true,
        borderColor: '#0048ff',
        backgroundColor: 'rgba(0, 72, 255, 0.16)',
        pointBackgroundColor: '#ff6a00',
        pointBorderColor: '#ffffff',
        pointRadius: 2,
        pointHoverRadius: 3,
        tension: 0.35,
        borderWidth: 2,
      },
    ],
  };

  readonly chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true, intersect: false, mode: 'index' },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: { display: false, grid: { display: false } },
    },
  };
}
