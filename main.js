import snackbar from "snackbar";
import "snackbar/dist/snackbar.min.css";

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

const carbs = document.querySelector("#carbs");
const protein = document.querySelector("#protein");
const fat = document.querySelector("#fat");
const food = document.querySelector("#food");
const form = document.querySelector("#add-food");
const stats = document.querySelector("#stat-grid");
const caloriesSum = document.querySelector("#calories-sum");
const caloriesSumContainer = document.querySelector(".total-calories");
const statsChart = document.getElementById("stats-chart").getContext("2d");
const statsChartContainer = document.querySelector(".chart");

let chart = new Chart(statsChart, {
    type: "bar",
    data: {
        labels: ["Carbohydrates", "Protein", "Fat"],
        datasets: [
            {
                label: "amount",
                data: [0, 0, 0],
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

form.addEventListener("submit", async (event) => {
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
    try {
        await api.post("laurpe2", foodObject);
    } catch (error) {
        console.error(error.message);
    }

    chart.destroy();
    createChart();
    createCards();
    snackbar.show("Food added succesfully!");
});

const createCards = async () => {
    stats.innerHTML = "";
    try {
        const response = await api.get("laurpe2");
        response.documents.forEach((item) => {
            stats.insertAdjacentHTML(
                "beforeend",
                `
                <div class="grid-item">
                        <h3>
                        ${item.fields.food.stringValue}
                        </h3>
                            <ul>
                            <li class="carbs">Carbohydrates: ${item.fields.carbs.integerValue} g</li>
                            <li class="protein">Protein: ${item.fields.protein.integerValue} g</li>
                            <li class="fat">Fat: ${item.fields.fat.integerValue} g</li>
                        </ul>
                </div>
            `
            );
        });
    } catch (error) {
        console.error(error);
        stats.textContent = "Failed to create log";
    }
};

const getMacros = async () => {
    const response = await api.get("laurpe2");

    const macros = response.documents.reduce(
        (prev, current) => {
            return {
                carbs: prev.carbs + Number(current.fields.carbs.integerValue),
                protein:
                    prev.protein + Number(current.fields.protein.integerValue),
                fat: prev.fat + Number(current.fields.fat.integerValue),
            };
        },
        { carbs: 0, protein: 0, fat: 0 }
    );

    const totalCalories =
        macros.carbs * 4 + macros.protein * 4 + macros.fat * 4;

    macros.total = totalCalories;

    return macros;
};

const createChart = async () => {
    try {
        const macros = await getMacros();
        caloriesSum.textContent = macros.total;
        chart.destroy();
        chart = new Chart(statsChart, {
            type: "bar",
            data: {
                labels: ["Carbohydrates", "Protein", "Fat"],
                datasets: [
                    {
                        label: "amount",
                        data: [macros.carbs, macros.protein, macros.fat],
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
    } catch (error) {
        console.error(error);
        statsChartContainer.textContent = "Failed to create chart";
        caloriesSumContainer.textContent = "Failed to count total calories";
    }
};

createCards();
createChart();
