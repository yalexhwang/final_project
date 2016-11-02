from flask import Flask, request, jsonify
from flaskext.mysql import MySQL 
from flask_cors import CORS, cross_origin
import datetime as dt
import uuid 
import base64

app = Flask(__name__)
CORS(app)

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'x'
app.config['MYSQL_DATABASE_PASSWORD'] = 'x'
app.config['MYSQL_DATABASE_DB'] = 'mini_city'
app.config['MYSQL_DATABASE_HOST'] = '127.0.0.1'
mysql.init_app(app)
app.secret_key = "dkssud#$&109ghkddP-dms"
conn = mysql.connect()
cursor = conn.cursor()


@app.route('/login', methods=['POST'])
def login():
	data = request.get_json()
	adminName = data['adminName']
	password = data['password'].encode('utf-8')
	login_query = "SELECT * FROM admin WHERE admin_name = '%s' AND password = '%s'" % (adminName, password)
	cursor.execute(login_query)
	admin = cursor.fetchone()
	if admin is None:
		result = {'passFail': 0,
			'status': 'Found 0 match'}
	else:
		token = str(uuid.uuid1())
		token_query = "UPDATE admin SET temp_token = '%s' WHERE id = '%s'" % (token, admin[0])
		cursor.execute(token_query)
		conn.commit()
		admin = list(admin)
		admin[4] = token
		result = {'passFail': 1,
			'obj' : admin}
	return jsonify(result)

@app.route('/isLoggedIn', methods=['POST'])
def isLoggedin():
	data = request.get_json()
	admin = data['admin']
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
	data = request.get_json()
	print data
	new_user_query = "INSERT INTO users (first_name, middle_name, last_name, age, gender, race, date_of_birth, photo, has_id) VALUES ('%s','%s','%s','%s','%s','%s','%s','%s','%s')" % (data['fname'], data['mname'], data['lname'], int(data['age']), data['gender'], data['race'], data['dob'], data['photo'], data['hasID'])
	cursor.execute(new_user_query)
	conn.commit()
	new_user_id = cursor.lastrowid
	result = {}
	if data['nfc'] != "":
		# NFC exists, create one after creating the user
		today = dt.date.today()
		nfc_quey = "INSERT INTO devices (nfc_tag_id, user_id, registered_at) VALUES ('%s', '%s', '%s')" % (data['nfc'], new_user_id, today)
		cursor.execute(nfc_quey)
		conn.commit()
		new_nfc_id = cursor.lastrowid
		has_device_query = "UPDATE users SET device = '%s' WHERE users.id = '%s'" % (data['nfc'], new_user_id)
		cursor.execute(has_device_query)
		conn.commit()
		get_nfc_query = "SELECT * from devices WHERE id = '%s'" % new_nfc_id
		cursor.execute(get_nfc_query)
		nfc = cursor.fetchone()
		result['nfc'] = nfc 
	else: 
		result['nfc'] = ""

	if data['hasPOB'] == 1:
		pob_query = "INSERT INTO _user_place_of_birth (hospital, city, county, state, user_id) VALUES ('%s','%s','%s','%s','%s')" % (data['pob']['hospital'], data['pob']['city'], data['pob']['county'], data['pob']['state'], new_user_id)
		cursor.execute(pob_query)
		conn.commit()
		new_pob_id = cursor.lastrowid
		has_pob_query = "UPDATE users SET place_of_birth = '%s' WHERE users.id = '%s'" % (new_pob_id, new_user_id)
		cursor.execute(has_pob_query)
		conn.commit()
		get_pob_query = "SELECT * from _user_place_of_birth WHERE id = '%s'" % new_pob_id
		cursor.execute(get_pob_query)
		pob = cursor.fetchone()
		result['pob'] = pob
	else: 
		result['pob'] = ""

	if data['hasParents'] == 1:
		parents_query = "INSERT INTO _user_parents (father_full_name, mother_full_name, user_id) VALUES ('%s','%s','%s')" % (data['parents']['father'], data['parents']['mother'], new_user_id)
		cursor.execute(parents_query)
		conn.commit()
		new_parents_id = cursor.lastrowid
		has_parents_query = "UPDATE users SET parents = '%s' WHERE users.id = '%s'" % (new_parents_id, new_user_id)
		cursor.execute(has_parents_query)
		conn.commit()
		get_parents_query = "SELECT * from _user_parents WHERE id = '%s'" % new_parents_id
		cursor.execute(get_parents_query)
		parents = cursor.fetchone()
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


