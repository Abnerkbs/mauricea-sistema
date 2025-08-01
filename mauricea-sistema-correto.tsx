import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Download, FileText, TrendingUp, Truck, Scale, MapPin, Clock, Trash2, AlertTriangle, BarChart3 } from 'lucide-react';

const MauriceaApp = () => {
  const [trips, setTrips] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [newTrip, setNewTrip] = useState({
    date: '',
    collectionTime: '',
    collectionWeight: '',
    originFarm: '',
    dischargeTime: '',
    dischargeWeight: '',
    destinationFarm: ''
  });

  // Sistema inicia limpo - sem dados mockados
  useEffect(() => {
    // Nenhum dado pré-carregado - sistema inicia vazio
    setTrips([]);
  }, []);

  // Atualizar newTrip quando selectedDate mudar
  useEffect(() => {
    setNewTrip({
      date: selectedDate,
      collectionTime: '',
      collectionWeight: '',
      originFarm: '',
      dischargeTime: '',
      dischargeWeight: '',
      destinationFarm: ''
    });
  }, [selectedDate]);

  const handleAddTrip = () => {
    // Validação dos campos obrigatórios
    if (!newTrip.collectionTime) {
      alert('Por favor, preencha o horário da coleta.');
      return;
    }
    
    if (!newTrip.collectionWeight || parseFloat(newTrip.collectionWeight) <= 0) {
      alert('Por favor, preencha um peso coletado válido (maior que zero).');
      return;
    }
    
    if (!newTrip.dischargeWeight || parseFloat(newTrip.dischargeWeight) <= 0) {
      alert('Por favor, preencha um peso descarregado válido (maior que zero).');
      return;
    }
    
    const collectionWeight = parseFloat(newTrip.collectionWeight);
    const dischargeWeight = parseFloat(newTrip.dischargeWeight);
    
    if (isNaN(collectionWeight) || isNaN(dischargeWeight)) {
      alert('Por favor, preencha valores numéricos válidos para os pesos.');
      return;
    }
    
    const trip = {
      id: Date.now(),
      ...newTrip,
      time: newTrip.collectionTime,
      collectionWeight: collectionWeight,
      dischargeWeight: dischargeWeight,
      collectionTicket: `T${Date.now().toString().slice(-6)}`
    };
    
    setTrips([...trips, trip]);
    setNewTrip({
      date: selectedDate,
      collectionTime: '',
      collectionWeight: '',
      originFarm: '',
      dischargeTime: '',
      dischargeWeight: '',
      destinationFarm: ''
    });
    setShowAddTrip(false);
    alert('Viagem adicionada com sucesso!');
  };

  const getDayData = (date) => {
    const dayTrips = trips.filter(trip => trip.date === date);
    const totalCollection = dayTrips.reduce((sum, trip) => sum + (trip.collectionWeight || 0), 0);
    const totalDischarge = dayTrips.reduce((sum, trip) => sum + (trip.dischargeWeight || 0), 0);
    const difference = totalCollection - totalDischarge;
    
    return {
      trips: dayTrips,
      totalCollection,
      totalDischarge,
      difference,
      tripCount: dayTrips.length
    };
  };

  const getMonthData = (month) => {
    const monthTrips = trips.filter(trip => trip.date.startsWith(month));
    const dailyData = {};
    
    monthTrips.forEach(trip => {
      const day = trip.date;
      if (!dailyData[day]) {
        dailyData[day] = { collection: 0, discharge: 0, count: 0 };
      }
      dailyData[day].collection += (trip.collectionWeight || 0);
      dailyData[day].discharge += (trip.dischargeWeight || 0);
      dailyData[day].count += 1;
    });

    return dailyData;
  };

  const generatePDF = () => {
    try {
      console.log('Iniciando geração de PDF...');
      
      // Verificar se há dados para gerar o relatório
      if (viewMode === 'daily' && selectedDayData.tripCount === 0) {
        alert('Não há viagens registradas para esta data. Adicione viagens antes de gerar o relatório.');
        return;
      }
      
      if (viewMode === 'monthly' && Object.keys(monthData).length === 0) {
        alert('Não há viagens registradas para este mês. Adicione viagens antes de gerar o relatório.');
        return;
      }
      
      let content = '';
      let title = '';
      
      if (viewMode === 'daily') {
        const dayData = getDayData(selectedDate);
        title = `Relatório Diário - ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}`;
        
        content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333; 
            line-height: 1.4; 
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #dc2626; 
            padding-bottom: 20px; 
        }
        .company-name { 
            color: #dc2626; 
            font-size: 28px; 
            font-weight: bold; 
            margin: 0; 
        }
        .report-title { 
            color: #ea580c; 
            font-size: 20px; 
            margin: 10px 0; 
        }
        .date { 
            color: #666; 
            font-size: 16px; 
        }
        .summary { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 20px; 
            margin: 30px 0; 
        }
        .summary-card { 
            background: linear-gradient(135deg, #dc2626, #ea580c); 
            color: white; 
            padding: 20px; 
            border-radius: 10px; 
            text-align: center; 
        }
        .summary-card h3 { 
            margin: 0 0 10px 0; 
            font-size: 16px; 
        }
        .summary-card .value { 
            font-size: 28px; 
            font-weight: bold; 
            margin: 0; 
        }
        .trips-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
        }
        .trips-table th, .trips-table td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
        }
        .trips-table th { 
            background: #dc2626; 
            color: white; 
        }
        .trips-table tr:nth-child(even) { 
            background: #f9f9f9; 
        }
        .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
            border-top: 1px solid #ddd; 
            padding-top: 20px; 
        }
        @media print { 
            body { margin: 0; } 
            @page { margin: 1cm; } 
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">MAURICEA ALIMENTOS</h1>
        <h2 class="report-title">Relatório Diário de Coleta de Sobras de Ração</h2>
        <p class="date">${new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>Total de Viagens</h3>
            <p class="value">${dayData.tripCount}</p>
        </div>
        <div class="summary-card">
            <h3>Total Coletado</h3>
            <p class="value">${dayData.totalCollection.toLocaleString()} kg</p>
        </div>
        <div class="summary-card">
            <h3>Total Descarregado</h3>
            <p class="value">${dayData.totalDischarge.toLocaleString()} kg</p>
        </div>
        <div class="summary-card">
            <h3>Diferença Total</h3>
            <p class="value">${dayData.difference.toLocaleString()} kg</p>
        </div>
    </div>

    <h3>Detalhes das Viagens</h3>
    <table class="trips-table">
        <thead>
            <tr>
                <th>Horário Coleta</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Horário Descarga</th>
                <th>Coletado (kg)</th>
                <th>Descarregado (kg)</th>
                <th>Diferença (kg)</th>
            </tr>
        </thead>
        <tbody>
            ${dayData.trips.map((trip, index) => `
                <tr>
                    <td>${trip.collectionTime || trip.time || '-'}</td>
                    <td>${trip.originFarm || '-'}</td>
                    <td>${trip.destinationFarm || '-'}</td>
                    <td>${trip.dischargeTime || '-'}</td>
                    <td style="text-align: right;">${trip.collectionWeight.toLocaleString()}</td>
                    <td style="text-align: right;">${trip.dischargeWeight.toLocaleString()}</td>
                    <td style="text-align: right; font-weight: bold; color: ${trip.collectionWeight - trip.dischargeWeight >= 0 ? '#16a34a' : '#dc2626'};">
                        ${(trip.collectionWeight - trip.dischargeWeight).toLocaleString()}
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="footer">
        <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')}</p>
        <p>Sistema de Controle de Coleta de Sobras de Ração - Mauricea Alimentos</p>
    </div>

    <script>
        // Auto print quando a página carregar
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.print();
            }, 500);
        });
        
        // Fallback se o evento load não funcionar
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                window.print();
            }, 1000);
        });
    </script>
</body>
</html>
        `;
      } else {
        // Relatório mensal
        const monthData = getMonthData(selectedMonth);
        title = `Relatório Mensal - ${new Date(selectedMonth + '-01T00:00:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
        
        let totalCollection = 0;
        let totalDischarge = 0;
        let totalTrips = 0;
        
        Object.values(monthData).forEach(day => {
          totalCollection += day.collection;
          totalDischarge += day.discharge;
          totalTrips += day.count;
        });
        
        content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333; 
            line-height: 1.4; 
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #dc2626; 
            padding-bottom: 20px; 
        }
        .company-name { 
            color: #dc2626; 
            font-size: 28px; 
            font-weight: bold; 
            margin: 0; 
        }
        .report-title { 
            color: #ea580c; 
            font-size: 20px; 
            margin: 10px 0; 
        }
        .date { 
            color: #666; 
            font-size: 16px; 
        }
        .summary { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 20px; 
            margin: 30px 0; 
        }
        .summary-card { 
            background: linear-gradient(135deg, #dc2626, #ea580c); 
            color: white; 
            padding: 20px; 
            border-radius: 10px; 
            text-align: center; 
        }
        .summary-card h3 { 
            margin: 0 0 10px 0; 
            font-size: 16px; 
        }
        .summary-card .value { 
            font-size: 28px; 
            font-weight: bold; 
            margin: 0; 
        }
        .daily-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
        }
        .daily-table th, .daily-table td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: center; 
        }
        .daily-table th { 
            background: #dc2626; 
            color: white; 
        }
        .daily-table tr:nth-child(even) { 
            background: #f9f9f9; 
        }
        .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
            border-top: 1px solid #ddd; 
            padding-top: 20px; 
        }
        @media print { 
            body { margin: 0; } 
            @page { margin: 1cm; } 
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">MAURICEA ALIMENTOS</h1>
        <h2 class="report-title">Relatório Mensal de Coleta de Sobras de Ração</h2>
        <p class="date">${new Date(selectedMonth + '-01T00:00:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>Total de Viagens</h3>
            <p class="value">${totalTrips}</p>
        </div>
        <div class="summary-card">
            <h3>Total Coletado</h3>
            <p class="value">${totalCollection.toLocaleString()} kg</p>
        </div>
        <div class="summary-card">
            <h3>Total Descarregado</h3>
            <p class="value">${totalDischarge.toLocaleString()} kg</p>
        </div>
        <div class="summary-card">
            <h3>Diferença Total</h3>
            <p class="value">${(totalCollection - totalDischarge).toLocaleString()} kg</p>
        </div>
    </div>

    <h3>Dados Diários do Mês</h3>
    <table class="daily-table">
        <thead>
            <tr>
                <th>Data</th>
                <th>Viagens</th>
                <th>Coletado (kg)</th>
                <th>Descarregado (kg)</th>
                <th>Diferença (kg)</th>
            </tr>
        </thead>
        <tbody>
            ${Object.entries(monthData).map(([date, day], index) => `
                <tr>
                    <td>${new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                    <td>${day.count}</td>
                    <td>${day.collection.toLocaleString()}</td>
                    <td>${day.discharge.toLocaleString()}</td>
                    <td style="font-weight: bold; color: ${day.collection - day.discharge >= 0 ? '#16a34a' : '#dc2626'};">
                        ${(day.collection - day.discharge).toLocaleString()}
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="footer">
        <p>Relatório gerado em ${new Date().toLocaleString('pt-BR')}</p>
        <p>Sistema de Controle de Coleta de Sobras de Ração - Mauricea Alimentos</p>
    </div>

    <script>
        // Auto print quando a página carregar
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.print();
            }, 500);
        });
        
        // Fallback se o evento load não funcionar
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                window.print();
            }, 1000);
        });
    </script>
