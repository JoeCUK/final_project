# ScholarScope: Research Trend Analyser

#### Video Demo: <URL HERE>

#### Description:

ScholarScope is an interactive web-based platform designed to help researchers visualise and analyse their publication history and predict future output. It was designed as an extension to my personal homepage, developed in CS50 Week 8. 

### Key Features
- **Dynamic Data Visualisation**: ScholarScope uses Chart.js to display historical publication data and projected future trends in an engaging bar chart format.
- **Custom Search**: Allows users to input an author’s name and dynamically fetch publication data.
- **User-Friendly Interface**: Built with Flask and Bootstrap to ensure responsiveness and a polished design.
- **Custom Domain Deployment**: Hosted on Render with a custom domain (“https://josephcutteridge.com”).

### Project Files Overview

#### 1. `app.py`
This is the main Flask application file. It handles routing and serves the HTML templates. Key routes include:
- `/`: Serves the homepage.
- `/research`, `/clinical`, `/industry`, `/final_project`: Serve corresponding pages with detailed information.
- `/api/publications`: An API endpoint for fetching mocked publication data dynamically.

#### 2. `scholarscope.py`
This secondary Flask app simulates fetching publication data for the project. It contains a simple API to provide historical and projected publication data for demonstration purposes.

#### 3. `templates/`
Contains the HTML templates used by Flask. Each template is modular, extending from a base layout for consistency:
- `index.html`: The homepage introducing Dr. Joseph Cutteridge’s work and goals.
- `research.html`, `clinical.html`, `industry.html`, `final_project.html`: Pages describing respective sections of the project.
- `layout.html`: Base layout with a shared navigation bar and footer.

#### 4. `static/`
Houses all static assets for the project:
- `static/css/styles.css`: Contains custom CSS for styling the site.
- `static/js/final_project.js`: Handles data visualization and user interactions for the ScholarScope page.
- `static/js/script.js`: Adds interactive features like the greeting alert on the homepage.
- `static/publication_data.json`: Mocked data file used to simulate publication history and projections.
- `static/IMG_0442.jpeg`: Profile image displayed on the homepage.

#### 5. `Procfile`
Defines the deployment process for Render. Specifies `gunicorn app:app` as the command to run the Flask application in production.

#### 6. `requirements.txt`
Lists the Python dependencies required for the project, as required by Render:
- Flask
- Chart.js (via a CDN)
- Other Flask dependencies (Jinja2, Werkzeug, itsdangerous, click)

### Design Choices

#### Framework and cotnent management
Flask was chosen for its simplicity, flexibility, and suitability for a small-scale project like this. Since it was introduced in CS50 Week 9, I was already familiar with its structure and capabilities, allowing me to focus on implementing functionality rather than learning a new framework. Flask's modular nature enabled the separation of application logic into distinct routes and templates, ensuring organization and scalability. Additionally, the use of Flask templates facilitated dynamic content generation while maintaining a clean and reusable structure for HTML files, ensuring both scalability and easier future updates.

Chart.js was selected for data visualization due to its ease of use, robust features, and seamless compatibility with JavaScript, making it an excellent choice for creating interactive and visually appealing graphs within the project.

#### Deployment
Render was chosen because it is free, has a fairly straightforward deployment process, and it supports for Flask applications. A custom domain (“josephcutteridge.com”) was integrated to enhance the project’s professionalism.

#### Mock Data
Mock publication data was used to demonstrate functionality. This approach allowed focus on the interface and logic without needing to integrate with a real API, which could be a future enhancement.

### Challenges and Solutions

1. **DNS Configuration**:
   - Challenge: Configuring the custom domain and ensuring HTTPS.
   - Solution: Adjusted GoDaddy DNS records to point to Render’s IP and CNAME, verified the configuration, and enabled HTTPS enforcement.

2. **Interactive Charts**:
   - Challenge: Ensuring seamless interaction between the frontend and backend for dynamic data visualization.
   - Solution: Leveraged JavaScript’s `fetch` API and Chart.js for real-time updates.

3. **Deployment**:
   - Challenge: Initial build failures due to incorrect dependencies.
   - Solution: Refined `requirements.txt` and ensured compatibility with Render’s Python environment.

### Future Enhancements
- **API Integration**: Connect to live publication databases like PubMed or Google Scholar for real-time data.
- **Advanced Analytics**: Include metrics like citation counts, h-index, and collaboration networks.
- **User Accounts**: Allow users to save and compare multiple authors or research groups.
- **Expanded Visualizations**: Add options for line graphs, pie charts, and other formats to explore data from different perspectives.

### Conclusion
ScholarScope is a robust starting point for showcasing the potential of combining web technologies and data visualization to enhance research insights. This project demonstrates practical skills in full-stack web development, with a clear path for future growth and enhancement.