# @app.route('/add_event', methods=['POST'])
# def add_event():
# 	data = request.get_json()
# 	print data
# 	name = data['name']
# 	contact = data['contact']
# 	container = data['container']
# 	address = data['location']['address']
# 	city = data['location']['city']
# 	state = data['location']['state']
# 	zipcode = data['location']['zipcode']
# 	when = data['datetime']['year'] + "-" + data['datetime']['month'] + "-" + data['datetime']['date'] + " " + data['datetime']['hour'] + ':' + data['datetime']['min'] + ":00"
# 	add_event_query = ""
# 	if data['category'] == '0':
# 		#physical nourishment
# 		add_event_query = "INSERT INTO svc_physical values (default, '%s','%s','%s','%s','%s','%s','%s','%s')" % (name, int(container), address, city, state, zipcode, when, contact)
# 	elif data['category'] == '1':
# 		#wellness
# 		add_event_query = "INSERT INTO svc_wellness values (default, '%s','%s','%s','%s','%s','%s','%s','%s')" % (name, int(container), address, city, state, zipcode, when, contact)
# 	print 'query:'
# 	print add_event_query
# 	cursor.execute(add_event_query)
# 	conn.commit()
# 	event_id = cursor.lastrowid
# 	get_event_query = ""
# 	if data['category'] == '0':
# 		get_event_query = "SELECT * FROM svc_physical WHERE id = '%s'" % event_id
# 	elif data['category'] == '1':
# 		get_event_query = "SELECT * FROM svc_wellness WHERE id = '%s'" % event_id
# 	cursor.execute(get_event_query)
# 	event = cursor.fetchone()
# 	print 'event'
# 	print event
# 	result = {
# 		'name': event[1],
# 		'container': event[2],
# 		'address': event[3],
# 		'city': event[4],
# 		'state': event[5],
# 		'zipcode': event[6],
# 		'datetime': event[7],
# 		'contact': event[8],
# 		'category': data['category']
# 	}
# 	return jsonify(result)

@app.route('/edit_user', methods=['POST'])
def edit_user():
	data = request.get_json()
	print data
	userObj = data['obj']
	target = data['type']
	user_dbid = int(data['obj']['dbid'])
	print userObj
	print "target: %s" % target
	print "user_dbid: %s" % user_dbid
	if target == 'user':
		print "target is user!"
		if userObj['name']['first'] != "" and userObj['name']['last'] != "":
			update_user_query = "UPDATE users SET first_name = '%s', middle_name = '%s', last_name = '%s' WHERE id = '%s'" % (userObj['name']['first'], userObj['name']['middle'], userObj['name']['last'], user_dbid)
			cursor.execute(update_user_query)
			conn.commit()
			print update_user_query
		if userObj['age']:
			update_user_query = "UPDATE users SET age = '%s' WHERE id = '%s'" % (userObj['age'], user_dbid)
			cursor.execute(update_user_query)
			conn.commit()
			print update_user_query
		if userObj['gender']:
			update_user_query = "UPDATE users SET gender = '%s' WHERE id = '%s'" % (userObj['gender'], user_dbid)
			cursor.execute(update_user_query)
			conn.commit()
			print update_user_query
		if userObj['race']:
			update_user_query = "UPDATE users SET race = '%s' WHERE id = '%s'" % (userObj['race'], user_dbid)
			cursor.execute(update_user_query)
			conn.commit()
			print update_user_query
		if userObj['dob']:
			update_user_query = "UPDATE users SET date_of_birth = '%s' WHERE id = '%s'" % (userObj['dob'], user_dbid)
			cursor.execute(update_user_query)
			conn.commit()
			print update_user_query
	if target == 'pob':
		if userObj['new'] == 1:
			add_pob_query = "INSERT INTO _user_place_of_birth (hospital, city, county, state, user_id) VALUES ('%s','%s','%s','%s','%s')" % (userObj['hospital'], userObj['city'], userObj['county'], userObj['state'], user_dbid)
			cursor.execute(add_pob_query)
			conn.commit()
			print cursor.lastrowid
			new_pob_id = cursor.lastrowid
			update_user_query = "UPDATE users SET place_of_birth = '%s' WHERE id = '%s'" % (new_pob_id, user_dbid)
			cursor.execute(update_user_query)
			conn.commit()
			print "update_user_query Executed: %s" % cursor.lastrowid
		else:
			update_pob_query = "UPDATE _user_place_of_birth SET hospital = '%s', city = '%s', county = '%s', state = '%s', user_id = '%s'" % (userObj['hospital'], userObj['city'], userObj['county'], userObj['state'], user_dbid)
			cursor.execute(update_pob_query)
			conn.commit()
			print cursor.lastrowid

	if target == 'parents':
		if userObj['new'] == 1:
			add_parents_query = "INSERT INTO _user_parents (father_full_name, mother_full_name, user_id) VALUES ('%s','%s','%s')" % (userObj['father'], userObj['mother'], user_dbid)
			cursor.execute(add_parents_query)
			conn.commit()
			new_parents_id = cursor.lastrowid
			update_user_query = "UPDATE users SET parents = '%s' WHERE id = '%s'" % (new_parents_id, user_dbid)
			cursor.execute(update_user_query)
			conn.commit()
		else: 
			update_parents_query = "UPDATE _user_parents SET father_full_name = '%s', mother_full_name = '%s' WHERE user_id = '%s'" % (userObj['father'], userObj['mother'], user_dbid)
			cursor.execute(update_parents_query)
			conn.commit()
	if target == 'hasID':
		update_user_query = "UPDATE users SET has_id = '%s' WHERE id = '%s'" % (int(userObj['hasID']), user_dbid)
		cursor.execute(update_user_query)
		print update_user_query
		conn.commit()
	return 'updated'

