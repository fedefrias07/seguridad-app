from flask import Flask, send_from_directory, request, jsonify
from db import init_db, mysql
import os, bcrypt, jwt, datetime
from functools import wraps

app = Flask(__name__)

app.config['SECRET_KEY'] = "mi_clave_super_secreta"

# Inicializamos la base de datos
init_db(app)


@app.route("/")
def home():
    return send_from_directory("static/views", "index.html")

@app.route("/login")
def login_view():
    return send_from_directory("static/views", "login.html")

@app.route("/registro")
def register_view():
    return send_from_directory("static/views", "registro.html")


@app.route("/registro", methods=["POST"])
def register():
    data = request.json
    print(f"ESTA ES LA DATA: {data}")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    id_rol = data.get("id_rol", 3)  # Rol por defecto: 'usuario'

    
    #if not username or not email or not password:
    #    return jsonify({"error": "Todos los campos son obligatorios"}), 400

    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
        
        cursor = mysql.connection.cursor()
        # Insertar el usuario en la base de datos
        query = """INSERT INTO usuarios (username, email, contrasena, id_rol) VALUES (%s, %s, %s, %s)"""

        print("Ejecutando consulta...")
        cursor.execute(query, (username, email, hashed_password.decode('utf-8'), id_rol))

        print("Consulta ejecutada.")
        
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": f"Error al registrar usuario: {str(e)}"}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "El correo y la contraseña son obligatorios"}), 400

    try:
        cursor = mysql.connection.cursor()
        query = """SELECT * FROM usuarios WHERE email = %s"""
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        cursor.close()

        if user and bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):  # Comparar la contraseña hasheada
            # Crear un JWT con los datos del usuario
            token = jwt.encode({
                "user_id": user[0],  # ID del usuario
                "username": user[1],  # Nombre de usuario (asegúrate de que esté en tu base de datos)
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Tiempo de expiración del token (1 hora)
            }, app.config['SECRET_KEY'], algorithm="HS256")

            return jsonify({
                "message": "Inicio de sesión exitoso",
                "token": token  # Enviar el token al cliente
            }), 200
        else:
            return jsonify({"error": "Correo o contraseña incorrectos"}), 401
    except Exception as e:
        return jsonify({"error": f"Error al autenticar el usuario: {str(e)}"}), 500



@app.route("/user-data", methods=["GET"])
def user_data():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"error": "Token no proporcionado"}), 401

    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = decoded.get("user_id")

        cursor = mysql.connection.cursor()
        query = """SELECT username, email FROM usuarios WHERE id = %s"""
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()
        cursor.close()

        if user:
            return jsonify({
                "username": user[0],
                "email": user[1],
            }), 200
        else:
            return jsonify({"error": "Usuario no encontrado"}), 404

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "El token ha expirado"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Token inválido"}), 401




@app.route("/perfil")
def perfil():
    return send_from_directory("static/views", "perfil.html")

@app.route("/contactos")
def contactos():
    return send_from_directory("static/views", "contactos.html")


app.run(host="0.0.0.0", port=5001, debug=True)
