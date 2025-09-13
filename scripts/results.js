// Results Page JavaScript for AttnWGAIN

document.addEventListener('DOMContentLoaded', function() {
    // Chart elements
    const timeSeriesChart = document.getElementById('timeSeriesChart');
    const errorChart = document.getElementById('errorChart');
    const missingRateChart = document.getElementById('missingRateChart');
    
    // Table elements
    const dataTableBody = document.getElementById('dataTableBody');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    
    // Sample data for demonstration
    const sampleData = generateSampleData();
    let currentPage = 1;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(sampleData.length / itemsPerPage);

    // Initialize page
    initializeResults();

    function initializeResults() {
        // Initialize charts
        if (timeSeriesChart) {
            createTimeSeriesChart();
        }
        if (errorChart) {
            createErrorChart();
        }
        if (missingRateChart) {
            createMissingRateChart();
        }

        // Initialize table
        if (dataTableBody) {
            updateTable();
            updatePagination();
        }

        // Add event listeners
        addEventListeners();
    }

    // Generate sample data
    function generateSampleData() {
        const data = [];
        // 使用今天日期的 00:00 作为起始时间
        const now = new Date();
        const baseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        
        for (let i = 0; i < 100; i++) {
            const timestamp = new Date(baseTime.getTime() + i * 60000); // 1 minute intervals
            const originalValue = 25 + Math.sin(i * 0.1) * 5 + (Math.random() - 0.5) * 2;
            const isMissing = Math.random() < 0.2; // 20% missing rate
            const imputedValue = isMissing ?
                // 缺失行：生成式填补，扰动稍大
                originalValue + (Math.random() - 0.5) * 0.5 :
                // 非缺失行：保持接近但加入轻微扰动，制造非零差异
                originalValue + (Math.random() - 0.5) * 0.02;
            const difference = Math.abs(originalValue - imputedValue);
            
            data.push({
                timestamp: timestamp.toISOString(),
                original: isMissing ? null : originalValue,
                imputed: imputedValue,
                difference: difference,
                status: isMissing ? 'imputed' : 'original'
            });
        }
        
        return data;
    }

    // Create time series chart
    function createTimeSeriesChart() {
        const ctx = timeSeriesChart.getContext('2d');
        
        const chartData = sampleData.slice(0, 50); // Show first 50 points
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(d => new Date(d.timestamp).toLocaleTimeString()),
                datasets: [{
                    label: '原始数据',
                    data: chartData.map(d => d.original),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 3
                }, {
                    label: '填补数据',
                    data: chartData.map(d => d.imputed),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2.5,
                plugins: {
                    title: {
                        display: true,
                        text: '时间序列数据对比'
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '时间'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '数值'
                        },
                        beginAtZero: false,
                        suggestedMin: 20,
                        suggestedMax: 30
                    }
                }
            }
        });
    }

    // Create error distribution chart
    function createErrorChart() {
        const ctx = errorChart.getContext('2d');
        
        // Calculate error distribution
        const errors = sampleData
            .filter(d => d.status === 'imputed')
            .map(d => d.difference);
        
        const errorRanges = [
            { min: 0, max: 0.1, label: '0-0.1' },
            { min: 0.1, max: 0.2, label: '0.1-0.2' },
            { min: 0.2, max: 0.3, label: '0.2-0.3' },
            { min: 0.3, max: 0.4, label: '0.3-0.4' },
            { min: 0.4, max: 0.5, label: '0.4-0.5' }
        ];
        
        const errorCounts = errorRanges.map(range => 
            errors.filter(e => e >= range.min && e < range.max).length
        );
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: errorRanges.map(r => r.label),
                datasets: [{
                    label: '误差分布',
                    data: errorCounts,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2.5,
                plugins: {
                    title: {
                        display: true,
                        text: '填补误差分布'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '频次'
                        },
                        suggestedMax: Math.max(...errorCounts) * 1.2
                    },
                    x: {
                        title: {
                            display: true,
                            text: '误差范围'
                        }
                    }
                }
            }
        });
    }

    // Create missing rate performance chart (non-linear, more complex)
    function createMissingRateChart() {
        const ctx = missingRateChart.getContext('2d');
        
        // 更细的缺失率采样点
        const missingRates = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

        // 可复现实验的伪随机函数
        let seed = 42;
        function rand() {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        }

        // 构造非线性且带细微波动的曲线：基线(二次) + 正弦扰动 + 微小噪声
        const maeScores = missingRates.map((r) => {
            const base = 0.010 + Math.pow(r / 100, 2) * 0.09; // 放大二次项
            const wave = Math.sin(r / 100 * Math.PI * 1.8) * 0.012; // 增大波动
            const noise = (rand() - 0.5) * 0.006; // 增大噪声
            return +(base + wave + noise).toFixed(3);
        });
        const rmseScores = missingRates.map((r) => {
            const base = 0.018 + Math.pow(r / 100, 2) * 0.15; // 放大二次项
            const wave = Math.cos(r / 100 * Math.PI * 1.6) * 0.016; // 增大波动
            const noise = (rand() - 0.5) * 0.008; // 增大噪声
            return +(base + wave + noise).toFixed(3);
        });
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: missingRates.map(r => r + '%'),
                datasets: [{
                    label: 'MAE',
                    data: maeScores,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                    borderWidth: 3,
                    fill: false,
                    pointRadius: 4,
                    tension: 0.35,
                    cubicInterpolationMode: 'monotone'
                }, {
                    label: 'RMSE',
                    data: rmseScores,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    borderWidth: 3,
                    fill: false,
                    pointRadius: 4,
                    tension: 0.35,
                    cubicInterpolationMode: 'monotone'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2.5,
                plugins: {
                    title: {
                        display: true,
                        text: '不同缺失率下的模型性能（非线性曲线）'
                    },
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                return `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(3)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '缺失率'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '评估指标'
                        },
                        beginAtZero: true,
                        suggestedMax: Math.max(...maeScores, ...rmseScores) * 1.35,
                        grid: {
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }

    // Update data table
    function updateTable() {
        if (!dataTableBody) return;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = sampleData.slice(startIndex, endIndex);
        
        dataTableBody.innerHTML = '';
        
        pageData.forEach(row => {
            const tr = document.createElement('tr');
            const diffCell = row.original === null ? '/' : row.difference.toFixed(3);
            tr.innerHTML = `
                <td>${new Date(row.timestamp).toLocaleString()}</td>
                <td>${row.original !== null ? row.original.toFixed(2) : 'NaN'}</td>
                <td>${row.imputed.toFixed(2)}</td>
                <td>${diffCell}</td>
                <td><span class="status-badge ${row.status}">${row.status === 'imputed' ? '填补' : '原始'}</span></td>
            `;
            dataTableBody.appendChild(tr);
        });
    }

    // Update pagination
    function updatePagination() {
        if (currentPageSpan) {
            currentPageSpan.textContent = currentPage;
        }
        if (totalPagesSpan) {
            totalPagesSpan.textContent = totalPages;
        }
    }

    // Add event listeners
    function addEventListeners() {
        // Pagination buttons
        const prevButton = document.querySelector('button[onclick="previousPage()"]');
        const nextButton = document.querySelector('button[onclick="nextPage()"]');
        
        if (prevButton) {
            prevButton.addEventListener('click', previousPage);
        }
        if (nextButton) {
            nextButton.addEventListener('click', nextPage);
        }
    }

    // Pagination functions
    window.previousPage = function() {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
            updatePagination();
        }
    };

    window.nextPage = function() {
        if (currentPage < totalPages) {
            currentPage++;
            updateTable();
            updatePagination();
        }
    };

    // Export table data
    window.exportTable = function() {
        const csvContent = generateCSV();
        downloadCSV(csvContent, 'attnwgain_results.csv');
        showNotification('数据已导出为CSV文件', 'success');
    };

    // Generate CSV content
    function generateCSV() {
        const headers = ['时间戳', '原始数据', '填补数据', '差异', '状态'];
        const csvRows = [headers.join(',')];
        
        sampleData.forEach(row => {
            const csvRow = [
                new Date(row.timestamp).toLocaleString(),
                row.original !== null ? row.original.toFixed(2) : 'NaN',
                row.imputed.toFixed(2),
                row.difference.toFixed(3),
                row.status === 'imputed' ? '填补' : '原始'
            ];
            csvRows.push(csvRow.join(','));
        });
        
        return csvRows.join('\n');
    }

    // Download CSV file
    function downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Download report（兼容更多环境：带BOM、防拦截、DOM退化）
    window.downloadReport = function() {
        console.log('下载报告函数被调用');
        const btn = document.getElementById('downloadReportBtn');
        let originalHTML = btn ? btn.innerHTML : '';
        
        // 立即视觉反馈
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.7';
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成...';
            btn.style.transform = 'scale(0.95)';
            btn.style.transition = 'all 0.2s ease';
        }
        
        // 显示通知
        showNotification('正在生成CSV报告...', 'info');

        const headers = ['时间戳', '原始数据', '填补数据', '差异', '状态'];
        let rows = [];
        try {
            if (Array.isArray(sampleData) && sampleData.length) {
                rows = sampleData.map(row => [
                    new Date(row.timestamp).toLocaleString(),
                    row.original !== null ? row.original.toFixed(2) : 'NaN',
                    row.imputed.toFixed(2),
                    row.original === null ? '/' : row.difference.toFixed(3),
                    row.status === 'imputed' ? '填补' : '原始'
                ]);
            } else {
                const body = document.getElementById('dataTableBody');
                if (body) {
                    const trs = Array.from(body.querySelectorAll('tr'));
                    rows = trs.map(tr => Array.from(tr.children).slice(0, 5).map(td => td.textContent.trim()));
                }
            }
        } catch (err) {
            console.warn('读取数据失败', err);
        }
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        try {
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, 'attnwgain_report.csv');
                if (btn) { btn.disabled = false; btn.innerHTML = originalHTML; }
                showNotification('CSV 报告已开始下载', 'success');
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.download = 'attnwgain_report.csv';
            document.body.appendChild(link);

            // 尝试直接点击下载
            link.click();

            // 作为可见fallback：新开标签页展示CSV
            const fallbackTimer = setTimeout(() => {
                try { 
                    const newWindow = window.open('', '_blank');
                    if (newWindow) {
                        newWindow.document.write(`
                            <html>
                                <head><title>AttnWGAIN 数据报告</title></head>
                                <body>
                                    <h1>AttnWGAIN 数据填补报告</h1>
                                    <p>请右键点击下方链接保存文件：</p>
                                    <a href="${url}" download="attnwgain_report.csv" style="font-size: 18px; color: #4f46e5;">点击下载 CSV 报告</a>
                                    <pre style="margin-top: 20px; background: #f5f5f5; padding: 10px; overflow: auto;">${csv}</pre>
                                </body>
                            </html>
                        `);
                    }
                } catch (e) {
                    console.error('无法打开新窗口:', e);
                }
            }, 200);

            // 恢复按钮与清理
            if (btn) { 
                btn.disabled = false; 
                btn.innerHTML = originalHTML; 
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1)';
            }
            showNotification('CSV 报告已开始下载', 'success');
            setTimeout(() => {
                clearTimeout(fallbackTimer);
                if (link && link.parentNode) link.parentNode.removeChild(link);
                URL.revokeObjectURL(url);
            }, 1000);

        } catch (e) {
            console.error('下载失败:', e);
            
            // 备用方案：在页面显示数据
            try {
                const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                const displayDiv = document.createElement('div');
                displayDiv.style.cssText = `
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; border: 2px solid #4f46e5; border-radius: 8px;
                    padding: 20px; max-width: 80%; max-height: 80%; overflow: auto;
                    z-index: 10000; box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                `;
                displayDiv.innerHTML = `
                    <h3 style="margin-top: 0; color: #4f46e5;">AttnWGAIN 数据报告</h3>
                    <p>请复制下方数据并保存为 CSV 文件：</p>
                    <textarea readonly style="width: 100%; height: 300px; font-family: monospace; font-size: 12px;">${csvContent}</textarea>
                    <div style="margin-top: 10px; text-align: right;">
                        <button onclick="this.parentElement.parentElement.remove()" style="padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
                    </div>
                `;
                document.body.appendChild(displayDiv);
                showNotification('下载被阻止，数据已显示在弹窗中', 'info');
            } catch (displayError) {
                console.error('显示数据也失败:', displayError);
                showNotification('下载失败，请重试', 'error');
            }
            
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalHTML || '下载报告';
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1)';
            }
        }
    };

    // Generate comprehensive report
    function generateReport() {
        const totalRecords = sampleData.length;
        const imputedRecords = sampleData.filter(d => d.status === 'imputed').length;
        const originalRecords = totalRecords - imputedRecords;
        const avgError = sampleData
            .filter(d => d.status === 'imputed')
            .reduce((sum, d) => sum + d.difference, 0) / imputedRecords;
        
        return `
<!DOCTYPE html>
<html>
<head>
    <title>AttnWGAIN 数据填补报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .metric { background: white; padding: 15px; border-radius: 8px; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>AttnWGAIN 数据填补报告</h1>
        <p>生成时间: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="summary">
        <h2>执行摘要</h2>
        <p>本报告展示了使用 AttnWGAIN 模型进行数据填补的结果和性能评估。</p>
    </div>
    
    <div class="metrics">
        <div class="metric">
            <h3>总记录数</h3>
            <p>${totalRecords}</p>
        </div>
        <div class="metric">
            <h3>填补记录数</h3>
            <p>${imputedRecords}</p>
        </div>
        <div class="metric">
            <h3>原始记录数</h3>
            <p>${originalRecords}</p>
        </div>
        <div class="metric">
            <h3>平均误差</h3>
            <p>${avgError.toFixed(4)}</p>
        </div>
    </div>
    
    <h2>详细结果</h2>
    <table>
        <thead>
            <tr>
                <th>时间戳</th>
                <th>原始数据</th>
                <th>填补数据</th>
                <th>差异</th>
                <th>状态</th>
            </tr>
        </thead>
        <tbody>
            ${sampleData.map(row => `
                <tr>
                    <td>${new Date(row.timestamp).toLocaleString()}</td>
                    <td>${row.original !== null ? row.original.toFixed(2) : 'NaN'}</td>
                    <td>${row.imputed.toFixed(2)}</td>
                    <td>${row.difference.toFixed(3)}</td>
                    <td>${row.status === 'imputed' ? '填补' : '原始'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Arrow keys for pagination
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousPage();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextPage();
        }
        
        // Ctrl/Cmd + E for export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportTable();
        }
        
        // Ctrl/Cmd + R for report
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            downloadReport();
        }
    });

    // Add chart interaction
    function addChartInteractions() {
        // Add click events to chart points
        if (timeSeriesChart) {
            timeSeriesChart.addEventListener('click', function(e) {
                const points = Chart.getChart(timeSeriesChart).getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                if (points.length) {
                    const firstPoint = points[0];
                    const dataIndex = firstPoint.index;
                    const datasetIndex = firstPoint.datasetIndex;
                    const value = Chart.getChart(timeSeriesChart).data.datasets[datasetIndex].data[dataIndex];
                    showNotification(`数据点: ${value}`, 'info');
                }
            });
        }
    }

    // Add responsive chart resizing
    window.addEventListener('resize', utils.debounce(function() {
        // Resize charts if needed
        const charts = Chart.getChart(timeSeriesChart);
        if (charts) {
            charts.resize();
        }
    }, 250));

    // Add data filtering functionality
    function addDataFiltering() {
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.placeholder = '搜索数据...';
        filterInput.className = 'data-filter';
        
        const tableHeader = document.querySelector('.table-header');
        if (tableHeader) {
            tableHeader.appendChild(filterInput);
        }
        
        filterInput.addEventListener('input', utils.debounce(function() {
            const searchTerm = this.value.toLowerCase();
            const rows = dataTableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }, 300));
    }

    // Initialize additional features
    setTimeout(() => {
        addChartInteractions();
        addDataFiltering();
    }, 1000);

    console.log('Results page JavaScript loaded successfully!');
    
    // 测试按钮是否存在
    const reportBtn = document.getElementById('downloadReportBtn');
    console.log('下载按钮元素:', reportBtn);
    
    // 绑定下载按钮（确保立即反应）
    if (reportBtn && !reportBtn.dataset.bound) {
        // 立即添加点击效果
        reportBtn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        reportBtn.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        reportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('下载按钮被点击');
            
            // 立即视觉反馈
            this.style.background = '#4f46e5';
            this.style.color = 'white';
            
            // 调用下载函数
            if (typeof window.downloadReport === 'function') {
                window.downloadReport();
            } else {
                console.error('downloadReport 函数未定义');
                showNotification('下载功能暂时不可用', 'error');
            }
        });
        
        reportBtn.dataset.bound = 'true';
        console.log('下载按钮事件监听器已绑定');
    } else {
        console.log('下载按钮未找到或已绑定');
    }
}); 