@app.route('/edit_event', methods=['POST'])
def edit_event():
	data = request.get_json()
	print data
	dbid = int(data['dbid'])
	print 'dbid: %s' % dbid
	name = data['name']
	contact = data['contact']
	container = data['container']
	address = data['location']['address']
	city = data['location']['city']
	state = data['location']['state']
	zipcode = data['location']['zipcode']
	if data['category'] == "0":
		if name != "":
			update_name_query = "UPDATE svc_physical SET event_name = '%s' WHERE id = '%s'" % (name, dbid)
			cursor.execute(update_name_query)
			conn.commit()
		if contact != "":
			update_contact_query = "UPDATE svc_physical SET contact = '%s' WHERE id = '%s'" % (contact, dbid)
			cursor.execute(update_contact_query)
			conn.commit()
		if container != "":
			update_container_query = "UPDATE svc_physical SET container_id = '%s' WHERE id = '%s'" % (container, dbid)
			cursor.execute(update_container_query)
			conn.commit()
		if address != "":
			update_address_query = "UPDATE svc_physical SET address = '%s' WHERE id = '%s'" % (address, dbid)
			cursor.execute(update_address_query)
			conn.commit()
		if city != "":
			update_city_query = "UPDATE svc_physical SET city = '%s' WHERE id = '%s'" % (city, dbid)
			cursor.execute(update_city_query)
			conn.commit()
		if state != "":
			update_state_query = "UPDATE svc_physical SET state = '%s' WHERE id = '%s'" % (state, dbid)
			cursor.execute(update_state_query)
			conn.commit()
		if zipcode != "":
			update_zipcode_query = "UPDATE svc_physical SET zipcode = '%s' WHERE id = '%s'" % (zipcode, dbid)
			cursor.execute(update_zipcode_query)
			conn.commit()
		if data['datetime']['year'] != "" and data['datetime']['month'] != "" and data['datetime']['date'] != "" and data['datetime']['hour'] != "" and data['datetime']['min'] != "" :
			when = data['datetime']['year'] + "-" + data['datetime']['month'] + "-" + data['datetime']['date'] + " " + data['datetime']['hour'] + ':' + data['datetime']['min'] + ":00"
			update_datetime_query = "UPDATE svc_physical SET date_time = '%s' WHERE id = '%s'" % (when, dbid)
			cursor.execute(update_datetime_query)
			conn.commit()
		return "A Wellness Service has been updated."
	elif data['category'] == "1":
		if name != "":
			update_name_query = "UPDATE svc_wellness SET event_name = '%s' WHERE id = '%s'" % (name, dbid)
			cursor.execute(update_name_query)
			conn.commit()
		if contact != "":
			update_contact_query = "UPDATE svc_wellness SET contact = '%s' WHERE id = '%s'" % (contact, dbid)
			cursor.execute(update_contact_query)
			conn.commit()
		if container != "":
			update_container_query = "UPDATE svc_wellness SET container_id = '%s' WHERE id = '%s'" % (container, dbid)
			cursor.execute(update_container_query)
			conn.commit()
		if address != "":
			update_address_query = "UPDATE svc_wellness SET address = '%s' WHERE id = '%s'" % (address, dbid)
			cursor.execute(update_address_query)
			conn.commit()
		if city != "":
			update_city_query = "UPDATE svc_wellness SET city = '%s' WHERE id = '%s'" % (city, dbid)
			cursor.execute(update_city_query)
			conn.commit()
		if state != "":
			update_state_query = "UPDATE svc_wellness SET state = '%s' WHERE id = '%s'" % (state, dbid)
			cursor.execute(update_state_query)
			conn.commit()
		if zipcode != "":
			update_zipcode_query = "UPDATE svc_wellness SET zipcode = '%s' WHERE id = '%s'" % (zipcode, dbid)
			cursor.execute(update_zipcode_query)
			conn.commit()
		if data['datetime']['year'] != "" and data['datetime']['month'] != "" and data['datetime']['date'] != "" and data['datetime']['hour'] != "" and data['datetime']['min'] != "" :
			when = data['datetime']['year'] + "-" + data['datetime']['month'] + "-" + data['datetime']['date'] + " " + data['datetime']['hour'] + ':' + data['datetime']['min'] + ":00"
			update_datetime_query = "UPDATE svc_wellness SET date_time = '%s' WHERE id = '%s'" % (when, dbid)
			cursor.execute(update_datetime_query)
			conn.commit()
		return "A Wellness Service has been updated."
	else: 
		return "Error: try again."


