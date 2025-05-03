import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports-component.html',
  styleUrls: ['./admin-reports-component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminReportsComponent implements OnInit {
  private incomeChart: Chart | null = null;
  private companyTypeChart: Chart | null = null;

  constructor() {}

  ngOnInit(): void {
    this.initCharts();
  }

  private initCharts(): void {
    // Inicializar gráfico de ingresos por día
    this.initIncomeChart();
    
    // Inicializar gráfico de tipos de empresas
    this.initCompanyTypeChart();
  }

  private initIncomeChart(): void {
    const ctx = document.getElementById('incomeChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Datos de ejemplo para el gráfico de ingresos
    const labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const data = [1200, 1900, 3000, 5000, 2000, 3000, 500];

    this.incomeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ingresos (S/.)',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Ingresos (S/.)',
              font: {
                weight: 'bold'
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Día de la semana',
              font: {
                weight: 'bold'
              }
            }
          }
        }
      }
    });
  }

  private initCompanyTypeChart(): void {
    const ctx = document.getElementById('companyTypeChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Datos de ejemplo para el gráfico de tipos de empresas
    const labels = ['SAC', 'EIRL', 'SRL', 'SA', 'Otros'];
    const data = [45, 25, 15, 10, 5];

    this.companyTypeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Porcentaje',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: false
          }
        }
      }
    });
  }

  // Métodos para exportar reportes
  exportToExcel(reportType: string): void {
    console.log(`Exportando reporte de ${reportType} a Excel`);
    // Aquí iría la lógica para exportar a Excel
    // Podrías usar librerías como exceljs o xlsx
    alert(`Exportando reporte de ${reportType} a Excel`);
  }

  exportToPDF(reportType: string): void {
    console.log(`Exportando reporte de ${reportType} a PDF`);
    // Aquí iría la lógica para exportar a PDF
    // Podrías usar librerías como jspdf o pdfmake
    alert(`Exportando reporte de ${reportType} a PDF`);
  }
}