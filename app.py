from datetime import datetime, timedelta, timezone
import os
from flask import Flask, redirect, url_for, session, request, jsonify, send_from_directory
from authlib.integrations.flask_client import OAuth
from pymongo import MongoClient
from werkzeug.utils import secure_filename
from flask_cors import CORS
from bson.objectid import ObjectId
import json
from bson import ObjectId
from web3 import Web3


# Connect to Ethereum node (Infura, Ganache, etc.)
web3 = Web3(Web3.HTTPProvider('https://sepolia.infura.io/v3/a3f0233fb3b941399bde2ef6337043b6'))  # Infura node URL

# Smart contract ABI and address
contract_address = '0x98Ee739d3Ed3197b6b16BB09AC7229cbe314e0da'  # Deployed contract address
with open('MedicineStorageABI.json', 'r') as abi_file:
    contract_data = json.load(abi_file)
    contract_abi = contract_data["abi"]  # "abi" list from the JSON

# Load the smart contract
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Wallet credentials
wallet_address = '0xf6781D5aD2650110ee44a37CC7d58A60ac00E4ad'
wallet_private_key = '60e489d6e80ccc8c64261110984ece5e03e372cd88acb0cc76496260b55a880b'  
app = Flask(__name__)

# MongoDB configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://rahulsonawane280305:duIPNAZpQ9rPC8pC@cluster0.g8seh.mongodb.net/')
client = MongoClient(MONGO_URI)
db = client['test']
users_collection = db['users'] 
newsletter_collection = db['newsletter']
medicines_collection = db['medicinelist']
groups_collection = db['groups']
notifications_collection = db['notification']
feedback_collection = db["feedback"] 
log_collection = db['log']
sales_collection = db["sales"]

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

def log_action(user, action, details, ip_address):
    log_entry = {
        "Date": datetime.utcnow(),  # Use UTC time
        "User": user,
        "Action": action,
        "Details": details,
        "IP Address": ip_address
    }
    log_collection.insert_one(log_entry)

# Helper function to convert MongoDB documents to JSON serializable format
def json_converter(doc):
    doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
    return doc

@app.route('/api/audit-logs', methods=['GET'])
def get_audit_logs():
    try:
        # Fetch audit logs from the MongoDB collection
        logs = log_collection.find()  # This retrieves all documents
        logs_list = [json_converter(log) for log in logs]
        
        return jsonify(logs_list), 200

    except Exception as e:
        print("Error fetching logs:", e)
        return jsonify({"error": "Failed to fetch audit logs"}), 500

@app.route('/api/user-stats', methods=['GET'])
def user_stats():
    try:
        one_week_ago = datetime.utcnow() - timedelta(days=7)

        # Fetch all users and log entries for recent logins
        all_users = users_collection.find()
        total_users = 0
        active_emails = set()

        # Track active users based on recent logins
        recent_logins = log_collection.find({"Date": {"$gte": one_week_ago}})
        for log in recent_logins:
            active_emails.add(log["User"])

        # Count total and active users
        active_users = 0
        inactive_users = 0

        # Iterate through all users and categorize them as active or inactive
        for user in all_users:
            total_users += 1
            if user.get("email") in active_emails:
                active_users += 1

        inactive_users = total_users - active_users

        # Construct the response with the data
        response = {
            "activeUsers": active_users,
            "inactiveUsers": inactive_users,
            "totalUsers": total_users
        }
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Normal Login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    ip_address = request.remote_addr

    session['email'] = email

    user = users_collection.find_one({'email': email, 'password': password})
    
    if user:
        verified_state = user.get('verified', 0)  

        if verified_state == 0:
            log_action(email, "Login Failed", "Verification pending", ip_address)
            return jsonify({
                'message': 'Account not yet verified. Please wait.',
                'status': 'verification_pending'
            }), 403

        if verified_state == 2:
            log_action(email, "Login Failed", "Account rejected", ip_address)
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

        log_action(email, "Login Successful", "Normal login", ip_address)
        return jsonify({
            'message': 'Login successful',
            'dashboard': dashboard_routes.get(account_type)
        }), 200
    
    else:
        log_action(email, "Login Failed", "Invalid email or password", ip_address)
        return jsonify({'message': 'Invalid email or password'}), 401
    
