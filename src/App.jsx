import { useState } from 'react'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [banList, setBanList] = useState([])
  const [history, setHistory] = useState([])

  const fetchPokemon = async () => {
    try {
      let validPokemon = false
      let attempts = 0

      while (!validPokemon && attempts < 20) {
        const randomId = Math.floor(Math.random() * 1025) + 1

        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${randomId}`
        )

        if (!response.ok) {
          attempts++
          continue
        }

        const data = await response.json()

        const pokemonTypes = data.types.map(
          (typeInfo) => typeInfo.type.name
        )

        const pokemonAbilities = data.abilities.map(
          (abilityInfo) => abilityInfo.ability.name
        )

        const hasBannedType = pokemonTypes.some((type) =>
          banList.includes(`type:${type}`)
        )

        const hasBannedAbility = pokemonAbilities.some((ability) =>
          banList.includes(`ability:${ability}`)
        )

        const isBanned = hasBannedType || hasBannedAbility

        if (!isBanned) {
          setPokemon(data)

          setHistory((previousHistory) => [
            ...previousHistory,
            data,
          ])

          validPokemon = true
        }

        attempts++
      }
    } catch (error) {
      console.error('Error fetching Pokemon:', error)
    }
  }

  const addToBanList = (category, value) => {
    const newItem = `${category}:${value}`

    if (!banList.includes(newItem)) {
      setBanList([...banList, newItem])
    }
  }

  const removeFromBanList = (itemToRemove) => {
    setBanList(
      banList.filter((item) => item !== itemToRemove)
    )
  }

  return (
    <div className="app">

      {/* History */}
      <div className="history">
        <h2>🕒 Previously Seen</h2>

        {history.length === 0 ? (
          <p>No Pokémon discovered yet.</p>
        ) : (
          history.map((item, index) => (
            <div
              className="history-item"
              key={`${item.id}-${index}`}
            >
              <img
                src={item.sprites.front_default}
                alt={item.name}
              />

              <span>
                {item.name.charAt(0).toUpperCase() +
                  item.name.slice(1)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>⚡ Veni Vici!</h1>

        <h2>Discover Pokémon</h2>

        <p>
          Click the button to discover a random Pokémon!
        </p>

        <button onClick={fetchPokemon}>
          Discover! 🔀
        </button>

        {pokemon && (
          <div className="pokemon-card">

            <h2>
              {pokemon.name.charAt(0).toUpperCase() +
                pokemon.name.slice(1)}
            </h2>

            {/* Types */}
            <p>
              <strong>Type:</strong>{' '}

              {pokemon.types.map((typeInfo) => (
                <button
                  className="attribute-button"
                  key={typeInfo.type.name}
                  onClick={() =>
                    addToBanList(
                      'type',
                      typeInfo.type.name
                    )
                  }
                >
                  {typeInfo.type.name}
                </button>
              ))}
            </p>

            {/* Ability */}
            <p>
              <strong>Ability:</strong>{' '}

              <button
                className="attribute-button"
                onClick={() =>
                  addToBanList(
                    'ability',
                    pokemon.abilities[0].ability.name
                  )
                }
              >
                {pokemon.abilities[0].ability.name}
              </button>
            </p>

            {/* Weight */}
            <p>
              <strong>Weight:</strong>{' '}
              {pokemon.weight}
            </p>

            {/* Pokemon Image */}
            <img
              src={
                pokemon.sprites.other[
                  'official-artwork'
                ].front_default
              }
              alt={pokemon.name}
              width="350"
            />
          </div>
        )}
      </div>

      {/* Ban List */}
      <div className="ban-list">
        <h2>🚫 Ban List</h2>

        <p>
          Select a type or ability to ban it from future results.
        </p>

        {banList.length === 0 ? (
          <p>No banned attributes yet.</p>
        ) : (
          banList.map((item) => {
            const [category, value] = item.split(':')

            return (
              <button
                key={item}
                className="ban-button"
                onClick={() => removeFromBanList(item)}
              >
                {category}: {value} ✕
              </button>
            )
          })
        )}
      </div>

    </div>
  )
}

export default App