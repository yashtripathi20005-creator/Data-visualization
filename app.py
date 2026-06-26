from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Generate sample data if not exists
def generate_sample_data():
    data_dir = 'data'
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    
    data_file = os.path.join(data_dir, 'sample_data.json')
    
    if not os.path.exists(data_file):
        # Generate dates for the last 30 days
        dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') 
                 for i in range(30, -1, -1)]
        
        # Generate random data
        np.random.seed(42)
        sales = np.random.randint(100, 500, size=len(dates))
        revenue = sales * np.random.uniform(10, 30, size=len(dates))
        customers = np.random.randint(20, 100, size=len(dates))
        
        # Categories data
        categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports']
        category_sales = np.random.randint(1000, 5000, size=len(categories))
        
        # Monthly data
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        monthly_sales = np.random.randint(500, 1500, size=len(months))
        monthly_revenue = monthly_sales * np.random.uniform(15, 25, size=len(months))
        
        data = {
            'daily': {
                'dates': dates,
                'sales': sales.tolist(),
                'revenue': revenue.tolist(),
                'customers': customers.tolist()
            },
            'categories': {
                'names': categories,
                'sales': category_sales.tolist()
            },
            'monthly': {
                'months': months,
                'sales': monthly_sales.tolist(),
                'revenue': monthly_revenue.tolist()
            }
        }
        
        with open(data_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        return data
    else:
        with open(data_file, 'r') as f:
            return json.load(f)

# Load data
data = generate_sample_data()

@app.route('/')
def index():
    """Render the dashboard homepage."""
    return render_template('index.html')

@app.route('/api/dashboard-data')
def get_dashboard_data():
    """API endpoint to get all dashboard data."""
    return jsonify(data)

@app.route('/api/daily-data')
def get_daily_data():
    """API endpoint to get daily data."""
    return jsonify(data['daily'])

@app.route('/api/category-data')
def get_category_data():
    """API endpoint to get category data."""
    return jsonify(data['categories'])

@app.route('/api/monthly-data')
def get_monthly_data():
    """API endpoint to get monthly data."""
    return jsonify(data['monthly'])

@app.route('/api/stats')
def get_stats():
    """API endpoint to get summary statistics."""
    daily = data['daily']
    stats = {
        'total_sales': sum(daily['sales']),
        'avg_revenue': round(sum(daily['revenue']) / len(daily['revenue']), 2),
        'total_customers': sum(daily['customers']),
        'peak_sales': max(daily['sales'])
    }
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
