from datetime import datetime
import os
from flask import Flask, redirect, url_for, session, request, jsonify, send_from_directory
from authlib.integrations.flask_client import OAuth
from pymongo import MongoClient
from werkzeug.utils import secure_filename
from flask_cors import CORS
from bson.objectid import ObjectId
import json

app = Flask(__name__)

# MongoDB configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://rahulsonawane280305:duIPNAZpQ9rPC8pC@cluster0.g8seh.mongodb.net/')
client = MongoClient(MONGO_URI)
db = client['test']
users_collection = db['users'] 
newsletter_collection = db['newsletter']
medicines_collection = db['medicinelist']

# Upload folder for documents
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# Secret key for session management
app.secret_key = os.environ.get("SECRET_KEY") or "random_secret_key"

# OAuth configuration
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id='149209574443-4895bgmog99e3qqf8eti2s5u0ulo08u6.apps.googleusercontent.com',
    client_secret='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',
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',
    client_kwargs={'scope': 'openid profile email'},
    jwks_uri='https://www.googleapis.com/oauth2/v3/certs',
)

# Normal Login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    session['email'] = email

    user = users_collection.find_one({'email': email, 'password': password})
    
    if user:
        verified_state = user.get('verified', 0)  

        if verified_state == 0:
            return jsonify({
                'message': 'Account not yet verified. Please wait.',
                'status': 'verification_pending'
            }), 403

        if verified_state == 2:
            return jsonify({
                'message': 'Your account has been rejected.',
                'status': 'rejected'
            }), 403

        account_type = user.get('account_type')
        session['account_type'] = account_type

        dashboard_routes = {
            'manufacturer': "http://localhost:5173/dashboard",
            'distributor': "http://localhost:5173/dashboardD",
            'regulator': "http://localhost:5173/dashboardR",
            'pharmacy': "http://localhost:5173/dashboardP",
            'admin': "http://localhost:5173/dashboardA"
        }

        return jsonify({
            'message': 'Login successful',
            'dashboard': dashboard_routes.get(account_type)
        }), 200
    
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

# Route to handle Google login
@app.route('/login/google')
def google_login():
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri, prompt = 'select_account')

# OAuth callback route (called after authentication)
@app.route('/authorize')
def authorize():
    token = google.authorize_access_token()  
    user_info = google.get('https://openidconnect.googleapis.com/v1/userinfo').json()  # Fetch the user's info

    session['email'] = user_info['email']

    user = users_collection.find_one({'email': user_info['email']})

    if user:
        account_type = user.get('account_type')
        session['account_type'] = account_type

        dashboard_routes = {
            'manufacturer': "http://localhost:5173/dashboard",
            'distributor': "http://localhost:5173/dashboardD",
            'regulator': "http://localhost:5173/dashboardR",
            'pharmacy': "http://localhost:5173/dashboardP",
            'admin': "http://localhost:5173/dashboardA"
        }

        if account_type in dashboard_routes:
            return redirect(dashboard_routes[account_type])
        else:
            return jsonify({"error": "Unknown account type"}), 400

    else:
        return redirect(url_for('registration2'))

# Route for registration page (after login)
@app.route('/registration2')
def registration2():
    return redirect("http://localhost:5173/registration2")

# Logout route to clear session and log out user
@app.route('/logout')
def logout():
    session.clear()  
    return redirect(url_for('google_login'))

# API to get the email from the session
@app.route('/api/get-session-email')
def get_session_email():
    if 'email' in session:
        return {'email': session['email']}
    else:
        return {'error': 'No email in session'}, 400

# API to handle user registration and document upload
@app.route('/api/register', methods=['POST'])
def register():
    try:
        account_type = request.form.get('accountType')
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')

        document1 = request.files.get('document1')
        document2 = request.files.get('document2')

        if document1:
            original_filename = secure_filename(document1.filename)
            truncated_name = original_filename[:50]  # Limit the base name to 50 characters
            document1_filename = truncated_name
            document1.save(os.path.join(app.config['UPLOAD_FOLDER'], document1_filename))
        if document2:
            original_filename = secure_filename(document2.filename)
            truncated_name = original_filename[:50]
            document2_filename = truncated_name
            document2.save(os.path.join(app.config['UPLOAD_FOLDER'], document2_filename))

        user_data = {
            'account_type': account_type,
            'name': name,
            'email': email,
            'password': password,
            'document1': document1_filename if document1 else None,
            'document2': document2_filename if document2 else None,
            'verified' : 0
        }
        users_collection.insert_one(user_data)

        return jsonify({'message': 'User registered successfully!', 'status': 'success'}), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

# Newsletter route    
@app.route('/api/newsletter/subscribe', methods=['POST'])
def subscribe():
    try:
        email = request.json.get('email')
        print("Received request with email:", email)  

        if not email:
            return jsonify({"message": "Email is required"}), 400

        existing_email = newsletter_collection.find_one({"email": email})
        if existing_email:
            return jsonify({"message": "This email is already subscribed"}), 409

        subscription = {
            "email": email,
            "subscribedAt": datetime.utcnow()
        }
        newsletter_collection.insert_one(subscription)
        return jsonify({"message": "Subscription successful"}), 201

    except Exception as e:
        print("Error processing request:", e)  
        return jsonify({"message": "An error occurred"}), 500

