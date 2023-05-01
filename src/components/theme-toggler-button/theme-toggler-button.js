import { useContext } from "react";
import { ThemeContext, themes } from "../../contexts/theme-context";
import styled from "styled-components";

export const ThemeTogglerButton = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <Div>
      <Toggle
        type="checkbox"
        id="toggle"
        color={theme.color}
        onClick={() =>
          setTheme(theme === themes.light ? themes.dark : themes.light)
        }
      ></Toggle>
      <Label
        htmlFor="toggle"
        color={theme.color}
        backgroundColor={theme.hover_color}
      ></Label>
    </Div>
  );
};

const Div = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;

  @media (max-width: 767px) {
    width: 100%;
  }
`;

const Toggle = styled.input`
  display: none;
  &:checked ~ label {
    border-color: ${(props) => props.color};
  }
  &:checked ~ label::after {
    transform: translateX(30px);
  }
`;

const Label = styled.label`
  text-align: right;
  background-color: ${(props) => props.backgroundColor};
  border: 2px solid ${(props) => props.color};
  border-radius: 50px;
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: all ease-in-out 0.3s;
  width: 60px;
  height: 30px;
  margin-top: 8px;
  &::after {
    background-color: ${(props) => props.color};
    border-radius: 50%;
    content: " ";
    cursor: pointer;
    display: inline-block;
    position: absolute;
    left: 2px;
    top: 2px;
    transition: all ease-in-out 0.3s;
    width: 22px;
    height: 22px;
  }
`;
