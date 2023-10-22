import styled from "styled-components";

export const PaymentContainer = styled.div`
  font-family: Roboto;
  font-weight: 400;

  h1 {
    font-size: 34px;
  }  

  h2 {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 20px;
    color: #8E8E8E;    
  }
`;

export const Ticket = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 108px;
  width: 290px;
  border-radius: 20px;
  background-color: #FFEED2;

  h3 {
    font-size: 16px;
  }

  p {
    font-size: 14px;
    color: #898989;
  }
`;

export const CreditCardContainer = styled.div`
  width: 700px;
  display: flex;
  width: 700px;

  input {
    outline: none;
    height: 40px;
    padding: 5px;
    border: 1px solid #D4D4D4;
    border-radius: 4px;
    font-size: 16px;
    color: #898989;
    background-color: #FFFFFF;
    text-transform: uppercase;

    &:focus {
      outline: 1px solid #000000;
    }

    &::placeholder {
      text-transform: none;
    }
  }

  button {
    outline: none;
    height: 40px;
    width: 182px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    box-shadow: 0px 2px 10px 0px #00000040;
    margin-top: 40px;
    background-color: #E0E0E0;
    cursor: pointer;

    &:disabled {
      cursor: initial;
    }
  }
`;

export const CreditCard = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
`;

export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 20px;

  p {
    font-size: 16px;
    color: #bfbfbf;
    padding-left: 5px;
  }
`;

export const Number = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const ExpiryAndCvc = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
  justify-content: space-between;
`;

export const Expiry = styled.input`
  width: 75%;
`;

export const Cvc = styled.input`
  width: 20%;
`;

export const ConfirmationContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const Icon = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center; 
  font-size: 50px;
  color: #36B853;
`;

export const Message = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  font-size: 16px;

  h3 {
    font-weight: 700;
  }
`;
