from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from scipy.optimize import linprog
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans

app = Flask(__name__)
from flask_cors import CORS, cross_origin

CORS(app, supports_credentials=True)

@app.route('/api/optimize', methods=['POST'])
def optimize():
    try:
        data = request.json
        c = np.array(data['costs'])
        A = np.array(data['constraints'])
        b = np.array(data['resources'])
        res = linprog(c, A_ub=A, b_ub=b, method='highs')
        return jsonify({'optimal_expenses': res.x.tolist(), 'total_cost': res.fun})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/regression', methods=['POST'])
def regression():
    try:
        data = request.json
        X = np.array(data['independent_variables'])
        y = np.array(data['dependent_variable'])
        model = LinearRegression()
        model.fit(X, y)
        coefficients = model.coef_.tolist()
        intercept = model.intercept_.tolist()
        return jsonify({'coefficients': coefficients, 'intercept': intercept})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
