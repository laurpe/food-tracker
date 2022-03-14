// fetch(
//     "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/laurpe",
//     {
//         method: "GET",
//         headers: { "Content-type": "application/json; charset=UTF-8" },
//     }
// );

// fetch(
//     "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/laurpe",
//     {
//         method: "POST",
//         body: JSON.stringify({
//             message: "hello",
//         }),
//         headers: { "Content-type": "application/json; charset=UTF-8" },
//     }
//     .then((response) => response.json())
//     .then((data) => console.log("get response:", data))
// );

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

// api.post("laurpe", {
//     fields: { foodname: { stringValue: "pizza" }, fat: { stringValue: "5" } },
// });
api.get("laurpe");

const carbs = document.querySelector("#carbs");
const protein = document.querySelector("#protein");
const fat = document.querySelector("#fat");
const food = document.querySelector("#food");
const form = document.querySelector("#add-food");

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

    api.post("laurpe", foodObject);
    api.get("laurpe");
});

console.log(carbs, protein, fat);
