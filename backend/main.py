from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, auth
import yfinance as yf
import time

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Get a reference to the Firestore database
db = firestore.client()

def verify_token(id_token):
    """Verify the ID token and return the user's UID."""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token['uid']
    except:
        return None

@app.route('/api/query', methods=['GET'])
def query_stock():
    """
    Endpoint to query stock information.
    Expects a 'ticker' parameter in the query string.
    Returns basic stock information including symbol, name, price, and price change.
    """
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({"error": "Ticker is required"}), 400

    try:
        # Use yfinance to fetch stock information
        stock = yf.Ticker(ticker)
        info = stock.info

        # Check if we got valid data and all required fields are present
        if not info or not all(key in info and info[key] is not None for key in ['symbol', 'longName', 'currentPrice']):
            return jsonify({"error": f"Incomplete or no data found for ticker: {ticker}"}), 404

        return jsonify({
            "symbol": info['symbol'],
            "name": info['longName'],
            "price": info['currentPrice'],
        })
    except Exception as e:
        print(f"Error in query_stock: {str(e)}")  # Log the error
        return jsonify({"error": f"Error fetching data for {ticker}: {str(e)}"}), 500

@app.route('/api/trade', methods=['POST'])
def trade_stock():
    """
    Endpoint to handle stock trades (buy or sell).
    Expects a JSON payload with 'ticker', 'quantity', and 'action' fields.
    Updates the user's portfolio in Firestore.
    """
    print("Trade request received")
    
    # Get the ID token from the request headers
    id_token = request.headers.get('Authorization')
    if not id_token:
        print("No token provided")
        return jsonify({"error": "No token provided"}), 401

    uid = verify_token(id_token)
    if not uid:
        print("Invalid token")
        return jsonify({"error": "Invalid token"}), 401

    data = request.json
    ticker = data.get('ticker')
    ticker = ticker.upper()
    quantity = data.get('quantity')
    action = data.get('action')  # 'buy' or 'sell'

    print(f"Received trade request: {action} {quantity} shares of {ticker}")

    if not all([ticker, quantity, action]) or action not in ['buy', 'sell']:
        print("Invalid request data")
        return jsonify({"error": "Invalid request data"}), 400

    try:
        # Check if the stock exists and get its current price
        stock = yf.Ticker(ticker)
        info = stock.info
        if not info or 'currentPrice' not in info:
            print(f"No data found for ticker: {ticker}")
            return jsonify({"error": f"No data found for ticker: {ticker}"}), 404
        current_price = info['currentPrice']
        print(f"Current price for {ticker}: ${current_price}")

        # Reference to the user's portfolio in Firestore
        portfolio_ref = db.collection('portfolios').document(uid)
        
        # Get the current portfolio or create a new one
        portfolio = portfolio_ref.get()
        if not portfolio.exists:
            return jsonify([])  # Return an empty list instead of creating a new portfolio
        else:
            portfolio = portfolio.to_dict()

        # Update the portfolio
        if action == 'buy':
            print(f"Buying {quantity} shares of {ticker}")
            portfolio_ref.update({
                ticker: firestore.Increment(quantity)
            })
        elif action == 'sell':
            print(f"Attempting to sell {quantity} shares of {ticker}")
            current_quantity = portfolio.get(ticker, 0)
            if current_quantity < quantity:
                print("Insufficient stocks to sell")
                return jsonify({"error": "Insufficient stocks to sell"}), 400
            new_quantity = current_quantity - quantity
            if new_quantity == 0:
                print(f"Removing {ticker} from portfolio")
                portfolio_ref.update({
                    ticker: firestore.DELETE_FIELD
                })
            else:
                print(f"Updating {ticker} quantity to {new_quantity}")
                portfolio_ref.update({
                    ticker: new_quantity
                })

        action_past = "bought" if action == "buy" else "sold"
        print(f"Trade successful: {action_past} {quantity} shares of {ticker} at ${current_price}")

        # Store the transaction
        transaction = {
            "ticker": ticker,
            "quantity": quantity,
            "action": action,
            "price": current_price,
            "timestamp": int(time.time())
        }
        transactions_ref = db.collection('transactions').document(uid)
        transactions_ref.set({
            "history": firestore.ArrayUnion([transaction])
        }, merge=True)

        return jsonify({"message": f"Successfully {action_past} {quantity} shares of {ticker} at ${current_price:.2f} per share"})
    except Exception as e:
        print(f"Error in trade_stock: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    """
    Endpoint to retrieve the user's current portfolio.
    Fetches all stocks from Firestore and their current prices using yfinance.
    """
    # Get the ID token from the request headers
    id_token = request.headers.get('Authorization')
    if not id_token:
        return jsonify({"error": "No token provided"}), 401

    uid = verify_token(id_token)
    if not uid:
        return jsonify({"error": "Invalid token"}), 401

    try:
        portfolio_ref = db.collection('portfolios').document(uid)
        portfolio = portfolio_ref.get()
        
        if not portfolio.exists:
            return jsonify([])

        portfolio_data = portfolio.to_dict()
        result = []
        for ticker, quantity in portfolio_data.items():
            stock = yf.Ticker(ticker)
            info = stock.info
            current_price = info.get('currentPrice', 0)
            result.append({
                "ticker": ticker,
                "quantity": quantity,
                "current_price": current_price,
                "total_value": quantity * current_price
            })
        return jsonify(result)
    except Exception as e:
        print(f"Error in get_portfolio: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """
    Endpoint to retrieve the user's transaction history.
    """
    id_token = request.headers.get('Authorization')
    if not id_token:
        return jsonify({"error": "No token provided"}), 401

    uid = verify_token(id_token)
    if not uid:
        return jsonify({"error": "Invalid token"}), 401

    try:
        transactions_ref = db.collection('transactions').document(uid)
        transactions = transactions_ref.get()
        
        if not transactions.exists:
            return jsonify([])

        transactions_data = transactions.to_dict()
        return jsonify(transactions_data.get('history', []))
    except Exception as e:
        print(f"Error in get_transactions: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)