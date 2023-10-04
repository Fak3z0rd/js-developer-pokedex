const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokeCard = document.querySelector('[poke-card-container]')
const pokeCardContent = document.getElementsByClassName('poke-card-content')
const pokeCardButtons = document.getElementsByClassName('poke-card-button')
const pokeCardCloseBtn = document.querySelector('[poke-card-close-btn]')

const maxRecords = 151
const limit = 10
let offset = 0

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="getPokemonFullDetails(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function numberPrefix(number) {
    if (number < 10) {
        return '#00' + number
    } else if (number < 100) {
        return '#0' + number
    } else return number
}

function getPokemonFullDetails(e) {
    pokeApi.getPokemonFullDetails(e).then((pokemon) => {
        document.querySelector('[poke-card-header]').className = pokemon.type
        document.querySelector('[pokemon-name]').innerHTML = pokemon.name
        document.querySelector('[pokemon-number]').innerHTML = numberPrefix(pokemon.number)

        document.querySelector('[pokemon-types]').innerHTML = ''
        for (let i = 0; i < pokemon.types.length; i++) {
            const type = document.createElement('li')
            type.classList.add('type')
            type.classList.add(pokemon.types[i])
            type.innerHTML = pokemon.types[i]
            document.querySelector('[pokemon-types]').append(type)
        }

        const photo = document.querySelector('[pokemon-photo]')
        photo.setAttribute('src', pokemon.photo)
        photo.setAttribute('alt', pokemon.name)
        document.querySelector('[pokemon-height]').innerHTML = pokemon.height
        document.querySelector('[pokemon-weight]').innerHTML = pokemon.weight
        const abilities = pokemon.abilities.map((e) => e).join(', ')
        document.querySelector('[pokemon-abilities]').innerHTML = abilities
        document.querySelector('[pokemon-hp]').innerHTML = pokemon.hp
        document.querySelector('[pokemon-atk]').innerHTML = pokemon.atk
        document.querySelector('[pokemon-def]').innerHTML = pokemon.def
        document.querySelector('[pokemon-spatk]').innerHTML = pokemon.spatk
        document.querySelector('[pokemon-spdef]').innerHTML = pokemon.spdef
        document.querySelector('[pokemon-speed]').innerHTML = pokemon.speed
    })

    pokeCard.showModal()
    closeContent()
    document.getElementById('About').style.display = 'block'
    document.getElementsByClassName('poke-card-button')[0].classList.add('active')
}

pokeCardCloseBtn.addEventListener('click', () => pokeCard.close())

for (var i = 0; i < pokeCardButtons.length; i++) {
    pokeCardButtons[i].addEventListener('click', (e) => {
        closeContent()
        clearBtnStyle()
        e.target.classList.add('active')
        document.getElementById(e.target.innerHTML).style.display = 'block'
    })
}

function closeContent() {
    for (var j = 0; j < pokeCardContent.length; j++) {
        pokeCardContent[j].style.display = 'none'
    }
    clearBtnStyle()
}

function clearBtnStyle() {
    for (var i = 0; i < pokeCardButtons.length; i++) {
        pokeCardButtons[i].classList.remove('active')
    }
}
