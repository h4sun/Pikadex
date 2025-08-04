"use strict"

let allPokemons = [];
let myPokemons = [];

function showMessage(text) {
    const messageBox = document.getElementById("message");
    messageBox.textContent = text;
    messageBox.classList.add("show");
    setTimeout(() => {
        messageBox.classList.remove("show");
    }, 500);
}

async function getAllPokemons() {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=151";
    const response = await fetch(url);
    const json = await response.json();
    const results = json.results;
    const imageContainer = document.querySelector(".card-list");

    for (let i = 0; i < results.length; i++) {

        const url = results[i].url;
        const { name, imageURL, typeImageURLs, typeNames, stats } = await getPokemonDetails(url);

        const card = document.createElement("li");
        card.classList.add("card");

        card.innerHTML = `
        <div class="content">
            <div class="front">
            <p class="pokemon-name">${name}</p>
            <img class="pokemon-image" src="${imageURL}" alt="Pokemon Image">
            </div>
            <div class="back">
            <h3>Stats</h3>
            <span class="button-icon back-plus-button">+</span>
            <ul class="stats-list">
                <li><span>HP:</span> <span>${stats.hp}</span></li>
                <li><span>Attack:</span> <span>${stats.attack}</span></li>
                <li><span>Defense:</span> <span>${stats.defense}</span></li>
                <li><span>Sp.Atk:</span> <span>${stats.special_attack}</span></li>
                <li><span>Sp.Def:</span> <span>${stats.special_defense}</span></li>
                <li><span>Speed:</span> <span>${stats.speed}</span></li>
            </ul>
            </div>
        </div>`;

        const typeContainer = document.createElement("div");
        typeContainer.classList.add("type-container");
        for (let j = 0; j < typeImageURLs.length; j++) {
            const img = document.createElement("img");
            img.src = typeImageURLs[j];
            img.alt = "Type";
            img.classList.add("type-icon");

            const p = document.createElement("p");
            p.textContent = typeNames[j];
            p.classList.add("type-name", "hidden");

            typeContainer.appendChild(img);
            typeContainer.appendChild(p);
        }

        card.querySelector(".front").appendChild(typeContainer);

        const plusButton = card.querySelector(".back-plus-button");
        plusButton.addEventListener("click", () => {
        if (!myPokemons.includes(card)) {
            myPokemons.push(card);
            showMessage("Pokemon added to 'My Pokemons'");
        } else {
            showMessage("This Pokemon is already in 'My Pokemons'");
        }
        });

        allPokemons.push(card);
        imageContainer.appendChild(card);
    }
}

async function getPokemonDetails(url) {
    const response = await fetch(url);
    const json = await response.json();

    let name = json.name;
    let splittedName = name.split("-");
    name = "";
    for (let i = 0; i < splittedName.length; i++) {
        name += splittedName[i].charAt(0).toUpperCase() + splittedName[i].slice(1) +  " ";
    }
    name.trim();
    const imageURL = json.sprites.front_default;

    let typeImageURLs = [];
    let typeNames = [];
    for (const t of json.types) {
        typeNames.push(t.type.name);
        const typeRes = await fetch(t.type.url);
        const typeJson = await typeRes.json();
        const icon = typeJson.sprites["generation-ix"]["scarlet-violet"]["name_icon"];
        typeImageURLs.push(icon);
    }

    const stats = {
        hp: json.stats[0].base_stat,
        attack: json.stats[1].base_stat,
        defense: json.stats[2].base_stat,
        special_attack: json.stats[3].base_stat,
        special_defense: json.stats[4].base_stat,
        speed: json.stats[5].base_stat
    };

    return { name, imageURL, typeImageURLs, typeNames, stats };
}

const myPokemonsButton = document.querySelector("#my-pokemons");
const allPokemonsButton = document.querySelector("#all-pokemons");

myPokemonsButton.addEventListener("click", () => {
    myPokemonsButton.classList.add("active");
    allPokemonsButton.classList.remove("active");

    const container = document.querySelector("ul.card-list");
    container.innerHTML = "";

    myPokemons.forEach(card => {
        container.appendChild(card);

        const currentButton = card.querySelector(".back-plus-button");
        if (currentButton) {
        const minusButton = document.createElement("span");
        minusButton.classList.add("button-icon", "back-minus-button");
        minusButton.textContent = "-";

        currentButton.replaceWith(minusButton);

        minusButton.addEventListener("click", () => {
            showMessage("Pokemon deleted from 'My Pokemons'");
            myPokemons = myPokemons.filter(c => c !== card);
            container.removeChild(card);
        });
        }
    });
});

allPokemonsButton.addEventListener("click", () => {
    allPokemonsButton.classList.add("active");
    myPokemonsButton.classList.remove("active");

    const container = document.querySelector("ul.card-list");
    container.innerHTML = "";

    allPokemons.forEach(card => {
        const currentButton = card.querySelector(".back-minus-button");
        if (currentButton) {
        const plusButton = document.createElement("span");
        plusButton.classList.add("button-icon", "back-plus-button");
        plusButton.textContent = "+";

        currentButton.replaceWith(plusButton);

        plusButton.addEventListener("click", () => {
            if (!myPokemons.includes(card)) {
            myPokemons.push(card);
            showMessage("Pokemon added to 'My Pokemons'");
            } else {
            showMessage("This Pokemon is already in 'My Pokemons'");
            }
        });
        }
        container.appendChild(card);
    });
});

const filterInput = document.querySelector(".filter-input");
filterInput.addEventListener("input", () => {
    const value = filterInput.value.toLowerCase();
    const cards = document.querySelectorAll(".card-list .card");

    cards.forEach(card => {
        const name = card.querySelector(".pokemon-name").textContent.toLowerCase();
        card.style.display = name.includes(value) ? "" : "none";
    });
});

const selectedType = document.querySelector(".type-select");
selectedType.addEventListener("change", () => {
    const selectedValue = selectedType.value.toLowerCase();

    const cards = document.querySelectorAll(".card-list .card");
    cards.forEach(card => {
        const types = card.querySelectorAll(".type-name");
        let matchFound = false;
        for (const type of types) {
            if (type.textContent.toLowerCase() == selectedValue || selectedValue == "") {
                matchFound = true;
                break;
            }
        }
        card.style.display = matchFound ? "" : "none";
    });
});

getAllPokemons();