@app.route("/api/usersmail", methods=["GET"])
def get_user_by_email():
    """Fetch user details by email."""
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    user = users_collection.find_one({"email": email}, {"_id": 0, "name": 1})
    if user:
        return jsonify({"name": user.get("name")})
    else:
        return jsonify({"error": "User not found"}), 404

# Route to handle Google login
@app.route('/login/google')
def google_login():
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri, prompt = 'select_account')

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    # Validate input
    if not data.get('firstName') or not data.get('lastName') or not data.get('email') or not data.get('message'):
        return jsonify({"error": "All fields are required"}), 400

    # Save feedback to MongoDB
    feedback_entry = {
        "firstName": data['firstName'],
        "lastName": data['lastName'],
        "email": data['email'],
        "message": data['message']
    }
    feedback_collection.insert_one(feedback_entry)

    return jsonify({"message": "Feedback submitted successfully"}), 201

@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    feedbacks = list(feedback_collection.find({}, {"_id": 0}))  # Exclude the MongoDB ObjectId in the response
    return jsonify(feedbacks), 200

# OAuth callback route (called after authentication)
# Google Login
@app.route('/authorize')
def authorize():
    token = google.authorize_access_token()  
    user_info = google.get('https://openidconnect.googleapis.com/v1/userinfo').json()  
    email = user_info['email']
    ip_address = request.remote_addr

    session['email'] = email

    user = users_collection.find_one({'email': email})

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

        log_action(email, "Login Successful", "Google login", ip_address)
        if account_type in dashboard_routes:
            return redirect(dashboard_routes[account_type])
        else:
            log_action(email, "Login Failed", "Unknown account type", ip_address)
            return jsonify({"error": "Unknown account type"}), 400
    else:
        log_action(email, "Login Failed", "User not registered", ip_address)
        return redirect(url_for('registration2'))

# Route for registration page (after login)
@app.route('/registration2')
def registration2():
    return redirect("http://localhost:5173/registration2")

# Logout route to clear session and log out user
@app.route('/api/logout', methods=['POST'])
def logout():
    print("Session data:", session)
    ip_address = request.remote_addr
    email = session['email']
    session.clear()  # Clears all session data
    log_action(email, "Logout", "User logged out", ip_address)
    return jsonify({'message': 'Logged out successfully', 'redirect_url': 'http://localhost:5173/login'}), 200


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
    
# Convert ObjectId to string for JSON serialization
def object_id_to_str(obj):
    return str(obj) if isinstance(obj, ObjectId) else obj

# Route to fetch all sales data
@app.route('/api/sales', methods=['GET'])
def get_sales_data():
    sales_data = sales_collection.find()  # Fetch all sales from MongoDB
    sales_list = []

    for sale in sales_data:
        sale['_id'] = object_id_to_str(sale['_id'])  # Convert ObjectId to string
        sales_list.append(sale)

    return jsonify(sales_list)

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

