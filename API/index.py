from flask import Flask, request, redirect, session, jsonify, json, render_template
from flaskext.mysql import MySQL 
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS, cross_origin
from urlparse import urlparse, parse_qs
from werkzeug import secure_filename
import datetime as dt
import uuid 
import base64

app = Flask(__name__)
CORS(app)
api = Api(app)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'x'
app.config['MYSQL_DATABASE_PASSWORD'] = 'x'
app.config['MYSQL_DATABASE_DB'] = 'mini_city'
app.config['MYSQL_DATABASE_HOST'] = '127.0.0.1'
mysql.init_app(app)

# class test(Resource):
# 	def post(self):
# 		return {'status': 'success'}

# class AuthenticateUser(Resource):
# 	def post(self):
# 		try:
# 			parser = reqparse.RequestParser()
# 			parser.add_argument('adminName', type=str, help="admin name")
# 			parser.add_argument('password', type=str, help="password")
# 			args = parser.parse_args()

# 			_adminName = args['adminName']
# 			_password = args['password']
# 			conn = mysql.connect()
# 			cursor = conn.cursor()
# 			cursor.callproc('sp_AuthenticateUser', (_adminName,))
# 			data = cursor.fetchone()
# 			print data

# 			if data is not None:
# 				if (str(data[2]) == _password):
# 					return {'status': 200, 'name': data[3]}
# 				else:
# 					return {'status': 100, 'message': 'Authentication failed'}
# 		except Exception as e:
# 			return {'error': str(e)}

# api.add_resource(test, '/test')
# api.add_resource(AuthenticateUser, '/AuthenticateUser')

conn = mysql.connect()
cursor = conn.cursor()
app.secret_key = "dkssud#$&109ghkddP-dms"

@app.route('/login', methods=['POST'])
def login():
	print "/login"
	data = request.get_json()
	adminName = data['adminName']
	password = data['password'].encode('utf-8')
	login_query = "SELECT * FROM admin WHERE admin_name = '%s' AND password = '%s'" % (adminName, password)
	cursor.execute(login_query)
	admin = cursor.fetchone()
	if admin is None:
		result = {'passFail': 0,
			'status': 'Found 0 match'}
		print result
		return jsonify(result)
	else:
		token = str(uuid.uuid1())
		print 'token: %s' % token
		token_query = "UPDATE admin SET temp_token = '%s' WHERE id = '%s'" % (token, admin[0])
		cursor.execute(token_query)
		conn.commit()
		admin = list(admin)
		admin[4] = token
		result = {'passFail': 1,
			'obj' : admin}
		print result
		return jsonify(result)

@app.route('/isLoggedIn', methods=['POST'])
def isLoggedin():
	print '/isLoggedIn'
	data = request.get_json()
	admin = data['admin']
	print 'admin'
	print admin
	match_query = "SELECT * FROM admin WHERE id = '%s' AND temp_token = '%s'" % (admin[0], admin[4])
	cursor.execute(match_query)
	found = cursor.fetchone()
	if found is None:
		result = {'passFail': 0,
			'status': 'No match found'}
	else:
		result = {'passFail': 1}
	return jsonify(result)

@app.route('/logout', methods=['POST'])
def logout():
	print "/logout"
	data = request.get_json()
	admin_id = data['adminId']
	token_query = "UPDATE admin SET temp_token = null WHERE id = '%s'" % (admin_id)
	cursor.execute(token_query)
	conn.commit()
	result = {'passFail': 1}
	return jsonify(result)


