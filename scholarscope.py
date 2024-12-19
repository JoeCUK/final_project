from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route("/api/publications", methods=["GET"])
def get_publications():
    author = request.args.get("author")
    # Mocked data for demonstration
    data = simulate_fetch_publication_data(author)
    return jsonify(data)

def simulate_fetch_publication_data(author):
    # This function simulates returning data for a given author.
    # You can replace this with actual logic to fetch data from a database or external source.
    history = {2020: 2, 2021: 3, 2022: 4}
    projections = {2023: 5, 2024: 6}
    return {"history": history, "projections": projections}

if __name__ == "__main__":
    app.run(debug=True)
