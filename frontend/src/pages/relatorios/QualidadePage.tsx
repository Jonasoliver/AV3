import { useState, useEffect } from 'react';
import { http } from '../../api/client';
import { PageHeader } from '../../components/PageHeader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MetricaData {
  usuariosConcorrentes: number;
  latenciaMedia: number;
  tempoProcessamentoMedio: number;
  tempoRespostaMedio: number;
  totalRequests: number;
}

interface MetricasResponse {
  metricas: MetricaData[];
  metodologia: {
    descricao: string;
    calculo: {
      latencia: string;
      tempoProcessamento: string;
      tempoResposta: string;
    };
    cenarios: string;
    unidade: string;
  };
}

export default function QualidadePage() {
  const [dados, setDados] = useState<MetricasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarMetricas();
  }, []);

  async function carregarMetricas() {
    try {
      setLoading(true);
      const response = await http.get<MetricasResponse>('/metricas');
      setDados(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar métricas');
    } finally {
      setLoading(false);
    }
  }

  async function limparMetricas() {
    if (!confirm('Tem certeza que deseja limpar todas as métricas?')) return;
    try {
      await http.delete('/metricas');
      alert('Métricas limpas com sucesso!');
      carregarMetricas();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao limpar métricas');
    }
  }

  if (loading) return <div className="container"><p>Carregando métricas...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!dados || dados.metricas.length === 0) {
    return (
      <div className="container">
        <PageHeader title="Relatório de Qualidade" />
        <div className="empty-state">
          <p>Nenhuma métrica disponível ainda.</p>
          <p>Execute o script de testes de carga para gerar métricas.</p>
        </div>
      </div>
    );
  }

  const labels = dados.metricas.map(m => `${m.usuariosConcorrentes} usuário${m.usuariosConcorrentes > 1 ? 's' : ''}`);

  const latenciaData = {
    labels,
    datasets: [{
      label: 'Latência (ms)',
      data: dados.metricas.map(m => m.latenciaMedia),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  };

  const processingData = {
    labels,
    datasets: [{
      label: 'Tempo de Processamento (ms)',
      data: dados.metricas.map(m => m.tempoProcessamentoMedio),
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1
    }]
  };

  const responseData = {
    labels,
    datasets: [{
      label: 'Tempo de Resposta Total (ms)',
      data: dados.metricas.map(m => m.tempoRespostaMedio),
      backgroundColor: 'rgba(245, 158, 11, 0.7)',
      borderColor: 'rgb(245, 158, 11)',
      borderWidth: 1
    }]
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tempo (ms)'
        }
      }
    }
  };

  return (
    <div className="container">
      <PageHeader title="Relatório de Qualidade" />

      <div style={{ marginBottom: '2rem' }}>
        <button onClick={limparMetricas} className="btn-danger" style={{ marginRight: '1rem' }}>
          Limpar Métricas
        </button>
        <button onClick={carregarMetricas} className="btn">
          Atualizar
        </button>
      </div>

      <div className="quality-report">
        {/* Gráfico 1: Latência */}
        <div className="chart-container">
          <h3>1. Latência de Rede</h3>
          <div style={{ height: '300px' }}>
            <Bar data={latenciaData} options={chartOptions} />
          </div>
          <p className="chart-description">
            Atraso de rede (tempo para a requisição chegar ao servidor e a resposta retornar ao cliente)
          </p>
        </div>

        {/* Gráfico 2: Tempo de Processamento */}
        <div className="chart-container">
          <h3>2. Tempo de Processamento</h3>
          <div style={{ height: '300px' }}>
            <Bar data={processingData} options={chartOptions} />
          </div>
          <p className="chart-description">
            Tempo que o servidor leva para processar a requisição (cálculos, acesso ao BD, etc.)
          </p>
        </div>

        {/* Gráfico 3: Tempo de Resposta Total */}
        <div className="chart-container">
          <h3>3. Tempo de Resposta Total</h3>
          <div style={{ height: '300px' }}>
            <Bar data={responseData} options={chartOptions} />
          </div>
          <p className="chart-description">
            Soma da latência de rede com o tempo de processamento
          </p>
        </div>

        {/* Tabela de Dados */}
        <div className="metrics-table">
          <h3>Dados Detalhados</h3>
          <table>
            <thead>
              <tr>
                <th>Cenário</th>
                <th>Latência (ms)</th>
                <th>Processamento (ms)</th>
                <th>Resposta Total (ms)</th>
                <th>Total Requisições</th>
              </tr>
            </thead>
            <tbody>
              {dados.metricas.map((m, idx) => (
                <tr key={idx}>
                  <td>{m.usuariosConcorrentes} usuário{m.usuariosConcorrentes > 1 ? 's' : ''}</td>
                  <td>{m.latenciaMedia.toFixed(2)}</td>
                  <td>{m.tempoProcessamentoMedio.toFixed(2)}</td>
                  <td>{m.tempoRespostaMedio.toFixed(2)}</td>
                  <td>{m.totalRequests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Metodologia */}
        <div className="methodology">
          <h3>Metodologia de Coleta de Métricas</h3>
          
          <div className="methodology-section">
            <h4>Descrição Geral</h4>
            <p>{dados.metodologia.descricao}</p>
          </div>

          <div className="methodology-section">
            <h4>Cálculo das Métricas</h4>
            <ul>
              <li><strong>Latência:</strong> {dados.metodologia.calculo.latencia}</li>
              <li><strong>Tempo de Processamento:</strong> {dados.metodologia.calculo.tempoProcessamento}</li>
              <li><strong>Tempo de Resposta:</strong> {dados.metodologia.calculo.tempoResposta}</li>
            </ul>
          </div>

          <div className="methodology-section">
            <h4>Cenários de Teste</h4>
            <p>{dados.metodologia.cenarios}</p>
          </div>

          <div className="methodology-section">
            <h4>Unidade de Medida</h4>
            <p>{dados.metodologia.unidade}</p>
          </div>

          <div className="methodology-section">
            <h4>Implementação Técnica</h4>
            <p>
              Um middleware Express intercepta todas as requisições HTTP e registra timestamps em três pontos:
            </p>
            <ol>
              <li><strong>Request Received:</strong> Quando a requisição chega ao servidor</li>
              <li><strong>Processing Start:</strong> Quando o servidor inicia o processamento</li>
              <li><strong>Response Sent:</strong> Quando a resposta é enviada ao cliente</li>
            </ol>
            <p>
              As métricas são persistidas em uma tabela MySQL dedicada e agregadas por número de usuários concorrentes.
              Os testes de carga foram executados usando scripts Node.js que simulam requisições paralelas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
