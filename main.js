const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0';
const CONTENIDO = document.getElementById('contenido');

const TYPE_TRANSLATIONS = {
    fire: 'Fuego',
    water: 'Agua',
    ground: 'Tierra'
};

const capitalizeFirstLetter = (string) => {
    return TYPE_TRANSLATIONS[string] || string.charAt(0).toUpperCase() + string.slice(1);
};

const getPokemons = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        for (const pokemon of data.results) {
            const pokemonId = extractPokemonId(pokemon.url);
            const pokemonData = await getPokemonDetails(pokemonId);
            renderPokemon(pokemonData);
        }
    } catch (error) {
        console.error('Error al obtener los Pokémon:', error);
    }
};

const getPokemonDetails = async (id) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener detalles del Pokémon con ID ${id}:`, error);
    }
};

const extractPokemonId = (url) => {
    return url.split('/').filter(Boolean).pop();
};

const renderPokemon = (pokemon) => {
    const { id, name, sprites } = pokemon;
    const img = sprites.front_default;
    const pokemonRow = `
        <tr>
            <th scope="row">${id}</th>
            <td>${name}</td>
            <td><img src="${img}" alt="${name}" class="img-fluid" style="width: 50px; height: 50px;"></td>
        </tr>
    `;
    CONTENIDO.insertAdjacentHTML('beforeend', pokemonRow);
};

getPokemons();

const API_TYPE_URLS = {
    fire: 'https://pokeapi.co/api/v2/type/fire',
    water: 'https://pokeapi.co/api/v2/type/water',
    ground: 'https://pokeapi.co/api/v2/type/ground'
};

const SECTIONS = {
    fire: document.getElementById('seccion2'),
    water: document.getElementById('seccion3'),
    ground: document.getElementById('seccion4')
};

const getPokemonsByType = async (type) => {
    try {
        const response = await fetch(API_TYPE_URLS[type]);
        const data = await response.json();
        const pokemonList = data.pokemon.slice(0, 10); 
        renderPokemonsByType(type, pokemonList);
    } catch (error) {
        console.error(`Error al obtener Pokémon de tipo ${type}:`, error);
    }
};

const renderPokemonsByType = async (type, pokemonList) => {
    const section = SECTIONS[type];
    const table = createTableForType();
    section.innerHTML = `<h2 class="text-center">Pokémon de Tipo ${capitalizeFirstLetter(type)}</h2>`;
    section.appendChild(table);

    for (const pokemonData of pokemonList) {
        const pokemonId = extractPokemonId(pokemonData.pokemon.url);
        const pokemonDetails = await getPokemonDetails(pokemonId);
        renderPokemonToTable(pokemonDetails, table);
    }
};

const createTableForType = () => {
    const table = document.createElement('table');
    table.classList.add('table', 'table-dark', 'my-4');
    table.innerHTML = `
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre</th>
                <th scope="col">Imagen</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    return table;
};

const renderPokemonToTable = (pokemon, table) => {
    const { id, name, sprites } = pokemon;
    const img = sprites.front_default;
    const row = `
        <tr>
            <th scope="row">${id}</th>
            <td>${name}</td>
            <td><img src="${img}" alt="${name}" class="img-fluid" style="width: 50px; height: 50px;"></td>
        </tr>
    `;
    table.querySelector('tbody').insertAdjacentHTML('beforeend', row);
};

const navLinks = document.querySelectorAll('.nav-link'); 
const sections = document.querySelectorAll('section'); 

const showSection = (sectionId) => {
    sections.forEach((section) => {
        if (section.id === sectionId) {
            section.classList.remove('hidden'); 
        } else {
            section.classList.add('hidden'); 
        }
    });
};

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); 
        const sectionId = link.getAttribute('data-section'); 
        showSection(sectionId); 
    });
});

showSection('seccion1');
getPokemons();
getPokemonsByType('fire');
getPokemonsByType('water');
getPokemonsByType('ground');
