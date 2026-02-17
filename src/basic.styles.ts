import { css } from 'lit';

export default css`
  code {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 0.25em;
    padding: 0.15em 0.3em;
    font-size: 0.9em;
  }

  pre code {
    display: block;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 0.375em;
    padding: 0.75em 1em;
    font-size: 0.9em;
  }

  blockquote {
    border-left: 3px solid rgba(0, 0, 0, 0.2);
    margin-left: 0.5rem;
    padding-left: 0.5rem;
  }
`;
