// Global variables
let dailyChart, categoryChart, monthlyChart, customerChart;
let currentData = null;

// Color palettes
const colors = {
    primary: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'],
    secondary: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    gradient: {
        blue: 'rgba(102, 126, 234, 0.2)',
        purple: 'rgba(118, 75, 162, 0.2)'
    }
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    fetchDashboardData();
});

// Fetch data from API
async function fetchDashboardData() {
    try {
        const response = await fetch('/api/dashboard-data');
        currentData = await response.json();
        
        // Update stats
        updateStats();
        
        // Create charts
        createDailyChart(currentData.daily);
        createCategoryChart(currentData.categories);
        createMonthlyChart(currentData.monthly);
        createCustomerChart(currentData.categories);
        
        // Update timestamp
        document.getElementById('updateTime').textContent = new Date().toLocaleString();
        
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load dashboard data. Please refresh the page.');
    }
}

// Update summary statistics
function updateStats() {
    fetch('/api/stats')
        .then(response => response.json())
        .then(stats => {
            document.getElementById('totalSales').textContent = stats.total_sales.toLocaleString();
            document.getElementById('avgRevenue').textContent = '$' + stats.avg_revenue.toLocaleString();
            document.getElementById('totalCustomers').textContent = stats.total_customers.toLocaleString();
            document.getElementById('peakSales').textContent = stats.peak_sales.toLocaleString();
        })
        .catch(error => console.error('Error fetching stats:', error));
}

// Chart 1: Daily Sales & Revenue (Line Chart)
function createDailyChart(data) {
    const ctx = document.getElementById('dailyChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (dailyChart) {
        dailyChart.destroy();
    }
    
    dailyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [
                {
                    label: 'Sales',
                    data: data.sales,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#667eea'
                },
                {
                    label: 'Revenue ($)',
                    data: data.revenue,
                    borderColor: '#43e97b',
                    backgroundColor: 'rgba(67, 233, 123, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#43e97b',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.parsed.y;
                            if (context.dataset.label.includes('Revenue')) {
                                label += ': $' + value.toFixed(2);
                            } else {
                                label += ': ' + value;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Sales Count'
                    }
                },
                y1: {
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 15
                    }
                }
            }
        }
    });
}

// Chart 2: Sales by Category (Bar Chart)
function createCategoryChart(data) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.names,
            datasets: [
                {
                    label: 'Sales by Category',
                    data: data.sales,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.7)',
                        'rgba(118, 75, 162, 0.7)',
                        'rgba(240, 147, 251, 0.7)',
                        'rgba(79, 172, 254, 0.7)',
                        'rgba(67, 233, 123, 0.7)'
                    ],
                    borderColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#4facfe',
                        '#43e97b'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    maxBarThickness: 60
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return 'Sales: ' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Sales Count'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Chart 3: Monthly Revenue Trend (Line Chart)
function createMonthlyChart(data) {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: [
                {
                    label: 'Monthly Sales',
                    data: data.sales,
                    borderColor: '#4facfe',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#4facfe',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                },
                {
                    label: 'Monthly Revenue ($)',
                    data: data.revenue,
                    borderColor: '#f093fb',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#f093fb',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            let value = context.parsed.y;
                            if (context.dataset.label.includes('Revenue')) {
                                label += ': $' + value.toFixed(2);
                            } else {
                                label += ': ' + value;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Sales Count'
                    }
                },
                y1: {
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Chart 4: Customer Distribution (Doughnut Chart)
function createCustomerChart(data) {
    const ctx = document.getElementById('customerChart').getContext('2d');
    
    if (customerChart) {
        customerChart.destroy();
    }
    
    // Generate random customer data based on category sales
    const customerData = data.sales.map(sales => Math.round(sales * 0.3 + Math.random() * 50));
    
    customerChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.names,
            datasets: [
                {
                    data: customerData,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(240, 147, 251, 0.8)',
                        'rgba(79, 172, 254, 0.8)',
                        'rgba(67, 233, 123, 0.8)'
                    ],
                    borderColor: '#fff',
                    borderWidth: 3,
                    hoverOffset: 15
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.parsed || 0;
                            let total = context.dataset.data.reduce((a, b) => a + b, 0);
                            let percentage = ((value / total) * 100).toFixed(1);
                            return label + ': ' + value + ' (' + percentage + '%)';
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Refresh data
function refreshData() {
    const btn = document.querySelector('.refresh-btn');
    btn.textContent = '🔄 Loading...';
    btn.disabled = true;
    
    fetchDashboardData().then(() => {
        btn.textContent = '🔄 Refresh Data';
        btn.disabled = false;
        // Show success feedback
        btn.style.background = '#43e97b';
        setTimeout(() => {
            btn.style.background = '';
        }, 2000);
    }).catch(error => {
        console.error('Error refreshing data:', error);
        btn.textContent = '🔄 Refresh Data';
        btn.disabled = false;
    });
}

// Handle window resize for better responsiveness
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Charts will auto-resize due to responsive: true
        console.log('Window resized - charts adjusted');
    }, 250);
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { fetchDashboardData, refreshData };
}