# Update medicine details
@app.route('/api/medicinedetails/<medicine_id>', methods=['PUT'])
def update_medicine_details(medicine_id):
    """
    Updates the details of a specific medicine by its ID.
    """
    if 'email' not in session:
        return jsonify({"message": "User not logged in"}), 401

    try:
        data = request.json  # Get the updated data from the request body

        # Validate the required fields
        update_fields = {
            "medicine_name": data.get("medicine_name"),
            "medicine_group": data.get("medicine_group"),
            "quantity": data.get("quantity"),
            "usage_instructions": data.get("usage_instructions"),
            "side_effects": data.get("side_effects"),
        }

        # Remove fields that are None (not updated)
        update_fields = {k: v for k, v in update_fields.items() if v is not None}

        if not update_fields:
            return jsonify({"message": "No valid fields to update"}), 400

        # Find and update the medicine record
        result = medicines_collection.update_one(
            {"medicine_id": medicine_id, "added_by": session['email']},
            {"$set": update_fields}
        )

        if result.matched_count == 0:
            return jsonify({"message": "Medicine not found or you don't have permission to update"}), 404

        return jsonify({"message": "Medicine updated successfully"}), 200

    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500


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

        # Add medicine to MongoDB
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

        # Add medicine to Ethereum blockchain
        nonce = web3.eth.get_transaction_count(wallet_address)
        gas_price = web3.eth.gas_price
        txn = contract.functions.addMedicine(
            medicine_name,
            medicine_id,
            medicine_group,
            int(quantity),
            usage_instructions,
            side_effects,
            user_email
        ).build_transaction({
            'chainId': 11155111,
            'gas': 2000000,
            'gasPrice': gas_price,  # Use current gas price
            'nonce': nonce
        })



        # Sign and send transaction
        signed_txn = web3.eth.account.sign_transaction(txn, private_key=wallet_private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)



        return jsonify({
            "message": "Medicine added successfully",
            "transaction_hash": tx_hash.hex(),
            "block_number": tx_receipt.blockNumber
        }), 201

    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

# inventory list
@app.route('/api/get-inventory', methods=['GET'])
def get_inventory():
    if 'email' not in session:
        return jsonify({"error": "User not logged in"}), 401

    try:
        user_email = session['email']
        print(f"User email: {user_email}")  # Debug log

        # Fetch all medicine IDs
        medicine_ids = contract.functions.getAllMedicineIds().call()
        print(f"Medicine IDs fetched: {medicine_ids}")  # Debug log

        user_inventory = []

        # Fetch each medicine by ID
        for medicine_id in medicine_ids:
            medicine = contract.functions.getMedicine(medicine_id).call()
            if medicine[6] == user_email:  # Filter by addedBy
                user_inventory.append({
                    "medicineName": medicine[0],
                    "medicineId": medicine[1],
                    "medicineGroup": medicine[2],
                    "quantity": medicine[3],
                    "usageInstructions": medicine[4],
                    "sideEffects": medicine[5],
                    "addedBy": medicine[6],
                    "addedAt": datetime.utcfromtimestamp(medicine[7]).strftime('%Y-%m-%d %H:%M:%S')
                })

        print(f"User inventory: {user_inventory}")
        return jsonify({"inventory": user_inventory}), 200

    except Exception as e:
        print(f"Error occurred: {str(e)}")
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
def decode_bytes(obj):
    for key, value in obj.items():
        if isinstance(value, bytes):
            obj[key] = value.decode('utf-8')  # Convert bytes to string
    return obj

@app.route('/api/users', methods=['GET'])
def get_users():
    print("Request args:", request.args)  # Debugging line
    try:
        verified_users = [decode_bytes(user) for user in users_collection.find({'verified': 1}, {'_id': 0})]
        rejected_users = [decode_bytes(user) for user in users_collection.find({'verified': 2}, {'_id': 0})]
        return jsonify({'verified_users': verified_users, 'rejected_users': rejected_users}), 200
    except Exception as e:
        print("Error in /api/users:", str(e))
        return jsonify({'error': str(e)}), 500

            
