class FetchWrapper {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    get(endpoint) {
        return fetch(this.baseURL + endpoint).then((response) =>
            response.json()
        );
    }

    put(endpoint, body) {
        return this._send("put", endpoint, body);
    }

    post(endpoint, body) {
        return this._send("post", endpoint, body);
    }

    patch(endpoint, body) {
        return this._send("patch", endpoint, body);
    }

    delete(endpoint, body) {
        return this._send("delete", endpoint, body);
    }

    _send(method, endpoint, body) {
        return fetch(this.baseURL + endpoint, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then((response) => response.json());
    }
}

let api = new FetchWrapper(
    "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/"
);

api.get("laurpe1");

const carbs = document.querySelector("#carbs");
const protein = document.querySelector("#protein");
const fat = document.querySelector("#fat");
const food = document.querySelector("#food");
const form = document.querySelector("#add-food");
const stats = document.querySelector("#stat-list");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const foodObject = {
        fields: {
            carbs: {
                integerValue: Number(carbs.value),
            },
            protein: {
                integerValue: Number(protein.value),
            },
            fat: {
                integerValue: Number(fat.value),
            },
            food: {
                stringValue: food.value,
            },
        },
    };

    api.post("laurpe1", foodObject);
});

// show stats

const showStats = async () => {
    const response = await api.get("laurpe1");
    response.documents.forEach((item) => {
        stats.insertAdjacentHTML(
            "beforeend",
            `
            <li>
                ${item.fields.food.stringValue}
                carbs
                ${item.fields.carbs.integerValue}
                protein
                ${item.fields.protein.integerValue}
                fat
                ${item.fields.fat.integerValue}
            </li>
        `
        );
    });
};

showStats();

const getMacros = async () => {
    const response = await api.get("laurpe1");
    console.log(response.documents);

    const carbs = response.documents.reduce((prev, current) => {
        return prev + Number(current.fields.carbs.integerValue);
    }, 0);

    const protein = response.documents.reduce((prev, current) => {
        return prev + Number(current.fields.protein.integerValue);
    }, 0);

    const fat = response.documents.reduce((prev, current) => {
        return prev + Number(current.fields.fat.integerValue);
    }, 0);

    return [carbs, protein, fat];
};

const createChart = async () => {
    const statsChart = document.getElementById("stats-chart").getContext("2d");
    const chart = new Chart(statsChart, {
        type: "bar",
        data: {
            labels: ["Carbohydrates", "Protein", "Fat"],
            datasets: [
                {
                    label: "amount",
                    data: await getMacros(),
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                    ],
                },
            ],
        },
        options: {
            scales: {
                yAxes: {
                    title: {
                        display: true,
                        text: "Amount (grams)",
                    },
                    beginAtZero: true,
                },
            },
        },
    });
};

createChart();

// chart
