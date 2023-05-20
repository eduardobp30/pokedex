import { useState, useEffect, useContext, useMemo } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../contexts/theme-context";
import { ThemeTogglerButton } from "../theme-toggler-button/theme-toggler-button";

async function getPokemons(page) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=9&offset=${(page - 1) * 9}`
  );
  const data = await response.json();
  const list = data.results;
  const pokemons = list.map((pokemon) => pokemon.name);
  const pokemonsInfo = await pokemons.map((pokemon) =>
    getPokemonsInfo(pokemon)
  );
  const pokemonsList = Promise.all(pokemonsInfo);
  return pokemonsList;
}

async function getPokemonsInfo(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  return await response.json();
}

function capitalize(str) {
  const lower = str.toLowerCase();
  return str.charAt(0).toUpperCase() + lower.slice(1);
}

const PokemonsList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getPokemons(page);
        setPokemons((pokemons) => [...pokemons, ...response]);
        setErrorMsg("");
      } catch (error) {
        setErrorMsg("Error while loading data. Try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const loadMore = () => {
    setPage((page) => page + 1);
  };

  function handleTypeChange(event) {
    setSelectedType(event.target.value);
  }

  function getFilteredList() {
    if (selectedType === "" || selectedType === "all") {
      return pokemons;
    }
    return pokemons.filter((pokemon) =>
      pokemon.types.some(({ type }) => type.name === selectedType)
    );
  }

  var filteredList = useMemo(getFilteredList, [selectedType, pokemons]);

  return (
    <Main
      style={{
        color: theme.color,
        backgroundColor: theme.background,
      }}
    >
      <Div className="container">
        <Header>
          <Logo src="pokemon_logo.png" alt="pokemon logo"></Logo>
          <ThemeTogglerButton />
        </Header>
        <H1>Pokédex</H1>
        <Div className="list">
          <Select
            onChange={handleTypeChange}
            aria-label="Filter Pokémons By Type"
          >
            <option value={""}>Filter by type</option>
            <option value={"all"}>all</option>
            <option value={"bug"}>bug</option>
            <option value={"dark"}>dark</option>
            <option value={"dragon"}>dragon</option>
            <option value={"electric"}>electric</option>
            <option value={"fairy"}>fairy</option>
            <option value={"fighting"}>fighting</option>
            <option value={"fire"}>fire</option>
            <option value={"flying"}>flying</option>
            <option value={"ghost"}>ghost</option>
            <option value={"grass"}>grass</option>
            <option value={"ground"}>ground</option>
            <option value={"ice"}>ice</option>
            <option value={"normal"}>normal</option>
            <option value={"poison"}>poison</option>
            <option value={"psychic"}>psychic</option>
            <option value={"rock"}>rock</option>
            <option value={"steel"}>steel</option>
            <option value={"water"}>water</option>
          </Select>
          <Ul>
            {filteredList.map((pokemon) => {
              return (
                <Li key={pokemon.id} hoverColor={theme.hover_color}>
                  <StyleLink to={`/pokemon/${pokemon.id}`}>
                    <Img
                      src={
                        pokemon.sprites.other["official-artwork"].front_default
                      }
                      alt={pokemon.name}
                    />
                    <P>{capitalize(pokemon.name)}</P>
                  </StyleLink>
                </Li>
              );
            })}
          </Ul>
        </Div>
        {errorMsg && <p>{errorMsg}</p>}
        <Button
          onClick={loadMore}
          style={{
            color: theme.color,
          }}
          backgroundColor={theme.button_color}
          hoverColor={theme.hover_color}
        >
          {isLoading ? "Loading..." : "Load more Pokémons"}
        </Button>
      </Div>
    </Main>
  );
};

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  overflow: hidden;
`;

const Div = styled.div`
  &.container {
    width: 90%;
    max-width: 1024px;
    height: 100%;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    @media (max-width: 1023px) {
      width: 85%;
    }
  }
  &.list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 767px) {
    align-items: center;
  }
`;

const Logo = styled.img`
  width: 25%;
  height: 25%;
`;

const H1 = styled.h1`
  text-align: center;
  font-size: 80px;
  font-weight: 700;

  @media (max-width: 767px) {
    font-size: 72px;

`;

const Select = styled.select`
  align-self: flex-start;

  @media (max-width: 767px) {
    width: 100%;
    align-self: center;
  }
`;

const Ul = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-row-gap: 32px;
  justify-content: space-between;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, auto);
    gap: 48px;
`;

const Li = styled.li`
  width: 250px;
  height: 250px;
  padding: 24px;
  border: solid;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.hoverColor};
  }
  transition: 0.5s ease-in-out;
  ${(props) =>
    props.hidden &&
    css`
      display: none;
    `};

  @media (max-width: 767px) {
    width: 100%;
    height: 100%;
  }
`;

const StyleLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
`;

const Img = styled.img`
  width: 70%;
  display: block;
  margin: auto;
  transition-duration: 1s;
`;

const P = styled.p`
  font-size: 32px;
  font-weight: 400;
  text-align: center;
  margin: auto;
  transition-duration: 1s;
  }
`;

const Button = styled.button`
  font-size: 16px;
  font-weight: 700;
  border: no-border;
  margin-top: 8px;
  margin-bottom: 48px;
  padding: 18px 32px;
  border-radius: 20px;
  cursor: pointer;
  background-color: ${(props) => props.backgroundColor};
  &:hover {
    background-color: ${(props) => props.hoverColor};
  }
  transition: 0.5s ease-in-out;
`;

export { PokemonsList };