</body>
</html>
        `;
      }

      console.log('Tentando abrir nova janela...');
      
      // Tentar abrir nova janela
      const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (printWindow) {
        console.log('Janela aberta com sucesso, escrevendo conteúdo...');
        printWindow.document.open();
        printWindow.document.write(content);
        printWindow.document.close();
        
        // Focar na nova janela
        printWindow.focus();
        
        alert('✅ Relatório aberto em nova janela!\n\n📄 Para salvar como PDF:\n1. Pressione Ctrl+P (ou Cmd+P no Mac)\n2. Escolha "Salvar como PDF"\n3. Clique em "Salvar"');
      } else {
        console.log('Falha ao abrir janela, tentando fallback...');
        // Fallback: criar blob e download
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('⚠️ Pop-ups podem estar bloqueados!\n\n📥 O arquivo HTML foi baixado.\n📄 Abra o arquivo e use Ctrl+P para salvar como PDF.');
      }
      
    } catch (error) {
      console.error('Erro completo ao gerar PDF:', error);
      alert(`❌ Erro ao gerar PDF: ${error.message}\n\nTente novamente ou verifique se pop-ups estão permitidos.`);
    }
  };

  const deleteDayTrips = () => {
    const updatedTrips = trips.filter(trip => trip.date !== selectedDate);
    setTrips(updatedTrips);
    setShowDeleteConfirm(false);
    alert(`Todas as viagens do dia ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')} foram excluídas.`);
  };

  const deleteTrip = (tripId) => {
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    setTrips(updatedTrips);
    alert('Viagem excluída com sucesso!');
  };

  const selectedDayData = getDayData(selectedDate);
  const monthData = getMonthData(selectedMonth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <header className="bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Truck className="h-6 w-6 sm:h-8 sm:w-8" />
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold">Mauricea Alimentos</h1>
                <p className="text-red-100 text-sm sm:text-base">Sistema de Coleta de Sobras de Ração</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddTrip(true)}
              className="bg-white text-red-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg flex items-center space-x-2 hover:bg-red-50 transition-colors text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Nova Viagem</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-md border-b-2 border-orange-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 rounded-lg ${
                viewMode === 'calendar' ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Calendário</span>
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 rounded-lg ${
                viewMode === 'daily' ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Relatório Diário</span>
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 rounded-lg ${
                viewMode === 'monthly' ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Relatório Mensal</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Calendário de Coletas</h2>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    />
                    {selectedDayData.tripCount > 0 && (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full sm:w-auto bg-red-600 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 hover:bg-red-700 transition-colors text-sm"
                        title="Excluir todas as viagens do dia"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Excluir Dia</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-xs sm:text-sm">Viagens</p>
                        <p className="text-xl sm:text-2xl font-bold">{selectedDayData.tripCount}</p>
                      </div>
                      <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-red-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-xs sm:text-sm">Coletado (kg)</p>
                        <p className="text-xl sm:text-2xl font-bold">{selectedDayData.totalCollection.toLocaleString()}</p>
                      </div>
                      <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-xs sm:text-sm">Descarregado (kg)</p>
                        <p className="text-xl sm:text-2xl font-bold">{selectedDayData.totalDischarge.toLocaleString()}</p>
                      </div>
                      <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
                    </div>
                  </div>
                  
                  <div className={`p-3 sm:p-4 rounded-lg text-white ${selectedDayData.difference >= 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-opacity-80 text-xs sm:text-sm">Diferença (kg)</p>
                        <p className="text-xl sm:text-2xl font-bold">{selectedDayData.difference.toLocaleString()}</p>
                      </div>
                      <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white text-opacity-60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Viagens do Dia</h3>
                {selectedDayData.tripCount > 0 && (
                  <span className="text-xs sm:text-sm text-gray-500">{selectedDayData.tripCount} viagem(ns)</span>
                )}
              </div>
              <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                {selectedDayData.trips.map((trip) => (
                  <div key={trip.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {trip.time}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm font-medium text-red-600">#{trip.collectionTicket}</span>
                        <button
                          onClick={() => deleteTrip(trip.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Excluir viagem"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">De: </span>
                        <span className="font-medium truncate">{trip.originFarm}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">Para: </span>
                        <span className="font-medium truncate">{trip.destinationFarm}</span>
                      </div>
                      <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
                        <span className="text-green-600 text-xs sm:text-sm">+{trip.collectionWeight}kg</span>
                        <span className="text-red-600 text-xs sm:text-sm">-{trip.dischargeWeight}kg</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {selectedDayData.trips.length === 0 && (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <Truck className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm sm:text-base">Nenhuma viagem registrada para este dia</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'daily' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Relatório Diário - {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 text-sm"
                />
                <button
                  onClick={generatePDF}
                  className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 text-sm"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Exportar PDF</span>
                </button>
              </div>
            </div>

            {/* Mostrar resumo do dia selecionado */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Resumo do Dia - {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                </h3>
                <span className="text-xs sm:text-sm text-gray-500">
                  {selectedDayData.tripCount} viagem(ns) registrada(s)
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-xs sm:text-sm">Viagens</p>
                      <p className="text-xl sm:text-2xl font-bold">{selectedDayData.tripCount}</p>
                    </div>
                    <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-red-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-xs sm:text-sm">Coletado (kg)</p>
                      <p className="text-xl sm:text-2xl font-bold">{selectedDayData.totalCollection.toLocaleString()}</p>
                    </div>
                    <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-xs sm:text-sm">Descarregado (kg)</p>
                      <p className="text-xl sm:text-2xl font-bold">{selectedDayData.totalDischarge.toLocaleString()}</p>
                    </div>
                    <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
                  </div>
                </div>
                
                <div className={`p-3 sm:p-4 rounded-lg text-white ${selectedDayData.difference >= 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-opacity-80 text-xs sm:text-sm">Diferença (kg)</p>
                      <p className="text-xl sm:text-2xl font-bold">{selectedDayData.difference.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white text-opacity-60" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Peso por Viagem</h3>
              {selectedDayData.trips.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {selectedDayData.trips.map((trip, index) => (
                    <div key={trip.id} className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Viagem {index + 1} - {trip.time}</span>
                        <span>{trip.collectionWeight}kg / {trip.dischargeWeight}kg</span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <div className="bg-gray-200 rounded-full h-2 sm:h-3">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2 sm:h-3 rounded-full"
                              style={{ width: `${(() => {
                                if (selectedDayData.trips.length === 0) return 0;
                                const maxCollection = Math.max(...selectedDayData.trips.map(t => t.collectionWeight || 0));
                                return maxCollection > 0 ? (trip.collectionWeight / maxCollection) * 100 : 0;
                              })()}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-200 rounded-full h-2 sm:h-3">
                            <div 
                              className="bg-gradient-to-r from-red-500 to-red-600 h-2 sm:h-3 rounded-full"
                              style={{ width: `${(() => {
                                if (selectedDayData.trips.length === 0) return 0;
                                const maxDischarge = Math.max(...selectedDayData.trips.map(t => t.dischargeWeight || 0));
                                return maxDischarge > 0 ? (trip.dischargeWeight / maxDischarge) * 100 : 0;
                              })()}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm sm:text-base">Nenhuma viagem registrada para {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                  <p className="text-xs text-gray-400 mt-1">Selecione outra data ou adicione uma nova viagem</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Detalhes das Viagens</h3>
              {selectedDayData.trips.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Horário Coleta</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Origem</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Destino</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Horário Descarga</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-right">Coletado</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-right">Descarregado</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-right">Diferença</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDayData.trips.map((trip) => (
                        <tr key={trip.id} className="border-t border-gray-200">
                          <td className="px-2 sm:px-4 py-2 sm:py-3">{trip.collectionTime || trip.time}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 truncate max-w-24 sm:max-w-none">{trip.originFarm}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 truncate max-w-24 sm:max-w-none">{trip.destinationFarm}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">{trip.dischargeTime || '-'}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">{trip.collectionWeight.toLocaleString()}kg</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-right">{trip.dischargeWeight.toLocaleString()}kg</td>
                          <td className={`px-2 sm:px-4 py-2 sm:py-3 text-right font-medium ${trip.collectionWeight - trip.dischargeWeight >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(trip.collectionWeight - trip.dischargeWeight).toLocaleString()}kg
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                            <button
                              onClick={() => deleteTrip(trip.id)}
                              className="text-red-500 hover:text-red-700 p-1 sm:p-2 rounded-full hover:bg-red-50 transition-colors"
                              title="Excluir viagem"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm sm:text-base">Nenhuma viagem para exibir em {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                  <p className="text-xs text-gray-400 mt-1">Os dados aparecerão aqui quando houver viagens registradas</p>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'monthly' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Relatório Mensal</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 text-sm"
                />
                <button
                  onClick={generatePDF}
                  className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 text-sm"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Exportar PDF</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Coleta vs Descarga por Dia</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Object.entries(monthData).map(([date, data]) => (
                  <div key={date} className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>{new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                      <span>{data.count} viagem(ns)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Coletado</span>
                          <span>{data.collection.toLocaleString()}kg</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                            style={{ width: `${(() => {
                              if (Object.keys(monthData).length === 0) return 0;
                              const maxCollection = Math.max(...Object.values(monthData).map(d => d.collection || 0));
                              return maxCollection > 0 ? (data.collection / maxCollection) * 100 : 0;
                            })()}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Descarregado</span>
                          <span>{data.discharge.toLocaleString()}kg</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                            style={{ width: `${(() => {
                              if (Object.keys(monthData).length === 0) return 0;
                              const maxDischarge = Math.max(...Object.values(monthData).map(d => d.discharge || 0));
                              return maxDischarge > 0 ? (data.discharge / maxDischarge) * 100 : 0;
                            })()}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Nova Viagem</h2>
                <button
                  onClick={() => setShowAddTrip(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <input
                    type="date"
                    value={newTrip.date}
                    onChange={(e) => setNewTrip({...newTrip, date: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário da Coleta *</label>
                  <input
                    type="time"
                    value={newTrip.collectionTime}
                    onChange={(e) => setNewTrip({...newTrip, collectionTime: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Peso Coletado (kg) *</label>
                  <input
                    type="number"
                    value={newTrip.collectionWeight}
                    onChange={(e) => setNewTrip({...newTrip, collectionWeight: e.target.value})}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Granja de Origem</label>
                  <input
                    type="text"
                    value={newTrip.originFarm}
                    onChange={(e) => setNewTrip({...newTrip, originFarm: e.target.value})}
                    placeholder="Nome da granja"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário da Descarga</label>
                  <input
                    type="time"
                    value={newTrip.dischargeTime}
                    onChange={(e) => setNewTrip({...newTrip, dischargeTime: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Peso Descarregado (kg) *</label>
                  <input
                    type="number"
                    value={newTrip.dischargeWeight}
                    onChange={(e) => setNewTrip({...newTrip, dischargeWeight: e.target.value})}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Granja de Destino</label>
                  <input
                    type="text"
                    value={newTrip.destinationFarm}
                    onChange={(e) => setNewTrip({...newTrip, destinationFarm: e.target.value})}
                    placeholder="Nome da granja"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs sm:text-sm text-orange-800">
                  <strong>Campos obrigatórios:</strong> Horário da Coleta, Peso Coletado e Peso Descarregado
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                <button
                  onClick={() => setShowAddTrip(false)}
                  className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddTrip}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Salvar Viagem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Esta ação não pode ser desfeita.</p>
                </div>
              </div>
              
              <div className="mb-4 sm:mb-6">
                <p className="text-sm text-gray-700">
                  Deseja realmente excluir todas as <strong>{selectedDayData.tripCount} viagem(ns)</strong> do dia{' '}
                  <strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</strong>?
                </p>
                
                <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-xs sm:text-sm text-red-800">
                    <p><strong>Dados que serão perdidos:</strong></p>
                    <ul className="mt-2 space-y-1">
                      <li>• {selectedDayData.tripCount} viagem(ns)</li>
                      <li>• {selectedDayData.totalCollection.toLocaleString()} kg coletados</li>
                      <li>• {selectedDayData.totalDischarge.toLocaleString()} kg descarregados</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={deleteDayTrips}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Excluir Tudo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MauriceaApp;