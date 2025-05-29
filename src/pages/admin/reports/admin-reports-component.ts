import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
// Importaciones para exportación
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AdminReportsService } from '../../../app/services/admin/admin-reports.service';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports-component.html',
  styleUrls: ['./admin-reports-component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminReportsComponent implements OnInit {
  private incomeChart: Chart | null = null;
  private companyTypeChart: Chart | null = null;
  private incomeMonthlyTrendChart: Chart | null = null;
  private geographicDistributionChart: Chart | null = null;

  // Opciones para el checklist de estadísticas
  statisticsOptions = {
    rubro: true,
    tipoEmpresa: true,
    ubicacion: true,
    cantidad: true
  };

  // Opciones para el checklist de ingresos
  incomeOptions = {
    ingresos: true,
    gastos: true,
    ganancia: true,
    resumen: true
  };

  // Datos de prueba para estadísticas con información más detallada
  statisticsData = [
    { 
      rubro: 'Tecnología y Telecomunicaciones', 
      tipoEmpresa: 'Sociedad de Responsabilidad Limitada (SRL)', 
      ubicacion: 'Lima Metropolitana', 
      cantidad: 25,
      porcentaje: '31.25%',
      tendencia: 'Creciente',
      fechaActualizacion: '15/06/2023'
    },
    { 
      rubro: 'Comercio Minorista y Mayorista', 
      tipoEmpresa: 'Sociedad Anónima Cerrada (SAC)', 
      ubicacion: 'Arequipa Centro', 
      cantidad: 18,
      porcentaje: '22.50%',
      tendencia: 'Estable',
      fechaActualizacion: '15/06/2023'
    },
    { 
      rubro: 'Servicios Profesionales', 
      tipoEmpresa: 'Empresa Individual de Responsabilidad Limitada (EIRL)', 
      ubicacion: 'Trujillo', 
      cantidad: 12,
      porcentaje: '15.00%',
      tendencia: 'Creciente',
      fechaActualizacion: '15/06/2023'
    },
    { 
      rubro: 'Manufactura e Industria', 
      tipoEmpresa: 'Sociedad Anónima (SA)', 
      ubicacion: 'Cusco', 
      cantidad: 8,
      porcentaje: '10.00%',
      tendencia: 'Decreciente',
      fechaActualizacion: '15/06/2023'
    },
    { 
      rubro: 'Construcción e Inmobiliaria', 
      tipoEmpresa: 'Sociedad Anónima Cerrada (SAC)', 
      ubicacion: 'Lima Norte', 
      cantidad: 15,
      porcentaje: '18.75%',
      tendencia: 'Estable',
      fechaActualizacion: '15/06/2023'
    },
    { 
      rubro: 'Turismo y Hotelería', 
      tipoEmpresa: 'Sociedad Anónima Cerrada (SAC)', 
      ubicacion: 'Cusco', 
      cantidad: 2,
      porcentaje: '2.50%',
      tendencia: 'Creciente',
      fechaActualizacion: '15/06/2023'
    }
  ];

  // Datos de prueba para ingresos con información más detallada
  incomeData = [
    { 
      mes: 'Enero 2023', 
      ingresos: 15000, 
      gastos: 8000, 
      ganancia: 7000,
      margenBeneficio: '46.67%',
      comparativoAnterior: '+15%',
      principalFuenteIngreso: 'Constitución de SAC',
      principalGasto: 'Servicios notariales'
    },
    { 
      mes: 'Febrero 2023', 
      ingresos: 18000, 
      gastos: 9500, 
      ganancia: 8500,
      margenBeneficio: '47.22%',
      comparativoAnterior: '+21.43%',
      principalFuenteIngreso: 'Constitución de SRL',
      principalGasto: 'Servicios legales'
    },
    { 
      mes: 'Marzo 2023', 
      ingresos: 22000, 
      gastos: 10000, 
      ganancia: 12000,
      margenBeneficio: '54.55%',
      comparativoAnterior: '+41.18%',
      principalFuenteIngreso: 'Constitución de SAC',
      principalGasto: 'Servicios notariales'
    },
    { 
      mes: 'Abril 2023', 
      ingresos: 19500, 
      gastos: 9800, 
      ganancia: 9700,
      margenBeneficio: '49.74%',
      comparativoAnterior: '-19.17%',
      principalFuenteIngreso: 'Constitución de EIRL',
      principalGasto: 'Servicios legales'
    },
    { 
      mes: 'Mayo 2023', 
      ingresos: 23500, 
      gastos: 11200, 
      ganancia: 12300,
      margenBeneficio: '52.34%',
      comparativoAnterior: '+26.80%',
      principalFuenteIngreso: 'Constitución de SAC',
      principalGasto: 'Servicios notariales'
    }
  ];

  // Datos para el gráfico de distribución geográfica
  geographicData = [
    { region: 'Lima Metropolitana', cantidad: 45 },
    { region: 'Arequipa', cantidad: 18 },
    { region: 'Trujillo', cantidad: 12 },
    { region: 'Cusco', cantidad: 10 },
    { region: 'Piura', cantidad: 8 },
    { region: 'Chiclayo', cantidad: 7 }
  ];

  // URL del logo de la empresa (ruta corregida)
  private logoUrl = 'assets/logo.png';

  constructor(private adminReportsService: AdminReportsService) {}

  ngOnInit(): void {
    this.initCharts();
  }

  private initCharts(): void {
    // Inicializar gráfico de ingresos por día
    this.initIncomeChart();
    
    // Inicializar gráfico de tipos de empresas
    this.initCompanyTypeChart();

    // Inicializar nuevos gráficos
    this.initIncomeMonthlyTrendChart();
    this.initGeographicDistributionChart();
  }

  private initIncomeChart(): void {
    const ctx = document.getElementById('incomeChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Obtener datos del servicio (corregido para usar el método directo en lugar de Observable)
    const chartData = this.adminReportsService.getMockIncomeChartData();
    this.incomeChart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
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
              text: 'Mes',
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

    // Obtener datos del servicio (corregido para usar el método directo en lugar de Observable)
    const chartData = this.adminReportsService.getMockCompanyTypeChartData();
    this.companyTypeChart = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
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

  private initIncomeMonthlyTrendChart(): void {
    const ctx = document.getElementById('incomeMonthlyTrendChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Obtener datos del servicio (corregido para usar el método directo en lugar de Observable)
    const chartData = this.adminReportsService.getMockIncomeMonthlyTrendChartData();
    this.incomeMonthlyTrendChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
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
              text: 'Mes',
              font: {
                weight: 'bold'
              }
            }
          }
        }
      }
    });
  }

  private initGeographicDistributionChart(): void {
    const ctx = document.getElementById('geographicDistributionChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Obtener datos del servicio (corregido para usar el método directo en lugar de Observable)
    const chartData = this.adminReportsService.getMockGeographicDistributionChartData();
    this.geographicDistributionChart = new Chart(ctx, {
      type: 'pie',
      data: chartData,
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
  // Método para exportar a Excel con opciones seleccionadas y formato mejorado
  exportToExcel(reportType: string): void {
    let data: any[] = [];
    let fileName = '';
    let worksheetName = '';

    if (reportType === 'statistics') {
      // Filtrar columnas según las opciones seleccionadas y mejorar nombres
      data = this.statisticsData.map(item => {
        const filteredItem: any = {};
        if (this.statisticsOptions.rubro) 
          filteredItem['Sector Económico'] = item.rubro;
        if (this.statisticsOptions.tipoEmpresa) 
          filteredItem['Tipo de Empresa'] = item.tipoEmpresa;
        if (this.statisticsOptions.ubicacion) 
          filteredItem['Ubicación Geográfica'] = item.ubicacion;
        if (this.statisticsOptions.cantidad) {
          filteredItem['Cantidad de Empresas'] = item.cantidad;
          filteredItem['Porcentaje del Total'] = item.porcentaje;
          filteredItem['Tendencia'] = item.tendencia;
        }
        filteredItem['Fecha de Actualización'] = item.fechaActualizacion;
        return filteredItem;
      });
      fileName = 'TEY_Reporte_Estadisticas_' + new Date().toISOString().slice(0, 10) + '.xlsx';
      worksheetName = 'Estadísticas Empresariales';
    } else if (reportType === 'income') {
      // Filtrar columnas según las opciones seleccionadas y mejorar nombres
      data = this.incomeData.map(item => {
        const filteredItem: any = { 'Período': item.mes };
        if (this.incomeOptions.ingresos) {
          filteredItem['Ingresos Totales (S/.)'] = item.ingresos;
          filteredItem['Principal Fuente de Ingreso'] = item.principalFuenteIngreso;
        }
        if (this.incomeOptions.gastos) {
          filteredItem['Gastos Operativos (S/.)'] = item.gastos;
          filteredItem['Principal Categoría de Gasto'] = item.principalGasto;
        }
        if (this.incomeOptions.ganancia) {
          filteredItem['Ganancia Neta (S/.)'] = item.ganancia;
          filteredItem['Margen de Beneficio'] = item.margenBeneficio;
          filteredItem['Comparativo con Mes Anterior'] = item.comparativoAnterior;
        }
        return filteredItem;
      });
      
      // Añadir resumen si está seleccionado
      if (this.incomeOptions.resumen) {
        const totalIngresos = this.incomeData.reduce((sum, item) => sum + item.ingresos, 0);
        const totalGastos = this.incomeData.reduce((sum, item) => sum + item.gastos, 0);
        const totalGanancia = this.incomeData.reduce((sum, item) => sum + item.ganancia, 0);
        const margenPromedio = (totalGanancia / totalIngresos * 100).toFixed(2) + '%';
        
        // Añadir fila en blanco para separar
        data.push({});
        
        // Añadir resumen con formato
        const resumen: any = { 'Período': 'TOTAL PERÍODO ANALIZADO' };
        if (this.incomeOptions.ingresos) {
          resumen['Ingresos Totales (S/.)'] = totalIngresos;
          resumen['Principal Fuente de Ingreso'] = 'Consolidado';
        }
        if (this.incomeOptions.gastos) {
          resumen['Gastos Operativos (S/.)'] = totalGastos;
          resumen['Principal Categoría de Gasto'] = 'Consolidado';
        }
        if (this.incomeOptions.ganancia) {
          resumen['Ganancia Neta (S/.)'] = totalGanancia;
          resumen['Margen de Beneficio'] = margenPromedio;
          resumen['Comparativo con Mes Anterior'] = 'N/A';
        }
        
        data.push(resumen);
        
        // Añadir análisis adicional
        data.push({});
        data.push({
          'Período': 'ANÁLISIS DE RENDIMIENTO',
          'Ingresos Totales (S/.)': 'Promedio Mensual: S/. ' + (totalIngresos / this.incomeData.length).toFixed(2)
        });
        
        // Encontrar el mes de mayor ganancia
        const maxGanancia = Math.max(...this.incomeData.map(item => item.ganancia));
        const mesMayorGanancia = this.incomeData.find(item => item.ganancia === maxGanancia)?.mes;
        
        // Encontrar el mes de menor ganancia
        const minGanancia = Math.min(...this.incomeData.map(item => item.ganancia));
        const mesMenorGanancia = this.incomeData.find(item => item.ganancia === minGanancia)?.mes;
        
        data.push({
          'Período': 'Mes de Mayor Ganancia',
          'Ingresos Totales (S/.)': mesMayorGanancia + ' (S/. ' + maxGanancia.toLocaleString('es-PE') + ')'
        });
        
        data.push({
          'Período': 'Mes de Menor Ganancia',
          'Ingresos Totales (S/.)': mesMenorGanancia + ' (S/. ' + minGanancia.toLocaleString('es-PE') + ')'
        });
      }
      
      fileName = 'TEY_Reporte_Financiero_' + new Date().toISOString().slice(0, 10) + '.xlsx';
      worksheetName = 'Análisis Financiero';
    }

    // Crear libro de trabajo con formato mejorado
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    
    // Aplicar estilos (ancho de columnas)
    const colWidths = Object.keys(data[0] || {}).map(key => ({ wch: Math.max(20, key.length) }));
    worksheet['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);

    // Guardar archivo
    XLSX.writeFile(workbook, fileName);
  }

  // Método para exportar a PDF con opciones seleccionadas y formato profesional mejorado
  exportToPDF(reportType: string): void {
    const doc = new jsPDF();
    let title = '';
    let subtitle = '';
    let columns: any[] = [];
    let rows: any[] = [];

    if (reportType === 'statistics') {
      title = 'REPORTE DE ESTADÍSTICAS EMPRESARIALES';
      subtitle = 'Análisis de constitución de empresas por sector, tipo y ubicación';
      
      // Añadir solo las columnas seleccionadas con nombres mejorados
      if (this.statisticsOptions.rubro) 
        columns.push({ header: 'Sector Económico', dataKey: 'rubro' });
      if (this.statisticsOptions.tipoEmpresa) 
        columns.push({ header: 'Tipo de Empresa', dataKey: 'tipoEmpresa' });
      if (this.statisticsOptions.ubicacion) 
        columns.push({ header: 'Ubicación', dataKey: 'ubicacion' });
      if (this.statisticsOptions.cantidad) {
        columns.push({ header: 'Cantidad', dataKey: 'cantidad' });
        columns.push({ header: 'Porcentaje', dataKey: 'porcentaje' });
      }
      
      // Formatear los datos para mejor presentación
      rows = this.statisticsData.map(item => {
        const formattedItem = {...item};
        // Asegurar que la cantidad se muestre como número entero
        formattedItem.cantidad = item.cantidad;
        return formattedItem;
      });
      
      // Añadir fila de totales
      const totalEmpresas = rows.reduce((sum, row) => sum + row.cantidad, 0);
      const totalRow = {
        rubro: 'TOTAL',
        tipoEmpresa: '',
        ubicacion: '',
        cantidad: totalEmpresas,
        porcentaje: '100%'
      };
      rows.push(totalRow);
      
    } else if (reportType === 'income') {
      title = 'REPORTE FINANCIERO';
      subtitle = 'Análisis de ingresos, gastos y ganancias por período';
      
      // Siempre incluir la columna de mes con nombre mejorado
      columns.push({ header: 'Período', dataKey: 'mes' });
      
      // Añadir solo las columnas seleccionadas con nombres mejorados
      if (this.incomeOptions.ingresos) 
        columns.push({ header: 'Ingresos (S/.)', dataKey: 'ingresos' });
      if (this.incomeOptions.gastos) 
        columns.push({ header: 'Gastos (S/.)', dataKey: 'gastos' });
      if (this.incomeOptions.ganancia) {
        columns.push({ header: 'Ganancia (S/.)', dataKey: 'ganancia' });
        columns.push({ header: 'Margen', dataKey: 'margenBeneficio' });
      }
      
      // Formatear los datos para mejor presentación
      rows = this.incomeData.map(item => {
        const formattedItem = {...item};
        // Formatear valores monetarios
        formattedItem.ingresos = item.ingresos;
        formattedItem.gastos = item.gastos;
        formattedItem.ganancia = item.ganancia;
        return formattedItem;
      });
      
      // Añadir resumen si está seleccionado
      if (this.incomeOptions.resumen) {
        const totalIngresos = rows.reduce((sum, row) => sum + row.ingresos, 0);
        const totalGastos = rows.reduce((sum, row) => sum + row.gastos, 0);
        const totalGanancia = rows.reduce((sum, row) => sum + row.ganancia, 0);
        const margenPromedio = (totalGanancia / totalIngresos * 100).toFixed(2) + '%';
        
        // Añadir fila de totales
        rows.push({
          mes: 'TOTAL PERÍODO',
          ingresos: totalIngresos,
          gastos: totalGastos,
          ganancia: totalGanancia,
          margenBeneficio: margenPromedio
        });
      }
    }

    // Configurar documento con estilo profesional mejorado
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138); // Color azul corporativo
    
    // Añadir logo de la empresa con dimensiones corregidas para evitar estiramiento
    const img = new Image();
    img.src = this.logoUrl;
    
    // Función para continuar después de cargar el logo
    const generatePDF = () => {
      // Crear un encabezado con mejor alineación
      // Añadir logo en la esquina superior izquierda con proporciones correctas
      try {
        // Calcular proporciones correctas para el logo (mantener relación de aspecto)
        const logoWidth = 20; // Ancho fijo más pequeño
        const logoHeight = 15; // Alto proporcional
        
        // Posicionar el logo correctamente
        doc.addImage(img, 'PNG', 14, 10, logoWidth, logoHeight);
      } catch (error) {
        console.error('Error al cargar el logo:', error);
      }
      
      // Alinear el título y subtítulo para mejor presentación
      doc.text(title, doc.internal.pageSize.width / 2, 20, { align: 'center' });
      
      // Añadir subtítulo
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80); // Color gris oscuro
      doc.text(subtitle, doc.internal.pageSize.width / 2, 28, { align: 'center' });
      
      // Añadir información del reporte con mejor alineación
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100); // Color gris para la fecha
      
      // Formatear fecha con hora local
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      const horaFormateada = fechaActual.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      doc.text(`Fecha de generación: ${fechaFormateada}, ${horaFormateada}`, 14, 36);
      
      // Añadir información de la empresa alineada a la derecha
      doc.text('TEY - Plataforma de Constitución de Empresas', doc.internal.pageSize.width - 14, 36, { align: 'right' });
      doc.text('RUC: 20123456789', doc.internal.pageSize.width - 14, 41, { align: 'right' });
      
      // Crear tabla con estilo profesional mejorado y mejor alineación
      autoTable(doc, {
        startY: 46,
        head: [columns.map(col => col.header)],
        body: rows.map(row => columns.map(col => {
          // Formatear valores numéricos para mejor presentación
          if (col.dataKey === 'ingresos' || col.dataKey === 'gastos' || col.dataKey === 'ganancia') {
            return 'S/. ' + row[col.dataKey].toLocaleString('es-PE');
          }
          return row[col.dataKey];
        })),
        theme: 'grid',
        headStyles: {
          fillColor: [30, 58, 138],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        columnStyles: {
          0: { cellWidth: 40 }, // Primera columna más ancha
          1: { halign: 'left' },
          2: { halign: 'left' },
          3: { halign: 'center' },
          4: { halign: 'center' }
        },
        styles: {
          font: 'helvetica',
          fontSize: 9,
          cellPadding: 3,
          lineWidth: 0.1,
          lineColor: [80, 80, 80]
        },
        margin: { top: 46, right: 14, bottom: 25, left: 14 },
        didDrawPage: (data) => {
          // Añadir pie de página con mejor alineación
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          
          // Línea separadora para el pie de página
          doc.setDrawColor(200, 200, 200);
          doc.line(
            14, 
            doc.internal.pageSize.height - 15, 
            doc.internal.pageSize.width - 14, 
            doc.internal.pageSize.height - 15
          );
          
          doc.text(
            'TEY - Todos los derechos reservados ' + new Date().getFullYear(),
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
          
          // Añadir número de página
          doc.text(
            'Página ' + data.pageNumber + ' de ' + data.doc.internal.getNumberOfPages(),
            doc.internal.pageSize.width - 20,
            doc.internal.pageSize.height - 10
          );
        }
      });

      // Añadir sección de análisis si es reporte de ingresos y está seleccionado el resumen
      if (reportType === 'income' && this.incomeOptions.resumen) {
        const finalY = (doc as any).lastAutoTable.finalY || 150;
        
        if (finalY + 50 > doc.internal.pageSize.height - 20) {
          doc.addPage();
        } else {
          // Añadir línea separadora para la sección de análisis
          doc.setDrawColor(30, 58, 138);
          doc.setLineWidth(0.5);
          doc.line(14, finalY + 10, doc.internal.pageSize.width - 14, finalY + 10);
          
          doc.setFontSize(12);
          doc.setTextColor(30, 58, 138);
          doc.text('ANÁLISIS DE RENDIMIENTO', 14, finalY + 20);
          
          // Encontrar el mes de mayor ganancia
          const maxGanancia = Math.max(...this.incomeData.map(item => item.ganancia));
          const mesMayorGanancia = this.incomeData.find(item => item.ganancia === maxGanancia)?.mes;
          
          // Encontrar el mes de menor ganancia
          const minGanancia = Math.min(...this.incomeData.map(item => item.ganancia));
          const mesMenorGanancia = this.incomeData.find(item => item.ganancia === minGanancia)?.mes;
          
          doc.setFontSize(10);
          doc.setTextColor(80, 80, 80);
          doc.text('• Mes de mayor ganancia: ' + mesMayorGanancia + ' (S/. ' + maxGanancia.toLocaleString('es-PE') + ')', 20, finalY + 30);
          doc.text('• Mes de menor ganancia: ' + mesMenorGanancia + ' (S/. ' + minGanancia.toLocaleString('es-PE') + ')', 20, finalY + 37);
          
          const totalIngresos = this.incomeData.reduce((sum, item) => sum + item.ingresos, 0);
          const promedioIngresos = totalIngresos / this.incomeData.length;
          
          doc.text('• Promedio mensual de ingresos: S/. ' + promedioIngresos.toLocaleString('es-PE'), 20, finalY + 44);
          
          const totalGanancia = this.incomeData.reduce((sum, item) => sum + item.ganancia, 0);
          const margenPromedio = (totalGanancia / totalIngresos * 100).toFixed(2);
          
          doc.text('• Margen de beneficio promedio: ' + margenPromedio + '%', 20, finalY + 51);
        }
      }

      // Guardar archivo con nombre descriptivo y fecha
      const date = new Date().toISOString().slice(0, 10);
      doc.save(`TEY_${reportType === 'statistics' ? 'Estadisticas' : 'Financiero'}_${date}.pdf`);
    };

    // Intentar cargar el logo, si falla, continuar sin él
    img.onload = generatePDF;
    img.onerror = () => {
      console.warn('No se pudo cargar el logo, generando PDF sin logo');
      generatePDF();
    };
    
    // Si la imagen no se carga en 2 segundos, continuar sin ella
    setTimeout(() => {
      if (!img.complete) {
        console.warn('Tiempo de carga del logo excedido, generando PDF sin logo');
        generatePDF();
      }
    }, 2000);
  }
}