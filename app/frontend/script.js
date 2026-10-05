const layers = [
    {
        title: "Clients",
        services: ["Mobile/Web"]
    },
    {
        title: "Gateway",
        services: ["API Gateway"]
    },
    {
        title: "Authentication & Services",
        services: ["Keycloak", "Accounts", "Payments", "Loans"]
    },
    {
        title: "Data",
        services: ["Database"]
    }
];


const diagram = document.getElementById("diagram");
const questionInput = document.getElementById("question");
const analyzeButton = document.getElementById("analyzeButton");

const impactContent = document.getElementById("impactContent");
const statusBadge = document.getElementById("statusBadge");


function drawArchitecture(failedService = null, affectedServices = []) {

    diagram.innerHTML = "";

    layers.forEach((layer, index) => {

        const layerDiv = document.createElement("div");
        layerDiv.classList.add("layer");

        const title = document.createElement("div");
        title.classList.add("layer-title");
        title.textContent = layer.title;

        layerDiv.appendChild(title);


        const servicesDiv = document.createElement("div");
        servicesDiv.classList.add("layer-services");


        layer.services.forEach(service => {

            const node = document.createElement("div");

            node.classList.add("service");


            if (service === failedService) {

                node.classList.add("failed");

            } else if (affectedServices.includes(service)) {

                node.classList.add("affected");

            } else {

                node.classList.add("healthy");

            }


            node.textContent = service;

            servicesDiv.appendChild(node);
        });


        layerDiv.appendChild(servicesDiv);

        diagram.appendChild(layerDiv);


        if (index < layers.length - 1) {

            const arrow = document.createElement("div");

            arrow.classList.add("layer-arrow");

            arrow.textContent = "↓";

            diagram.appendChild(arrow);
        }

    });
}


drawArchitecture();


analyzeButton.addEventListener("click", async () => {

    const question = questionInput.value.trim();


    if (!question) {

        impactContent.innerHTML = `
            <div class="error-state">
                <h3>Please enter a question</h3>
                <p>
                    Ask what happens when a service goes down.
                </p>
            </div>
        `;

        return;
    }


    statusBadge.textContent = "ANALYZING";

    statusBadge.classList.remove("success");

    statusBadge.classList.add("analyzing");


    impactContent.innerHTML = `
        <div class="loading-state">

            <div class="loader"></div>

            <p>
                Analyzing system impact...
            </p>

        </div>
    `;


    try {

        const response = await fetch(
            "http://localhost:8000/analyze",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );


        if (!response.ok) {
            throw new Error("Server returned an error");
        }


        const data = await response.json();


        displayImpactAnalysis(data.answer);


        statusBadge.textContent = "ANALYZED";

        statusBadge.classList.remove("analyzing");

        statusBadge.classList.add("success");


        highlightService(question);


    } catch (error) {

        console.error(error);


        statusBadge.textContent = "ERROR";

        statusBadge.classList.remove("analyzing");


        impactContent.innerHTML = `
            <div class="error-state">

                <h3>Unable to analyze</h3>

                <p>
                    Make sure the FastAPI server is running.
                </p>

            </div>
        `;
    }

});


function displayImpactAnalysis(answer) {

    const failedService = extractSection(
        answer,
        "FAILED SERVICE",
        "DIRECTLY AFFECTED"
    );


    const affectedService = extractSection(
        answer,
        "DIRECTLY AFFECTED",
        "WHY"
    );


    const why = extractSection(
        answer,
        "WHY",
        "IMPACT"
    );


    const impact = extractSection(
        answer,
        "IMPACT",
        "NEXT STEP"
    );


    const nextStep = extractSection(
        answer,
        "NEXT STEP",
        null
    );


    impactContent.innerHTML = `

        <div class="service-flow">


            <div class="impact-service failed-card">

                <span class="card-label">
                    FAILED SERVICE
                </span>

                <strong>
                    🔴 ${failedService}
                </strong>

                <span class="service-status">
                    Unavailable
                </span>

            </div>


            <div class="flow-arrow">
                →
            </div>


            <div class="impact-service affected-card">

                <span class="card-label">
                    DIRECTLY AFFECTED
                </span>

                <strong>
                    🟠 ${affectedService}
                </strong>

                <span class="service-status">
                    Affected
                </span>

            </div>


        </div>


        <div class="analysis-details">


            <div class="detail">

                <span class="detail-label">
                    WHY
                </span>

                <p>
                    ${why}
                </p>

            </div>


            <div class="detail">

                <span class="detail-label">
                    IMPACT
                </span>

                <p>
                    ${impact}
                </p>

            </div>


            <div class="detail next-step">

                <span class="detail-label">
                    NEXT STEP
                </span>

                <p>
                    ${nextStep}
                </p>

            </div>


        </div>
    `;
}


function extractSection(text, start, end) {

    const startIndex = text.indexOf(start);


    if (startIndex === -1) {
        return "Not available";
    }


    const contentStart = startIndex + start.length;

    let contentEnd = text.length;


    if (end) {

        const endIndex = text.indexOf(
            end,
            contentStart
        );


        if (endIndex !== -1) {
            contentEnd = endIndex;
        }
    }


    return text
        .substring(contentStart, contentEnd)
        .trim();
}


function highlightService(question) {

    const text = question.toLowerCase();


    let failedService = null;

    let affectedServices = [];


    if (text.includes("payment")) {

        failedService = "Payments";

        affectedServices = [
            "API Gateway"
        ];

    }

    else if (text.includes("keycloak")) {

        failedService = "Keycloak";

        affectedServices = [
            "API Gateway",
            "Mobile/Web"
        ];

    }

    else if (text.includes("database")) {

        failedService = "Database";

        affectedServices = [
            "Accounts",
            "Payments",
            "Loans"
        ];

    }

    else if (text.includes("account")) {

        failedService = "Accounts";

        affectedServices = [
            "API Gateway"
        ];

    }

    else if (text.includes("loan")) {

        failedService = "Loans";

        affectedServices = [
            "API Gateway"
        ];

    }


    if (failedService) {

        drawArchitecture(
            failedService,
            affectedServices
        );

    }

    else {

        drawArchitecture();

    }
}