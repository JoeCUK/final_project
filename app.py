from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Route for the homepage
@app.route('/')
def index():
    return render_template('index.html')

# Route for the research page
@app.route('/research')
def research():
    return render_template('research.html')

# Route for the clinical page
@app.route('/clinical')
def clinical():
    return render_template('clinical.html')

# Route for the industry page
@app.route('/industry')
def industry():
    return render_template('industry.html')

# Route for the final project page
@app.route('/final_project')
def final_project():
    return render_template('final_project.html')

# API to fetch publications data
@app.route("/api/publications", methods=["GET"])
def get_publications():
    author = request.args.get("author")
    # Here, we'll simulate fetching publication data
    data = simulate_fetch_publication_data(author)
    return jsonify(data)

def simulate_fetch_publication_data(author):
    # Mocked data for demonstration
    history = {2020: 2, 2021: 3, 2022: 4}
    projections = {2023: 5, 2024: 6}
    return {"history": history, "projections": projections}

if __name__ == '__main__':
    app.run(debug=True)