@app.route('/api/get-user-details', methods=['GET'])
def get_user_details():
    if 'email' in session:
        email = session['email']
        user = users_collection.find_one({'email': email})
        if user:
            return jsonify({
                'name': user.get('name'),
                'email': email,
                'account_type': user.get('account_type')
            }), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify({'error': 'No user logged in'}), 401

# Document verification for admin
@app.route('/api/documents', methods=['GET'])
def get_documents():
    try:
        documents = list(users_collection.find({"verified": 0}, {
            '_id': 0,  
            'name': 1,
            'account_type': 1,
            'document1': 1,
            'document2': 1
        }))
        return jsonify(documents), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# View Documenrts
@app.route('/uploads/<filename>')
def serve_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file_extension = os.path.splitext(filename)[1].lower()
    mime_types = {
        '.pdf': 'application/pdf',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
    }
    mime_type = mime_types.get(file_extension, 'application/octet-stream')

    response = send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    response.headers['Content-Type'] = mime_type
    if mime_type != 'application/octet-stream':  
        response.headers['Content-Disposition'] = 'inline'
    else:  
        response.headers['Content-Disposition'] = f'attachment; filename="{filename}"'

    return response

# Medicine add
@app.route('/api/add-medicine', methods=['POST'])
def add_medicine():
    if 'email' not in session:
        return jsonify({"message": "User not logged in"}), 401

    try:
        data = request.json
        medicine_name = data.get('medicine_name')
        medicine_id = data.get('medicine_id')
        medicine_group = data.get('medicine_group')
        quantity = data.get('quantity')
        usage_instructions = data.get('usage_instructions')
        side_effects = data.get('side_effects')
        user_email = session['email']

        if not all([medicine_name, medicine_id, medicine_group, quantity, usage_instructions]):
            return jsonify({"message": "Missing mandatory fields"}), 400

        medicine_data = {
            "medicine_name": medicine_name,
            "medicine_id": medicine_id,
            "medicine_group": medicine_group,
            "quantity": quantity,
            "usage_instructions": usage_instructions,
            "side_effects": side_effects,
            "added_by": user_email,
            "added_at": datetime.utcnow()
        }

        medicines_collection.insert_one(medicine_data)

        return jsonify({"message": "Medicine added successfully"}), 201

    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

# inventory list
@app.route('/api/get-inventory', methods=['GET'])
def get_inventory():
    if 'email' not in session:
        return jsonify({"error": "User not logged in"}), 401

    try:
        user_email = session['email']
        inventory_items = list(medicines_collection.find({"added_by": user_email}, {"_id": 0}))
        
        return jsonify({"inventory": inventory_items}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# medicine details
@app.route('/api/medicinedetails/<medicine_id>', methods=['GET'])
def medicine_details(medicine_id):
    if 'email' not in session:
        return jsonify({"message": "User not logged in"}), 401

    try:
        # Query for the medicine by its ID
        medicine = medicines_collection.find_one({"medicine_id": medicine_id})

        if not medicine:
            return jsonify({"message": "Medicine not found"}), 404

        # Returning the medicine details
        medicine_details = {
            "medicine_name": medicine.get("medicine_name"),
            "medicine_id": medicine.get("medicine_id"),
            "medicine_group": medicine.get("medicine_group"),
            "quantity": medicine.get("quantity"),
            "usage_instructions": medicine.get("usage_instructions"),
            "side_effects": medicine.get("side_effects"),
            "added_by": medicine.get("added_by"),
            "added_at": medicine.get("added_at"),
        }

        return jsonify(medicine_details), 200

    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

# verification status
@app.route('/api/update-verification', methods=['POST'])
def update_verification():
    try:
        data = request.json 
        print("Received payload:", data)

        document_name = data.get('document_name')  
        verified = data.get('verified')

        if not document_name or verified not in [1, 2]:
            return jsonify({'error': 'Invalid data'}), 400

        result = users_collection.update_one(
            {'name': document_name},  
            {'$set': {'verified': verified}}
        )

        if result.matched_count == 0:
            return jsonify({'error': 'Document not found'}), 404

        return jsonify({'message': 'Verification status updated successfully'}), 200

    except Exception as e:
        print("Error:", str(e))  # Log errors
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/ban-unban', methods=['POST'])
def ban_unban():
    try:
        data = request.json
        print("Received payload:", data)

        # Extract email and status from the payload
        email = data.get('email')  
        verified = data.get('verified')

        # Validate the input
        if not email or verified not in [0, 1, 2]:  # Ensure valid email and status
            return jsonify({'error': 'Invalid data'}), 400

        # Update the user's verification status in the database
        result = users_collection.update_one(
            {'email': email},  # Match user by email
            {'$set': {'verified': verified}}
        )

        if result.matched_count == 0:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'message': 'User status updated successfully'}), 200

    except Exception as e:
        print("Error:", str(e))  # Log errors
        return jsonify({'error': str(e)}), 500

# verification status handling 
@app.route('/api/verification-state', methods=['GET'])
def get_verification_state():
    email = session.get('email')
    if not email:
        return jsonify({'message': 'Unauthorized'}), 401

    user = users_collection.find_one({'email': email})  
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'verified': user.get('verified', 0)})

# user details fetch
@app.route('/api/users', methods=['GET'])
def get_users():
    verified_users = list(users_collection.find({'verified': 1}, {'_id': 0}))
    rejected_users = list(users_collection.find({'verified': 2}, {'_id': 0}))
    return jsonify({
        'verified_users': verified_users,
        'rejected_users': rejected_users
    }), 200

            
if __name__ == '__main__':
    app.run(debug=True)
