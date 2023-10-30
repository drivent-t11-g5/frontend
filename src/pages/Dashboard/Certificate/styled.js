import styled from "styled-components";

export const CertificateContainer = styled.div`
  font-family: Roboto;
  font-weight: 400;
  height: 100%;

  h1 {
    font-size: 34px;
  }  

  p {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 20px;
    color: #8E8E8E;    
  }

  button {
    outline: none;
    height: 40px;
    width: 182px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    box-shadow: 0px 2px 10px 0px #00000040;
    margin-top: 20px;
    background-color: #E0E0E0;
    cursor: pointer;

    &:disabled {
      cursor: initial;
    }
  }
`;

export const UnavailableMessage = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  color: #8E8E8E;   
  padding: 40px; 
  line-height: 24px;
  height: 90%;
`;
