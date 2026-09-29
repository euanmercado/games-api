from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, get_db_connection

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Initialize SQLite Database table
init_db()

# 1. GET /games - List all games
@app.route('/games', methods=['GET'])
def get_games():
    conn = get_db_connection()
    games = conn.execute('SELECT * FROM games ORDER BY id DESC').fetchall()
    conn.close()
    return jsonify([dict(game) for game in games]), 200

# 2. GET /games/<id> - Fetch single game detail by ID
@app.route('/games/<int:game_id>', methods=['GET'])
def get_game(game_id):
    conn = get_db_connection()
    game = conn.execute('SELECT * FROM games WHERE id = ?', (game_id,)).fetchone()
    conn.close()
    
    if game is None:
        return jsonify({"error": f"Game with ID {game_id} was not found (404)."}), 404
        
    return jsonify(dict(game)), 200

# 3. POST /games - Create a new game
@app.route('/games', methods=['POST'])
def add_game():
    data = request.get_json() or {}
    
    # API Validation: Check required fields
    title = data.get('title', '').strip() if isinstance(data.get('title'), str) else ''
    platform = data.get('platform', '').strip() if isinstance(data.get('platform'), str) else ''
    genre = data.get('genre', '').strip() if isinstance(data.get('genre'), str) else ''
    release_year = data.get('release_year')

    if not title or not platform or not genre or not release_year:
        return jsonify({
            "error": "Validation Error (400): Title, Platform, Genre, and Release Year are required fields!"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO games (title, platform, genre, release_year, image_url, description)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (title, platform, genre, release_year, data.get('image_url', ''), data.get('description', '')))
    
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({"id": new_id, "message": "Game added successfully!"}), 201

# 4. PUT /games/<id> - Update existing game
@app.route('/games/<int:game_id>', methods=['PUT'])
def update_game(game_id):
    data = request.get_json() or {}
    
    title = data.get('title', '').strip() if isinstance(data.get('title'), str) else ''
    platform = data.get('platform', '').strip() if isinstance(data.get('platform'), str) else ''
    genre = data.get('genre', '').strip() if isinstance(data.get('genre'), str) else ''
    release_year = data.get('release_year')

    if not title or not platform or not genre or not release_year:
        return jsonify({
            "error": "Validation Error (400): Missing required fields for update!"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM games WHERE id = ?', (game_id,))
    if cursor.fetchone() is None:
        conn.close()
        return jsonify({"error": f"Game with ID {game_id} not found."}), 404

    cursor.execute('''
        UPDATE games 
        SET title = ?, platform = ?, genre = ?, release_year = ?, image_url = ?, description = ?
        WHERE id = ?
    ''', (title, platform, genre, release_year, data.get('image_url', ''), data.get('description', ''), game_id))
    
    conn.commit()
    conn.close()
    return jsonify({"message": f"Game {game_id} updated successfully!"}), 200

# 5. DELETE /games/<id> - Delete game
@app.route('/games/<int:game_id>', methods=['DELETE'])
def delete_game(game_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM games WHERE id = ?', (game_id,))
    if cursor.fetchone() is None:
        conn.close()
        return jsonify({"error": f"Game with ID {game_id} not found."}), 404

    cursor.execute('DELETE FROM games WHERE id = ?', (game_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": f"Game {game_id} deleted successfully."}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)