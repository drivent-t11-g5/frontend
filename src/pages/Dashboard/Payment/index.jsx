import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../../../hooks/useToken";
import styled from "styled-components";
import { getTicket } from '../../../services/ticketApi';
import { IoCheckmarkCircle } from "react-icons/io5";
import { createPayment } from '../../../services/paymentApi';
import Cards from 'react-credit-cards-2';
import "react-credit-cards-2/dist/es/styles-compiled.css";
import creditCardType from "credit-card-type";
import {
  ConfirmationContainer,
  CreditCard,
  CreditCardContainer,
  Cvc,
  Expiry,
  ExpiryAndCvc,
  Icon,
  Inputs,
  Message,
  Number,
  PaymentContainer,
  Ticket
} from './styled';

export default function Payment() {
  const [list, setList] = useState([]);
  const [listEnrollments, setListEnrollments] = useState([]);
  const [chooseHotel, SetShowHotel] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedHotelOption, setSelectedHotelOption] = useState(null);
  const [inpersonOnlinePrice, setInpersonOnlinePrice] = useState(0);
  const [priceWithHotelWithoutHotel, setPriceWithHotelWithoutHotel] = useState(0);
  const [difference, setDifference] = useState(0);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [noHotel, setNohotel] = useState(0);
  const navigate = useNavigate();
  const token = useToken();
  const [ticket, setTicket] = useState(null);
  const [form, setForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focus: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  async function retrieveTicket() {
    try {
      const ticket = await getTicket(token);
      setTicket(ticket);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function payTicket(event) {
    event.preventDefault();
    const cardData = {
      number: form.number,
      name: form.name.toUpperCase(),
      expirationDate: form.expiry,
      cvv: form.cvc,
      issuer: creditCardType(form.number)[0]?.niceType,
    };
    const body = {
      ticketId: ticket.id,
      cardData,
    }
    setIsLoading(true);

    try {
      await createPayment(body, token);
      const updatedTicket = { ...ticket, status: 'PAID' };
      setTicket(updatedTicket);
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  }

  function handleForm(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleInputFocus(event) {
    const { name } = event.target;
    setForm({ ...form, focus: name });
  }

  function PaymentPage() {
    const { status } = ticket;
    const { name, price } = ticket.TicketType;
    const currencyConversion = 100; // currency values are saved on database as cents

    function renderCreditCard() {
      return (
        <CreditCardContainer>
          <form onSubmit={payTicket}>
            <CreditCard>
              <Cards
                number={form.number}
                name={form.name}
                expiry={form.expiry}
                cvc={form.cvc}
                focused={form.focus}
                locale={{ valid: 'Valido até' }}
                placeholders={{ name: 'SEU NOME AQUI' }}
              />
              <Inputs>
                <Number>
                  <input
                    name="number"
                    type="text"
                    placeholder="Número do cartão"
                    minLength="14"
                    maxLength="16"
                    title="Informe os dígitos do cartão de crédito"
                    value={form.number}
                    onChange={handleForm}
                    onFocus={handleInputFocus}
                    disabled={isLoading}
                    required
                  />
                  <p>e.g.: 49..., 51..., 36..., 37...</p>
                </Number>
                <input
                  name="name"
                  type="text"
                  placeholder="Nome"
                  minLength="2"
                  maxLength="22"
                  title="Informe o nome do titular do cartão de crédito"
                  value={form.name}
                  onChange={handleForm}
                  onFocus={handleInputFocus}
                  disabled={isLoading}
                  required
                />
                <ExpiryAndCvc>
                  <Expiry
                    name="expiry"
                    type="text"
                    placeholder="Validade"
                    minLength="3"
                    maxLength="7"
                    title="Informe a validade do cartão de crédito"
                    value={form.expiry}
                    onChange={handleForm}
                    onFocus={handleInputFocus}
                    disabled={isLoading}
                    required
                  />
                  <Cvc
                    name="cvc"
                    type="text"
                    placeholder="CVC"
                    minLength="3"
                    maxLength="3"
                    title="Informe o código de segurança do cartão de crédito"
                    value={form.cvc}
                    onChange={handleForm}
                    onFocus={handleInputFocus}
                    disabled={isLoading}
                    required
                  />
                </ExpiryAndCvc>
              </Inputs>
            </CreditCard>
            <button
              type="submit"
              disabled={isLoading}
            >
              FINALIZAR PAGAMENTO
            </button>
          </form>
        </CreditCardContainer>
      );
    }

    function renderConfirmation() {
      return (
        <ConfirmationContainer>
          <Icon>
            <IoCheckmarkCircle />
          </Icon>
          <Message>
            <h3>Pagamento confirmado!</h3>
            <p>Prossiga para escolha de hospedagem e atividades</p>
          </Message>
        </ConfirmationContainer>
      );
    }

    function renderPayment() {
      return (
        <PaymentContainer>
          <h1>Ingresso e pagamento</h1>
          <h2>Ingresso escolhido</h2>
          <Ticket>
            <h3>{name}</h3>
            <p>
              {(price / currencyConversion).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              })}
            </p>
          </Ticket>
          <h2>Pagamento</h2>
          {status === 'RESERVED' ? renderCreditCard() : renderConfirmation()}
        </PaymentContainer>
      );
    }

    return renderPayment();
  }

  useEffect(() => {

    // pegando os tickets
    const url = `${import.meta.env.VITE_API_URL}/tickets/types`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const promise = axios.get(url, config);
    promise.then(response => {
      setList(response.data);

      // fazendo o calculo do valor real do tiket presencial
      // preço do ticket com hotel
      const withHotelPrice = response.data.find(item => !item.isRemote && item.includesHotel)?.price || 0;

      // preço do ticket sem hotel
      const noHotelPrice = response.data.find(item => !item.isRemote && !item.includesHotel)?.price || 0;
      setNohotel(noHotelPrice)
      // diferença entre eles
      const difference = withHotelPrice - noHotelPrice;
      setDifference(difference);
    })
      .catch(err => {
        alert(err.response.data);
      });

    // pegando os tickets
    const urlEnrollments = `${import.meta.env.VITE_API_URL}/enrollments/`;
    const configEnrollments = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const promiseEnrollments = axios.get(urlEnrollments, configEnrollments);
    promiseEnrollments.then(response => {
      setListEnrollments(response.data)
    })
      .catch(err => {
        alert(err.response.data);
      });

    retrieveTicket();
  }, []);

  console.log(list)

  // verificando se a opção de online
  const temIsRemote = list.some(item => item.isRemote);

  // função que é acionada quando se é clicada em uma das opções online ou presencial
  function onlineInPerson(type, value, id) {

    //para mostrar as opções de com hotel sem hotel
    SetShowHotel(true);

    // para mudar a cor do butção selecionado
    setSelectedType(type);

    // para zerar a cor de com ou sem hotel
    setSelectedHotelOption(null)

    // para zerar se o preço so com ou sem hotel
    setPriceWithHotelWithoutHotel(0)

    // guarda o valor da oções escolhida se é online ou presencial
    setInpersonOnlinePrice(value);

    // colocar o ticketId associado à opção selecionada
    const selectedTicketId = findTicketId(type, selectedHotelOption);
    setSelectedTicketId(selectedTicketId);
  };

  // função chamada toda vez que é selecionada um botão de sem ou com hotel
  function withOrWithoutHotel(option, value) {

    // para colocar cor no butão selecionado
    setSelectedHotelOption(option);

    // para guardar o valor da opção escolhida
    setPriceWithHotelWithoutHotel(value);

    // colocar o ticketId quando a opção de hotel é escolhida
    const selectedTicketId = findTicketId(selectedType, option);
    setSelectedTicketId(selectedTicketId);
  };

  // encontrar o ticketId com base nas opções selecionadas
  function findTicketId(type, hotelOption) {
    const selectedTicket = list.find(item => {
      const isMatchingType = (type === 'presencial' && !item.isRemote) || (type === 'online' && item.isRemote);
      const isMatchingHotelOption = hotelOption === null || (hotelOption === 'comHotel' && item.includesHotel) || (hotelOption === 'semHotel' && !item.includesHotel);
      return isMatchingType && isMatchingHotelOption;
    });

    return selectedTicket ? selectedTicket.id : null;
  };

  // essa função serve para quando a pessoa for reservar o ticke
  function ticketChosen() {

    const url = `${import.meta.env.VITE_API_URL}/tickets/`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const data = {
      ticketTypeId: selectedTicketId

    };
    const promise = axios.post(url, data, config);
    promise.then(response => {
      setTicket(response.data);
    })
      .catch(err => {
        alert(err.response.data);

      });
  }

  if (listEnrollments.length === 0) {

    return (
      <>
        <HomeContainerNot>
          <Header>
            <h1>Ingresso e pagamento</h1>
          </Header>
        </HomeContainerNot>
        <HomeContainerText>
          <h1>
            Você precisa completar sua inscrição antes
            de prosseguir pra escolha de ingresso
          </h1>
        </HomeContainerText>
      </>
    )

  } else if (!ticket) {

    return (
      <HomeContainer>
        <Header>
          <h1>Ingresso e pagamento</h1>
        </Header>

        <TransactionsContainer>
          <Ul>
            <Adjust>
              <Statement>
                Primeiro, escolha sua modalidade de ingresso
              </Statement>
              <Choices>
                <ListItemContainer
                  onClick={() => onlineInPerson("presencial", noHotel)}
                  selected={selectedType === "presencial"}
                >
                  <div>Presencial</div>
                  <Prince>R${(noHotel / 100).toFixed(0)}</Prince>
                </ListItemContainer>

                {temIsRemote && (
                  <ListItemContainer
                    onClick={() => onlineInPerson("online", (list.find(item => item.isRemote).price))}
                    selected={selectedType === "online"}
                  >
                    <div>Online</div>
                    <Prince>
                      {list.find(item => item.isRemote)?.price ? (
                        `R$${(list.find(item => item.isRemote).price / 100).toFixed(0)}`
                      ) : (
                        "Preço indisponível"
                      )}
                    </Prince>
                  </ListItemContainer>
                )}
              </Choices>
            </Adjust>

            {selectedType === 'presencial' && (
              <Adjust>
                <Statement>
                  Ótimo! Agora escolha sua modalidade de hospedagem
                </Statement>
                <Choices>
                  <ListItemContainer
                    onClick={() => withOrWithoutHotel("semHotel", 0)}
                    selected={selectedHotelOption === "semHotel"}
                  >
                    <div>Sem Hotel</div>
                    <Prince>R$0.00</Prince>
                  </ListItemContainer>


                  <ListItemContainer
                    onClick={() => withOrWithoutHotel("comHotel", difference)}
                    selected={selectedHotelOption === "comHotel"}
                  >
                    <div>Com hotel</div>
                    <Prince>
                      {list.find(item => !item.isRemote && item.includesHotel)?.price ? (
                        `R$${(difference / 100).toFixed(0)}`
                      ) : (
                        "Preço indisponível"
                      )}
                    </Prince>
                  </ListItemContainer>

                </Choices>
              </Adjust>
            )}

            {(selectedType === 'online' || selectedHotelOption !== null) && (
              <Adjust>
                <Statement>
                  Fechado! O total ficou em R${((inpersonOnlinePrice + priceWithHotelWithoutHotel) / 100).toFixed(0)}. Agora é só confirmar:
                </Statement>
                <Choices>
                  <ListItemContainerPurchase
                    onClick={() => ticketChosen()}
                  >
                    <div>RESERVAR INGRESSO</div>
                  </ListItemContainerPurchase>
                </Choices>
              </Adjust>
            )}
          </Ul>
        </TransactionsContainer>
      </HomeContainer>
    )
  } else {
    return PaymentPage();
  }
};

const Ul = styled.ul`
   overflow: hidden;
`

const HomeContainerText = styled.div`
  height: calc(100vh - 300px);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: Roboto;
  font-size: 20px;
  font-weight: 400;
  line-height: 23px;
  color: rgba(142, 142, 142, 1);
  h1 {
    width: 388px;
    height: 46px;
  };
`;

const HomeContainerNot = styled.div`
display: flex;
flex-direction: column;

h2 {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: blue;
  text-align: center;
  top: 50%;
}
`;

const ListItemContainerPurchase = styled.li`
  width: 162px;
  height: 37px;
  border-radius: 4px;
  margin-top: 20px;
  margin-right: 20px;
  border: 1px solid rgba(206, 206, 206, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: center;
  color: rgba(0, 0, 0, 1);
  cursor: pointer;
  background-color:rgba(224, 224, 224, 1);
  `;

const Prince = styled.div``;

const ListItemContainer = styled.li`
width: 145px;
height: 145px;
border-radius: 20px;
margin-top: 20px;
margin-right: 20px;
border: 1px solid rgba(206, 206, 206, 1);
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
text-align: center;
font-family: Roboto;
font-size: 16px;
font-weight: 400;
line-height: 19px;
color: rgba(69, 69, 69, 1);
cursor: pointer;
background-color: ${({ selected }) => (selected ? "rgba(255, 238, 210, 1)" : "white")};
`;

const Adjust = styled.div``;

const HomeContainer = styled.div`
display: flex;
flex-direction: column;
height: calc(83vh - 51px);
overflow: hidden;
`;

const Header = styled.header`
font-family: 'Roboto';
font-size: 34px;
font-weight: 400;
line-height: 40px;
letter-spacing: 0em;
text-align: left;
`;

const TransactionsContainer = styled.article`
flex-grow: 1;
background-color: #fff;
color: #000;
border-radius: 5px;
display: flex;
flex-direction: column;
justify-content: space - between;
overflow-y: auto;
position: relative;
`;

const Statement = styled.p`
font-family: Roboto;
font-size: 20px;
font-weight: 400;
line-height: 23px;
letter-spacing: 0em;
margin-top: 35px;
color: rgba(142, 142, 142, 1);
`;

const Choices = styled.div`
margin-bottom: 20px;
display: flex;
`;