@app.route('/get/<where>', methods=['GET'])
def getData(where):
	print "getData"
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
		return jsonify(result)
	elif where == "containers":
		containers_query = "SELECT * FROM containers" 
		cursor.execute(containers_query)
		data = cursor.fetchall()
		containers = []
		for row in data:
			container = {
				'id': row[0],
				'name': row[1],
				'zipcode': row[2]
			}

# - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# API - - - - - - - - - - - - - - - - - - - - - - - - - -
# - - - - - - - - - - - - - - - - - - - - - - - - - - - -
@app.route('/users')
def api_all_users():
	all_users_query = "SELECT * from users"
	cursor.execute(all_users_query)
	data = cursor.fetchall()
	users = []
	for row in data:
		user = {
			'dbid': row[0],
			'first_name': row[1],
			'middle_name': row[2],
			'last_name': row[3],
			'age': row[4],
			'gender': row[5],
			'race': row[6],
			'dob': row[7],
			'photo': row[8],
			'employment': row[9],
			'hasID': row[10],
			'pob': row[11],
			'parents': row[12],
			'device': row[13]
		}
		users.append(user)
	return jsonify(users)

@app.route('/users/<nfc_id>', methods=['GET', 'POST'])
def api_users(nfc_id):
	if request.method == 'GET':
		get_user_query = "SELECT d.nfc_tag_id, d.container, d.registered_at, u.* FROM users as u INNER JOIN devices as d ON u.id = d.user_id WHERE d.nfc_tag_id = '%s'" % nfc_id
		cursor.execute(get_user_query)
		data = cursor.fetchone()
		print 'data'
		print data
		result = {
			'nfc_tag_id': data[0],
			'container_id': data[1],
			'registered_at': data[2],
			'dbid': data[3],
			'name': {
				'first': data[4],
				'middle': data[5],
				'last': data[6]
			},
			'age': data[7],
			'gender': data[8],
			'race': data[9],
			'dob': data[10],
			'photo': data[11],
			'hasID': data[13]
		}
		if data[12] != 0:
			#employment
			get_employment_query = "SELECT * from _user_employment WHERE user_id = '%s'" % result['dbid']
			cursor.execute(get_employment_query)
			emp = cursor.fetchone()
			if emp is None:
				result['employment'] = ""
			else:
				result['employment'] = emp
		else:
			result['employment'] = ""

		if data[14] != 0:
			#pob
			get_pob_query = "SELECT * from _user_place_of_birth WHERE user_id = '%s'" % result['dbid']
			cursor.execute(get_pob_query)
			pob = cursor.fetchone()
			if pob is None: 
				result['pob'] = None
			else:
				result['pob'] = {
					'hospital': pob[1],
					'city': pob[2],
					'county': pob[3],
					'state': pob[4]
				}
		else:
			result['pob'] = ""

		if data[15] != 0:
			#parents
			get_parents_query = "SELECT * from _user_parents WHERE user_id = '%s'" % result['dbid']
			cursor.execute(get_parents_query)
			prnts = cursor.fetchone()
			if prnts is None: 
				result['parents'] = ""
			else:
				result['parents'] = {
					'father': prnts[1],
					'mother': prnts[2]
				}
		else:
			result['parents'] = ""
		print "result"
		print result
		return jsonify(result)

	elif request.method == 'POST':
		data = request.get_json()
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
		return jsonify(result)

