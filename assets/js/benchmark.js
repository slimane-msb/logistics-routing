const data = {
    large: { algs: ['Two-Opt', 'NN+2Opt', 'Greedy', 'Lin-Kernighan', 'Metaheuristics'], 
             time: [43, 42, 44, 45, 45], dist: [106, 106, 114, 105, 355], subtitle: 'Runtime vs Distance for 77 Nodes' },
    small: { algs: ['Two-Opt', 'NN+2Opt', 'Greedy', 'Lin-Kernighan', 'Metaheuristics'], 
             time: [0.1, 0.1, 0.1, 0.1, 0.1], dist: [14, 14, 19, 12, 12], subtitle: 'Runtime vs Distance for Small Dataset' },
    optimal: { algs: ['Held-Karp', 'Lin-Kernighan'], time: [3, 3], dist: [43, 49], subtitle: 'Optimal Solutions Comparison' }
};

let chart = null;
const modal = document.getElementById('benchmarkModal');

document.getElementById('showBenchmarkBtn').onclick = () => {
    modal.classList.add('active');
    if (!chart) {
        chart = new Chart(document.getElementById('benchmarkChart'), {
            type: 'bar',
            data: { labels: data.large.algs, datasets: [
                { label: 'Runtime (s)', data: data.large.time, backgroundColor: '#4CAF50' },
                { label: 'Distance', data: data.large.dist, backgroundColor: '#FF9800' }
            ]},
            options: { responsive: true, maintainAspectRatio: true, scales: { y: { beginAtZero: true } },
                plugins: { subtitle: { display: true, text: data.large.subtitle, position: 'bottom', font: { size: 14, style: 'italic' } } }
            }
        });
    }
};

const closeModal = () => modal.classList.remove('active');
document.getElementById('closeModal').onclick = closeModal;
modal.onclick = (e) => { if (e.target === modal) closeModal(); };

function showBenchmark(dataset) {
    document.querySelectorAll('#benchmarkModal .btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    chart.data.labels = data[dataset].algs;
    chart.data.datasets[0].data = data[dataset].time;
    chart.data.datasets[1].data = data[dataset].dist;
    chart.options.plugins.subtitle.text = data[dataset].subtitle;
    chart.update();
}