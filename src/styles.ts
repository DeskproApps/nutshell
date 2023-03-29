import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledLink = styled(Link)`
  all: unset;
  color: ${({ theme, to }) =>
    to ? theme.colors.cyan100 : theme.colors.black100};
  text-decoration: none;
  font-weight: 500;
  cursor: ${({ to }) => (to ? "pointer" : "default")};
`;