@app.route('/register_user', methods=['POST'])
def register_user():
	print "register_user"
	data = request.get_json()
	print data

	new_user_query = "INSERT INTO users (first_name, middle_name, last_name, age, gender, race, date_of_birth, has_id) VALUES ('%s','%s','%s','%s','%s','%s','%s','%s')" % (data['fname'], data['mname'], data['lname'], int(data['age']), data['gender'], data['race'], data['dob'], data['hasID'])
	cursor.execute(new_user_query)
	conn.commit()
	new_user_id = cursor.lastrowid

	result = {}
	if data['nfc'] != "":
		# NFC exists, create one after creating the user
		today = dt.date.today()
		print 'today: %s' % today
		nfc_quey = "INSERT INTO devices (nfc_tag_id, user_id, registered_at) VALUES ('%s', '%s', '%s')" % (data['nfc'], new_user_id, today)
		cursor.execute(nfc_quey)
		conn.commit()
		new_nfc_id = cursor.lastrowid
		get_nfc_query = "SELECT * from devices WHERE id = '%s'" % new_nfc_id
		cursor.execute(get_nfc_query)
		nfc = cursor.fetchone()
		print "nfc:"
		print nfc
		result['nfc'] = nfc 
	else: 
		result['nfc'] = ""

	if data['hasPOB'] == 1:
		pob_query = "INSERT INTO _user_place_of_birth (hospital, city, county, state, user_id) VALUES ('%s','%s','%s','%s','%s')" % (data['pob']['hospital'], data['pob']['city'], data['pob']['county'], data['pob']['state'], new_user_id)
		cursor.execute(pob_query)
		conn.commit()
		new_pob_id = cursor.lastrowid
		get_pob_query = "SELECT * from _user_place_of_birth WHERE id = '%s'" % new_pob_id
		cursor.execute(get_pob_query)
		pob = cursor.fetchone()
		print "pob entered: "
		print pob
		result['pob'] = pob
	else: 
		result['pob'] = ""

	if data['hasParents'] == 1:
		parents_query = "INSERT INTO _user_parents (father_full_name, mother_full_name, user_id) VALUES ('%s','%s','%s')" % (data['parents']['father'], data['parents']['mother'], new_user_id)
		cursor.execute(parents_query)
		conn.commit()
		new_parents_id = cursor.lastrowid
		print 'new_parents_id: %s' % new_parents_id
		get_parents_query = "SELECT * from _user_parents WHERE id = '%s'" % new_parents_id
		cursor.execute(get_parents_query)
		parents = cursor.fetchone()
		print "parents entered: "
		print parents
		result['parents'] = parents
	else: 
		result['parents'] = ""
		
	get_user_query = "SELECT * FROM users WHERE id = '%s'" % new_user_id
	cursor.execute(get_user_query)
	user = cursor.fetchone()
	result['user'] = user

	print "result: "
	print result
	return jsonify(result)


@app.route('/upload_photo', methods=['POST'])
def upload_photo():
	photo = request.files['file']
	photo.save(secure_filename(photo.filename))
	with open(photo, "rb") as image_file:
		encoded_string = base64.b64encode(image_file.read())
		print "encoded_string: '%'" % encoded_string
	return encoded_string

@app.route('/get/<data>', methods=['GET'])
def getData(data):
	print "getData"
	where = data
	print "where: %s" % where
	if where == "main":
		nfc_query = "SELECT devices.nfc_tag_id, devices.container, devices.registered_at, u.first_name, u.middle_name, u.last_name, u.age, u.gender, u.race, u.date_of_birth from devices INNER JOIN users as u ON devices.user_id = u.id"
		container_query ="SELECT c.*, count(devices.id) FROM containers as c INNER JOIN devices ON devices.container = c.id GROUP BY c.id"
		cursor.execute(nfc_query)
		nfc = cursor.fetchall()
		cursor.execute(container_query)
		container = cursor.fetchall()
		result = {			
			'nfc': nfc,
			'container': container
		}
		print "nfc - - - - - - - - - -"
		print nfc
		print jsonify(nfc)
		return jsonify(result)


# - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# API - - - - - - - - - - - - - - - - - - - - - - - - - -
# - - - - - - - - - - - - - - - - - - - - - - - - - - - -

@app.route('/users/<nfc_id>', methods=['GET', 'POST', 'PUT'])
def api_find(nfc_id):
	if request.method == 'GET':
		nfc = nfc_id
		print nfc
		get_user_query = "SELECT d.nfc_tag_id, d.container, d.registered_at, u.* FROM users as u INNER JOIN devices as d ON u.id = d.user_id WHERE d.nfc_tag_id = '%s'" % nfc
		cursor.execute(get_user_query)
		data = cursor.fetchone()
		print 'data: '
		print data

		result = {
			'nfc_tag': data[0],
			'container_id': data[1],
			'registered_at': data[2],
			'user_dbid': data[3],
			'name': {
				'first': data[4],
				'middle': data[5],
				'last': data[6]
			},
			'age': data[7],
			'gender': data[8],
			'race': data[9],
			'dob': data[10],
			'hasID': data[11]
		}
		get_pob_qeury = "SELECT * from _user_place_of_birth WHERE user_id = '%s'" % result['user_dbid']
		cursor.execute(get_pob_qeury)
		data2 = cursor.fetchone()
		print 'data2:'
		print data2
		if data2 is None: 
			result['pob'] = None
		else:
			result['pob'] = {
				'hospital': data2[1],
				'city': data2[2],
				'county': data2[3],
				'state': data2[4]
			}

		get_parents_qeury = "SELECT * from _user_parents WHERE user_id = '%s'" % result['user_dbid']
		cursor.execute(get_parents_qeury)
		data3 = cursor.fetchone()
		print 'data3:'
		print data3
		if data3 is None: 
			result['parents'] = ""
		else:
			result['parents'] = {
				'father': data3[1],
				'mother': data3[2]
			}

		print result
		return jsonify(result)
	elif request.method == 'PUT':
		all_args = request.args.to_dict()
		print all_args
		return 'hi'

if (__name__) == "__main__":
	app.run(debug=True, threaded=True)


