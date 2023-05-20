import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ThemeContext } from "../../contexts/theme-context";
import { ThemeTogglerButton } from "../theme-toggler-button/theme-toggler-button";
import { ChevronLeftIcon } from "@primer/octicons-react";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function getAbilityDescription(ability) {
  const response = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`);
  const data = await response.json();
  // const abilityDescription = data.flavor_text_entries[0].flavor_text;
  const abilityDescription = data.effect_entries.find(
    (obj) => obj.language.name === "en"
  ).short_effect;
  return abilityDescription;
}

async function getAbilityDescriptionList(abilities) {
  const abilitiesDescription = await abilities.map((ability) =>
    getAbilityDescription(ability)
  );
  const abilitiesDescriptionList = Promise.all(abilitiesDescription);
  return abilitiesDescriptionList;
}

const PokemonInfo = () => {
  const [pokemon, setPokemon] = useState({});
  const [abilities, setAbilities] = useState([]);
  const [abilitiesDescription, setAbilitiesDescription] = useState([]);
  const [error, setError] = useState(false);
  const [state, setState] = useState("");

  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setState("loading");
      try {
        const pokemon = await (
          await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        ).json();
        const abilities = await pokemon.abilities.map(
          (ability) => ability.ability.name
        );
        const abilitiesDescription = await getAbilityDescriptionList(abilities);
        setPokemon(pokemon);
        setAbilities(abilities);
        setAbilitiesDescription(abilitiesDescription);
        setState("success");
      } catch (err) {
        setError(err);
        setState("error");
      }
    };
    fetchData();
  }, [id]);

  if (state === "error") return <h1>{error.toString()}</h1>;

  if (!pokemon) return <h1>Loading...</h1>;

  return (
    <Main
      style={{
        backgroundColor: theme.background,
      }}
    >
      <Header style={{ color: theme.color }}>
        <StyleLink to="/">
          <ChevronLeftIcon
            onClick={() => navigate(-1)}
            size={"large"}
            fill={theme.color}
            aria-label="return"
          />
        </StyleLink>
        <ThemeTogglerButton />
      </Header>
      <Section style={{ color: theme.color }}>
        {pokemon.name ? (
          <Name>{capitalize(`${pokemon.name}`)}</Name>
        ) : (
          <h1>Loading...</h1>
        )}
        {pokemon.sprites ? (
          <Img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            style={{ backgroundColor: theme.hover_color }}
          ></Img>
        ) : (
          <p>Loading...</p>
        )}
        <Info>
          <Div className="type">
            <H2>Type:</H2>
            {pokemon.types ? (
              <ul>
                {pokemon.types.map((type, index) => {
                  return (
                    <Li key={index} backgroundColor={theme.hover_color}>
                      {type.type.name}
                    </Li>
                  );
                })}
              </ul>
            ) : (
              <h2>Loading...</h2>
            )}
          </Div>
          <Div className="abilities">
            <H2>Abilities:</H2>
            {pokemon.abilities ? (
              <ul>
                {pokemon.abilities.map((ability, index) => {
                  return (
                    <Li key={index} backgroundColor={theme.hover_color}>
                      <P className="ability-name">
                        {ability.ability.name.replace(/-/g, " ")}:
                      </P>
                      {abilities ? (
                        <p>
                          {abilitiesDescription[index]
                            .toLowerCase()
                            .slice(0, -1)}
                        </p>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </Li>
                  );
                })}
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </Div>
          <Div className="moves">
            <H2>Moves:</H2>
            {pokemon.moves ? (
              <ul>
                {pokemon.moves.map((move, index) => {
                  return (
                    <Li key={index} backgroundColor={theme.hover_color}>
                      {move.move.name.replace(/-/g, " ")}
                    </Li>
                  );
                })}
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </Div>
        </Info>
      </Section>
    </Main>
  );
};

const Main = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  margin-top: 16px;
  display: flex;
  align-items: center;
  width: 90%;
  max-width: 1024px;
  background-color: ${(props) => props.backgroundColor};

  @media (max-width: 430px) {
    width: 90%;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 1024px;

  @media (max-width: 767px) {
    margin-top: 16px;
    align-items: center;
    gap: 16px;
  }
`;

const StyleLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 24px;
  font-weight: 700;
`;

const Name = styled.h1`
  font-size: 80px;
  text-align: center;

  @media (max-width: 767px) {
    font-size: 56px;
  }
`;

const Img = styled.img`
  width: 40%;
  display: block;
  margin: auto;
  margin-top: 16px;
  margin-bottom: 16px;
  border: solid;
  border-radius: 20px;

  @media (max-width: 767px) {
    width: 90%;
    margin: 0;
  }
`;

const Info = styled.div`
  display: grid;
  grid-template-areas:
    "type abilities"
    "moves moves";
  margin-top: 16px;
  margin-bottom: 48px;
  gap: 16px;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    width: 90%;
  }
`;

const Div = styled.div`
  border: solid;
  border-radius: 10px;
  padding: 16px;
  &.type {
    grid-area: type;
  }
  &.abilities {
    grid-area: abilities;
  }
  &.moves {
    grid-area: moves;
  }
`;

const H2 = styled.h2`
  margin-bottom: 8px;
  font-size: 24px;
  width: 100%;
`;

const Li = styled.li`
  background-color: ${(props) => props.backgroundColor};
  display: inline-block;
  margin-top: 8px;
  margin-right: 8px;
  border-radius: 10px;
  border: no-border;
  padding: 8px;
  font-size: 16px;
`;

const P = styled.p`
  &.ability-name {
    font-weight: 700;
  }
`;

export { PokemonInfo };