@app.route('/containers/<container_id>', methods=['GET', 'POST'])
def api_containers(container_id):
	if request.method == 'GET':
		print container_id
		return container_id
		container = container_id
		get_container_query = "SELECT * FROM containers WHERE id = '%s'" % container
		cursor.execute(get_container_query)
		data = cursor.fetchone()

		cont_devices_query = "SELECT c.*, d.nfc_tag_id, d.user_id, d.registered_at FROM containers as c INNER JOIN devices as d ON c.id = d.container WHERE c.id = '%s'" % container
		cursor.execute(cont_devices_query)
		data2 = cursor.fetchall()
		print data2
		devices = []
		for row in data2:
			device = {
				'nfc_tag_id': row[3],
				'registered_at': row[5]
			}
			devices.append(device)

		cont_svc_query1 = "SELECT * FROM svc_physical WHERE container_id = '%s'" % container
		cont_svc_query2 = "SELECT * FROM svc_wellness WHERE container_id = '%s'" % container
		cursor.execute(cont_svc_query1)
		data3 = cursor.fetchall()
		cursor.execute(cont_svc_query2)
		data4 = cursor.fetchall()
		services1 = []
		for row in data3:
			service = {
				'name': row[1],
				'location': {
					'address': row[3],
					'city': row[4],
					'state': row[5],
					'zipcode': row[6]
				},
				'time': row[7],
				'contact': row[8]
			}
			services1.append(service)
		services2 = []
		for row in data4:
			service = {
				'name': row[1],
				'location': {
					'address': row[3],
					'city': row[4],
					'state': row[5],
					'zipcode': row[6]
				},
				'time': row[7],
				'contact': row[8]
			}
			services2.append(service)

		result = {
			'container_id': data[0],
			'container_name': data[1],
			'zipcode': data[2],
			'registered_devices': devices,
			'services': {
				'service1': services1,
				'service2': services2
			}
		}
		return jsonify(result)

@app.route('/services/<service_id>', methods=['GET', 'POST'])
def api_services(service_id):
	if request.method == 'GET':
		get_service_query = ""
		service = {}
		if service_id == '0':
			get_service_query = "SELECT * FROM svc_physical"
			service['service_name'] = 'Physical Nourishment'
		elif service_id == '1':
			get_service_query = "SELECT * FROM svc_wellness"
			service['service_name'] = 'Wellness'
		cursor.execute(get_service_query)
		data = cursor.fetchall()
		events = []
		for row in data:
			event = {
				'dbid': row[0],
				'name': row[1],
				'container': row[2],
				'location': {
					'address': row[3],
					'city': row[4],
					'state': row[5],
					'zipcode': row[6]
				},
				'datetime': row[7],
				'contact': row[8]
			}
			events.append(event)
		service['events'] = events
		print service
		return jsonify(service)

	elif request.method == 'POST':
		data = request.get_json()
		print data
		name = data['name']
		address = data['location']['address']
		city = data['location']['city']
		state = data['location']['state']
		zipcode = data['location']['zipcode']
		when = data['datetime']['year'] + "-" + data['datetime']['month'] + "-" + data['datetime']['date'] + " " + data['datetime']['hour'] + ':' + data['datetime']['min'] + ":00"
		add_event_query = ""
		if data['category'] == '0':
			#physical nourishment
			add_event_query = "INSERT INTO svc_physical (event_name, address, city, state, zipcode, date_time) values ('%s','%s','%s','%s','%s','%s')" % (name, address, city, state, zipcode, when)
			if data['container'] != "":
				add_event_query = "INSERT INTO svc_physical (event_name, container, address, city, state, zipcode, date_time) values ('%s','%s','%s','%s','%s','%s','%s')" % (name, int(data['container']), address, city, state, zipcode, when)
			if data['contact'] != "":
				add_event_query = "INSERT INTO svc_physical (event_name, container, address, city, state, zipcode, date_time, contact) values ('%s','%s','%s','%s','%s','%s','%s','%s')" % (name, int(data['container']), address, city, state, zipcode, when, data['contact'])
		elif data['category'] == '1':
			#wellness
			add_event_query = "INSERT INTO svc_wellness (event_name, address, city, state, zipcode, date_time) values ('%s','%s','%s','%s','%s','%s')" % (name, address, city, state, zipcode, when)
			if data['container'] != "":
				add_event_query = "INSERT INTO svc_wellness (event_name, container, address, city, state, zipcode, date_time) values ('%s','%s','%s','%s','%s','%s','%s')" % (name, int(data['container']), address, city, state, zipcode, when)
			if data['contact'] != "":
				add_event_query = "INSERT INTO svc_wellness (event_name, container, address, city, state, zipcode, date_time, contact) values ('%s','%s','%s','%s','%s','%s','%s','%s')" % (name, int(data['container']), address, city, state, zipcode, when, data['contact'])
		cursor.execute(add_event_query)
		conn.commit()
		event_id = cursor.lastrowid

		get_event_query = ""
		if data['category'] == '0':
			get_event_query = "SELECT * FROM svc_physical WHERE id = '%s'" % event_id
		elif data['category'] == '1':
			get_event_query = "SELECT * FROM svc_wellness WHERE id = '%s'" % event_id
		cursor.execute(get_event_query)
		event = cursor.fetchone()
		result = {
			'name': event[1],
			'container': event[2],
			'address': event[3],
			'city': event[4],
			'state': event[5],
			'zipcode': event[6],
			'datetime': event[7],
			'contact': event[8],
			'category': data['category']
		}
		return jsonify(result)

