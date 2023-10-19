
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../../../hooks/useToken";
import styled from "styled-components";


export default function Payment() {
  const [list, setList] = useState([]);
  const [listEnrollments, setListEnrollments] = useState([]);
  const [chooseHotel, SetShowHotel] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedHotelOption, setSelectedHotelOption] = useState(null);
  const [inpersonOnlinePrice, setInpersonOnlinePrice] = useState(0);
  const [priceWithHotelWithoutHotel, setPriceWithHotelWithoutHotel] = useState(0);
  const [difference, setDifference] = useState(0);
  const [noHotel, setNohotel] = useState(0);
  const navigate = useNavigate();
  const token = useToken();


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

  }, []);



  // verificando se a opção de online
  const temIsRemote = list.some(item => item.isRemote);

  // função que é acionada quando se é clicada em uma das opções online ou presencial
  function onlineInPerson(type, value) {

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
  };

  // função chamada toda vez que é selecionada um botão de sem ou com hotel
  function withOrWithoutHotel(option, value) {

    // para colocar cor no butão selecionado
    setSelectedHotelOption(option);

    // para guardar o valor da opção escolhida
    setPriceWithHotelWithoutHotel(value)

  };

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

  } else {

    return (
      <HomeContainer>
        <Header>
          <h1>Ingresso e pagamento</h1>
        </Header>

        <TransactionsContainer>
          <ul>
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
                  <Prince>R${(noHotel / 100).toFixed(2)}</Prince>
                </ListItemContainer>

                {temIsRemote && (
                  <ListItemContainer
                    onClick={() => onlineInPerson("online", (list.find(item => item.isRemote).price))}
                    selected={selectedType === "online"}
                  >
                    <div>Online</div>
                    <Prince>
                      {list.find(item => item.isRemote)?.price ? (
                        `R$${(list.find(item => item.isRemote).price / 100).toFixed(2)}`
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
                        `R$${(difference / 100).toFixed(2)}`
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
                  Fechado! O total ficou em R$ {((inpersonOnlinePrice + priceWithHotelWithoutHotel) / 100).toFixed(2)}. Agora é só confirmar:
                </Statement>
                <Choices>
                  <ListItemContainerPurchase
                    onClick={() => console.log('pagar')}
                  >
                    <div>RESERVAR INGRESSO</div>
                  </ListItemContainerPurchase>
                </Choices>
              </Adjust>
            )}
          </ul>
        </TransactionsContainer>
      </HomeContainer>
    )
  }
}

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
height: calc(100vh - 50px);
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