# Group create
@app.route('/api/groups', methods=['POST'])
def create_group():
    try:
        # Parse the request data
        data = request.json
        group_name = data.get('name')
        members = data.get('members', [])
        date_created = data.get('date')

        # Generate a custom unique group ID (gid)
        import uuid
        gid = str(uuid.uuid4())  # Generate a unique ID

        # Create the group document with `gid`
        group_doc = {
            'gid': gid,  # Add gid
            'name': group_name,
            'members': members,
            'date-created': date_created
        }

        # Insert the group document into the database
        inserted_id = groups_collection.insert_one(group_doc).inserted_id

        # Convert the `_id` for JSON serialization
        group_doc['_id'] = str(inserted_id)

        # Create a new collection for the group's chats using `gid`
        chat_collection_name = f"group_{gid}"  # Use `gid` as the collection name
        db.create_collection(chat_collection_name)

        return jsonify({'message': 'Group created successfully', 'group': group_doc}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Fetch notifications for the logged-in user
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    print("Session data:", session)
    user_email = session.get('email')  # Fetch email from session
    if not user_email:
        return jsonify({"error": "Unauthorized: User not logged in"}), 401

    # Query database for notifications belonging to the user
    notifications = list(notifications_collection.find(
        {"user_mail": user_email},
        {"_id": 1, "sender_mail": 1, "message": 1, "date": 1, "time": 1, "status": 1}
    ))
    for notification in notifications:
        notification["_id"] = str(notification["_id"])  # Convert ObjectId to string
    return jsonify(notifications), 200

# Mark a notification as read
@app.route('/api/notifications/<notification_id>', methods=['PATCH'])
def mark_as_read(notification_id):
    try:
        result = notifications_collection.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": {"status": 1}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Notification not found"}), 404

        return jsonify({"message": "Notification marked as read"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Route to post a notification
@app.route('/api/notification', methods=['POST'])
def post_notification():
    try:
        data = request.json
        
        # Insert data into the collection
        result = notifications_collection.insert_one(data)
        
        # Add the MongoDB-generated ID to the data (convert ObjectId to string)
        data["_id"] = str(result.inserted_id)
        
        return jsonify({"message": "Notification sent successfully", "notification": data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Get group data
@app.route('/api/group/<gid>', methods=['GET'])
def get_group_data(gid):
    try:
        # Fetch group details
        group = groups_collection.find_one({'gid': gid})
        if not group:
            return jsonify({'error': 'Group not found'}), 404
        name = group.get('name')
        date = group.get('date-created')
        members = list(group.get('members'))
        res = []
        for val in members:
            if val != None :
                res.append(val)
        
        print("Filtered: ", res)
        memberslength = len(res)
        print("Name: ", name)
        print("Date: ", date)
        print("Members: ", members)
        print("Total members: ", memberslength)

        # Fetch messages from the chat collection
        chat_collection_name = f"group_{gid}"
        chat_collection = db[chat_collection_name]
        messages = list(chat_collection.find({}, {'_id': 0}))  # Exclude `_id`

        return jsonify({'name': name, 'date': date, 'memberslength': memberslength}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/groups/<gid>/messages', methods=['GET'])
def get_messages(gid):
    """
    Fetch all messages from a group.
    """
    if 'email' not in session:
        return jsonify({"message": "User not logged in"}), 401

    try:
        # Get the collection name for the group
        chat_collection_name = f"group_{gid}"

        # Fetch all messages from the group's chat collection
        messages = list(db[chat_collection_name].find({}, {"_id": 0}))

        return jsonify({"messages": messages}), 200

    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500


# Route to send a message in a group
@app.route('/api/groups/<gid>/messages', methods=['POST'])
def send_message(gid):
    """
    Send a message in a group.
    """
    if 'email' not in session:
        return jsonify({"message": "User not logged in"}), 401

    try:
        data = request.json
        message_content = data.get('message')
        timestamp = datetime.utcnow()

        if not message_content:
            return jsonify({"message": "Message content is required"}), 400

        # Retrieve the user's email from the session
        sender_email = session['email']

        # Create the message document
        message_doc = {
            "sender": sender_email,
            "message": message_content,
            "timestamp": timestamp
        }

        # Get the collection name for the group
        chat_collection_name = f"group_{gid}"

        # Insert the message into the group's chat collection
        db[chat_collection_name].insert_one(message_doc)

        return jsonify({"message": "Message sent successfully"}), 201

    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500
    
@app.route('/api/my-groups', methods=['GET'])
def my_groups():
    # Ensure email exists in the session
    if 'email' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        # Retrieve email from session
        user_email = session['email']

        # Query the database for groups containing the user
        groups = list(groups_collection.find({"members": user_email}, {"_id": 0}))

        # Return the groups as a JSON response
        return jsonify({"groups": groups}), 200

    except Exception as e:
        # Log the error for debugging (optional)
        app.logger.error(f"Error fetching groups: {e}")

        # Return a user-friendly error response
        return jsonify({"error": "An unexpected error occurred"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)