@app.route('/log', methods=['GET'])
def api_log():
	nfc_tag_id = request.args.get('user')
	svc_id = request.args.get('svc')
	cont_id = request.args.get('cont')

	if nfc_tag_id == None:
		return 'Error! NFC Tag ID is not provided.'
	if svc_id == None:
		return 'Error! Service is not provided.'

	get_user_query = "SELECT user_id FROM devices WHERE nfc_tag_id = '%s'" % nfc_tag_id
	cursor.execute(get_user_query)
	user_id = int(cursor.fetchone()[0]) 
	print 'user id: %s' % user_id
	log_query = ""
	if cont_id == None:
		log_query = "INSERT INTO logs (service_id, user_id) VALUES ('%s', '%s')" % (svc_id, user_id)
	else: 
		log_query = "INSERT INTO logs (service_id, user_id, container_id) VALUES ('%s', '%s', '%s')" % (svc_id, user_id, cont_id)
	cursor.execute(log_query)
	conn.commit()
	log_id = cursor.lastrowid
	print 'log id: %s' % log_id
	get_log_query = "SELECT logs.*, users.first_name, users.middle_name, users.last_name FROM logs INNER JOIN users ON logs.user_id = users.id WHERE logs.id = '%s'" % log_id
	cursor.execute(get_log_query)
	log = cursor.fetchone()
	result = {
		'service_id': log[1],
		'nfc_tag_id': nfc_tag_id,
		'user': {
			'first_name': log[5],
			'middle_name': log[6],
			'last_name': log[7]
		},
		'container_id': log[3],
		'timestamp': log[4]
	}
	return jsonify(result)

@app.route('/delete/<type>/<id>', methods=['GET'])
def api_delete(type, id):
	print type
	print id
	if type == "user":
		nfc_tag_id = id
		delete_user_query = "DELETE FROM users WHERE device = '%s'" % nfc_tag_id
		cursor.execute(delete_user_query)
		conn.commit()
		result = 'User with NFC Tag ID %s has been removed from the database' % nfc_tag_id
	elif type == "service":
		svc_id = id
		event_dbid = request.args.get('dbid')
		print 'svc_id: %s' % svc_id
		print 'event_dbid: %s' % event_dbid
		if event_dbid is None:
			result = 'Sorry, please specify the event to remove (DBID).'
		else: 
			if svc_id == '0':
				#physical
				delete_event_query = "DELETE FROM svc_physical WHERE id = '%s'" % event_dbid
				cursor.execute(delete_event_query)
				conn.commit()
				result = 'Event (DBID: %s) of Physical Nourishment Service has been removed.' % event_dbid
	
			elif svc_id == '1':
				delete_event_query = "DELETE FROM svc_wellness WHERE id = '%s'" % event_dbid
				cursor.execute(delete_event_query)
				conn.commit()
				result = 'Event (DBID: %s) of Wellness Service has been removed.' % event_dbid

			else:
				result = 'Sorry, the service you requested does not have an event to remove.'
	else:
		result = 'Sorry, please try again.'
	return result

if (__name__) == "__main__":
	app.run(debug=True)


