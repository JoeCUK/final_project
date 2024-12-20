// Keep track of the user's chart instance so we can destroy it before creating a new one
let userChartInstance = null;

// Function to perform linear regression prediction
function linearRegression(x, y) {
    let n = x.length;
    let sumX = x.reduce((a, b) => a + b, 0);
    let sumY = y.reduce((a, b) => a + b, 0);
    let sumXY = x.reduce((sum, xi, idx) => sum + xi * y[idx], 0);
    let sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    let slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    let intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

// Function to predict future values using the linear regression model
function predictFutureValues(historyYears, historyCounts, futureYears) {
    const { slope, intercept } = linearRegression(historyYears, historyCounts);
    return futureYears.map(year => slope * year + intercept);
}

// Demo chart for me
fetch("/static/publication_data.json")
    .then(response => response.json())
    .then(data => {
        const history = data.history;
        const historyYears = Object.keys(history).map(Number);
        const historyCounts = Object.values(history);

        const futureYears = [2025, 2026];
        const projectedCounts = predictFutureValues(historyYears, historyCounts, futureYears);

        renderChart("demoChart", historyCounts, projectedCounts, "Joseph Cutteridge", futureYears, historyYears);
    });

// Handle user query
document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const authorName = document.getElementById("authorName").value;
    const orcidId = document.getElementById("orcidId").value;

    if (orcidId) {
        fetchPublicationsByORCID(orcidId);
    } else if (authorName) {
        fetchPublicationsByName(authorName);
    } else {
        alert("Please enter either an ORCID ID or an author's name.");
    }
});

// Fetch publications by author name
function fetchPublicationsByName(authorName) {
    const apiUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(authorName)}&retmax=100&usehistory=y&retmode=xml`;

    fetch(apiUrl)
        .then(response => response.text())
        .then(data => parsePubMedData(data, authorName))
        .catch(error => console.error("Error fetching publications:", error));
}

// Fetch publications by ORCID
function fetchPublicationsByORCID(orcidId) {
    const apiUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=ORCID:${encodeURIComponent(orcidId)}&retmax=100&usehistory=y&retmode=xml`;

    fetch(apiUrl)
        .then(response => response.text())
        .then(data => parsePubMedData(data, orcidId))
        .catch(error => console.error("Error fetching publications:", error));
}

function parsePubMedData(data, query) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    const idList = xmlDoc.getElementsByTagName("Id");

    if (idList.length === 0) {
        document.getElementById("userResults").style.display = "none";
        return;
    }

    // Show user results section (for the chart)
    document.getElementById("userResults").style.display = "block";

    let publicationIds = [];
    for (let i = 0; i < idList.length; i++) {
        const pubId = idList[i].textContent;
        publicationIds.push(pubId);
    }

    console.log("Publications found:", publicationIds.length);

    // Fetch details for all publications
    const detailsApiUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${publicationIds.join(",")}&retmode=xml`;
    fetch(detailsApiUrl)
        .then(response => response.text())
        .then(xmlData => parsePublicationDetails(xmlData, query))
        .catch(error => console.error("Error fetching publication details:", error));
}

function parsePublicationDetails(xmlData, query) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    const articles = xmlDoc.getElementsByTagName("PubmedArticle");

    const yearCounts = {};
    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const pubDate = article.getElementsByTagName("PubDate")[0];

        let year = null;
        if (pubDate) {
            const yearElem = pubDate.getElementsByTagName("Year")[0];
            if (yearElem && yearElem.textContent) {
                year = parseInt(yearElem.textContent);
            } else {
                // Check MedlineDate
                const medlineDate = pubDate.getElementsByTagName("MedlineDate")[0];
                if (medlineDate && medlineDate.textContent) {
                    const match = medlineDate.textContent.match(/\d{4}/);
                    if (match) {
                        year = parseInt(match[0]);
                    }
                }
            }
        }

        if (year) {
            yearCounts[year] = (yearCounts[year] || 0) + 1;
        }
    }

    const historyYears = Object.keys(yearCounts).map(Number).sort((a, b) => a - b);
    const historyCounts = historyYears.map(y => yearCounts[y]);

    if (historyYears.length === 0) {
        console.log("No publication years found to plot.");
        return;
    }

    const futureYears = [2025, 2026];
    const projectedCounts = predictFutureValues(historyYears, historyCounts, futureYears);

    renderChart("userChart", historyCounts, projectedCounts, query, futureYears, historyYears);
}

function renderChart(canvasId, history, projections, author, futureYears, historyYears) {
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) {
        console.error(`Canvas element with id ${canvasId} not found. Cannot render chart.`);
        return;
    }

    // If there's an existing user chart instance, destroy it before creating a new one
    if (canvasId === "userChart" && userChartInstance) {
        userChartInstance.destroy();
        userChartInstance = null;
    }

    const ctx = canvasElement.getContext("2d");
    const allYears = [...historyYears, ...futureYears];

    const newChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: allYears,
            datasets: [
                {
                    label: `${author}'s Publication History`,
                    data: [...history, ...Array(futureYears.length).fill(null)],
                    backgroundColor: "rgba(75, 192, 192, 0.6)"
                },
                {
                    label: "Projected Publications",
                    data: [...Array(historyYears.length).fill(null), ...projections],
                    backgroundColor: "rgba(153, 102, 255, 0.6)"
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Year" } },
                y: { title: { display: true, text: "Publications" } }
            }
        }
    });

    // Store the user chart instance if it's the user chart
    if (canvasId === "userChart") {
        userChartInstance = newChart;
    }
}
