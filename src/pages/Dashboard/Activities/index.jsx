import axios from "axios";
import { useEffect, useState } from "react";
import useToken from "../../../hooks/useToken";
import styled from "styled-components";
import { parseISO, differenceInHours } from 'date-fns';
import { BiLogIn } from "react-icons/bi";
import { FiXCircle } from "react-icons/fi";

import "react-credit-cards-2/dist/es/styles-compiled.css";


export default function Activities() {

  const [listTickets, setListTickets] = useState([]);
  const [listActivities, setListActivities] = useState([]);
  const [listMain, setListMain] = useState([]);
  const [listSide, setListSide] = useState([]);
  const [listWorkshop, setListWorkshop] = useState([]);
  const [mainActivitiesForSelectedDate, setMainActivitiesForSelectedDate] = useState([]);
  const [sideActivitiesForSelectedDate, setSideActivitiesForSelectedDate] = useState([]);
  const [workshopActivitiesForSelectedDate, setWorkshopActivitiesForSelectedDate] = useState([]);
  const [selected, setSelected] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [listDate, setListDate] = useState([]);
  const token = useToken();
 

  useEffect(() => {

    // pegando o ticket
    const urlTickets = `${import.meta.env.VITE_API_URL}/tickets/`;
    const configTickets = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const promiseTickets = axios.get(urlTickets, configTickets);
    promiseTickets.then(response => {
      setListTickets(response.data);
    })
      .catch(err => {
        alert(err.response.data);
      });

    // pegando as atividades
    const urlActivities = `${import.meta.env.VITE_API_URL}/activities/`;
    const configActivities = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const promiseActivities = axios.get(urlActivities, configActivities);
    promiseActivities.then(response => {
      setListActivities(response.data)

      // separando as atividades por regiao
      const mainActivities = response.data.filter(activity => activity.location === 'main');
      setListMain(mainActivities);
      const sideActivities = response.data.filter(activity => activity.location === 'side');
      setListSide(sideActivities);
      const workshopActivities = response.data.filter(activity => activity.location === 'workshop');
      setListWorkshop(workshopActivities);

      // separando as datas
      const datasUnicas = [...new Set(response.data.map(atividade => new Date(atividade.startTime).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })))];

      var arrayAtualizado = datasUnicas.map(function (dia) {
        return dia.replace('-feira', '');
      });

      function compararDatas(a, b) {
        
        // colocando somente as data e deichando em formato de data
        var dataA = new Date(a.split(', ')[1].split('/').reverse().join('/'));
        var dataB = new Date(b.split(', ')[1].split('/').reverse().join('/'));

        // comparar as datas
        return dataA - dataB;
      }

      arrayAtualizado.sort(compararDatas);

      setListDate(arrayAtualizado);

    })
      .catch(err => {
        alert(err.response.data);
      });

  }, [mainActivitiesForSelectedDate, sideActivitiesForSelectedDate, workshopActivitiesForSelectedDate]);

  // função que é acionada quando se é clicada em qual dia a pessoal deseja
  function Chosenday(days) {

    //para mostrar as opções de de eventoa
    setSelected(true);

    // para mudar a cor do butção selecionado
    setSelectedDay(days);

    // essa função filtra os evendo de acordo com a data
    function filterActivitiesByDate(activitiesList, selectedDate) {
      return activitiesList.filter(activity => {

        // transformando em data
        const activityDate = new Date(activity.startTime).toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit'
        });

        // retirando a palavra feira dos dias da semana
        const formattedActivityDate = activityDate.replace('-feira', '');

        return formattedActivityDate === selectedDate;
      });
    }

    // guardando somente os dias que corresposnde a data selecionada
    const mainActivitiesForSelectedDate = filterActivitiesByDate(listMain, days);
    setMainActivitiesForSelectedDate(mainActivitiesForSelectedDate);
    const sideActivitiesForSelectedDate = filterActivitiesByDate(listSide, days);
    setSideActivitiesForSelectedDate(sideActivitiesForSelectedDate);
    const workshopActivitiesForSelectedDate = filterActivitiesByDate(listWorkshop, days);
    setWorkshopActivitiesForSelectedDate(workshopActivitiesForSelectedDate);
  };

// função que calcula a quantidadde de horas para poder colocar a altura
  function calculateEventHeight(startTime, endTime) {

    try {

      // trandormando as datas enviada en data mesmo
      const startDateTimeUTC = parseISO(startTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date());
      const endDateTimeUTC = parseISO(endTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date());

      // calcula a diferença de horas 
      const hoursDifference = differenceInHours(endDateTimeUTC, startDateTimeUTC);

      // calculo da altura minima de 80px e adicionar 8px pra cada hora adicional
      const calculatedHeight = Math.max(80, 80 + (hoursDifference - 1) * 80);


      return calculatedHeight;
    } catch (error) {

      return 80;
    }
  }
  
// se não tiver pago
  if (listTickets.status !== "PAID") {

    return (
      <>
        <HomeContainerNot>
          <Header>
            <h1>Escolha de atividades</h1>
          </Header>
        </HomeContainerNot>
        <HomeContainerText>
          <h1>
            Você precisa ter confirmado pagamento antes
            de fazer a escolha de atividades
          </h1>
        </HomeContainerText>
      </>
    )

  } else {

    return (
      <HomeContainer>
        <Header>
          <h1>Escolha de atividades</h1>
        </Header>
        <TransactionsContainer>
          <Ul>
            <Adjust>
              <Statement>
                Primeiro, filtre pelo dia do evento:
              </Statement>
              <Choices>
                {listDate.map(data => (
                  <ListItemContainer
                    key={data}
                    onClick={() => Chosenday(data)}
                    selected={selectedDay === data}
                  >
                    <div>{data}</div>
                  </ListItemContainer>
                ))}
              </Choices>
            </Adjust>

            {selected === true && (
              <>
                < Titles>
                  <Place>Auditório Principal</Place>
                  <Place>Auditório Lateral</Place>
                  <Place>Sala de Workshop</Place>
                </Titles>
                <Statement1></Statement1>
                <Box>
                  <Statement2>
                    {mainActivitiesForSelectedDate.map((main, index) => (
                      <Event key={index} style={{ height: `${calculateEventHeight(main.startTime, main.endTime)}px` }}>
                        <TitleTime>
                          <Title>{main.title}</Title>
                          <Time>
                            {`${new Date(main.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} - ${new Date(main.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}`}
                          </Time>
                        </TitleTime>
                        <Statement7> </Statement7>
                        {main.availableSeats < 1 && (
                          <Vacancies style={{ color: 'red' }}>
                            <FiXCircle style={{ fontSize: '24px', color: 'red', marginBottom: '5px' }} />
                            <p>esgotado</p>
                          </Vacancies>
                        )}
                        {main.availableSeats >= 1 && (
                          <Vacancies style={{ color: ' rgba(7, 134, 50, 1)' }}>
                            <BiLogIn style={{ fontSize: '24px', color: 'rgba(7, 134, 50, 1)' }} />
                            {main.availableSeats} vagas
                          </Vacancies>
                        )}
                      </Event>
                    ))}
                  </Statement2>
                  <Statement3>
                    {sideActivitiesForSelectedDate.map((side, index) => (
                      <Event key={index} style={{ height: `${calculateEventHeight(side.startTime, side.endTime)}px` }}>
                        <TitleTime>
                          <Title>{side.title}</Title>
                          <Time>
                            {`${new Date(side.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} - ${new Date(side.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}`}
                          </Time>
                        </TitleTime>
                        <Statement7> </Statement7>
                        {side.availableSeats < 1 && (
                          <Vacancies style={{ color: 'red' }}>
                            <FiXCircle style={{ fontSize: '24px', color: 'red', marginBottom: '5px' }} />
                            <p>esgotado</p>
                          </Vacancies>
                        )}
                        {side.availableSeats >= 1 && (
                          <Vacancies style={{ color: ' rgba(7, 134, 50, 1)' }}>
                            <BiLogIn style={{ fontSize: '24px', color: 'rgba(7, 134, 50, 1)' }} />
                            {side.availableSeats} vagas
                          </Vacancies>)}
                      </Event>
                    ))}
                  </Statement3>
                  <Statement4>
                    {workshopActivitiesForSelectedDate.map((workshop, index) => (
                      <Event key={index} style={{ height: `${calculateEventHeight(workshop.startTime, workshop.endTime)}px` }} >
                        <TitleTime>
                          <Title>{workshop.title}</Title>
                          <Time>
                            {`${new Date(workshop.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} - ${new Date(workshop.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}`}
                          </Time>
                        </TitleTime>
                        <Statement7> </Statement7>
                        {workshop.availableSeats < 1 && (
                          <Vacancies style={{ color: 'red' }}>
                            <FiXCircle style={{ fontSize: '24px', color: 'red', marginBottom: '5px' }} />
                            <p>esgotado</p>
                          </Vacancies>
                        )}
                        {workshop.availableSeats >= 1 && (
                          <Vacancies style={{ color: ' rgba(7, 134, 50, 1)' }}>
                            <BiLogIn style={{ fontSize: '24px', color: 'rgba(7, 134, 50, 1)' }} />
                            {workshop.availableSeats} vagas
                          </Vacancies>)}
                      </Event>
                    ))}
                  </Statement4>
                  <Statement5>   </Statement5>
                </Box>
                <Statement6></Statement6>
              </>
            )}
          </Ul>
        </TransactionsContainer>
      </HomeContainer>
    )
  };
}

const Vacancies = styled.div`
font-family: 'Roboto';
font-size: 9px;
font-weight: 400;
line-height: 11px;
letter-spacing: 0em;
text-align: left;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
margin-left: 18px;

`
const Titles = styled.div`
  display: flex;
  width: 864px;
  justify-content: space-around;
`

const Place = styled.div`
font-family: 'Roboto';
font-size: 17px;
font-weight: 400;
color: rgba(123, 123, 123, 1);
`

const TitleTime = styled.div`
  display: flex;
  flex-direction: column;
`

const Time = styled.div`
width: auto;
height: 14px;
font-family: 'Roboto';
font-size: 12px;
font-weight: 400;
color: rgba(52, 52, 52, 1);
margin-left: 20px;
margin-top: -15px;
`

const Title = styled.div`
width: auto;
height: 14px;
font-family: 'Roboto';
font-size: 12px;
font-weight: 700;
color: rgba(52, 52, 52, 1);
margin: 20px;
`

const Event = styled.div`
  width: 265px;
  border-radius: 5px;
  margin-top: 15px;
  margin-left: 10px;
  background: rgba(241, 241, 241, 1);
  display: flex;
`

const Box = styled.div`
  display: flex;
  flex-direction: row; 
`

const Statement7 = styled.div`
  width: 1px;
  height: 80%; 
  border: 1px solid rgba(215, 215, 215, 1);
  background: rgba(215, 215, 215, 1);
  color: rgba(142, 142, 142, 1);
  margin-top: 10px;
  margin-left: 90px;
  flex: 0;
`

const Statement6 = styled.div`
width: 864px;
height: 1px;
border: 1px solid rgba(215, 215, 215, 1);
background: rgba(215, 215, 215, 1);
color: rgba(142, 142, 142, 1);
`

const Statement1 = styled.div`
width: 864px;
height: 1px;
border: 1px solid rgba(215, 215, 215, 1);
background: rgba(215, 215, 215, 1);
margin-top: 15px;
color: rgba(142, 142, 142, 1);
`

const Statement2 = styled.div`
width: 1px;
height: 392px;
border: 1px solid rgba(215, 215, 215, 1);
background: rgba(215, 215, 215, 1);
color: rgba(142, 142, 142, 1);
margin-right: 288px;
`

const Statement3 = styled.div`
width: 1px;
height: 392px;
border: 1px solid rgba(215, 215, 215, 1);
background: rgba(215, 215, 215, 1);
color: rgba(142, 142, 142, 1);
margin-right: 288px;
`

const Statement4 = styled.div`
width: 1px;
height: 392px;
border: 1px solid rgba(215, 215, 215, 1);
background: rgba(215, 215, 215, 1);
color: rgba(142, 142, 142, 1);
margin-right: 280px;
`

const Statement5 = styled.div`
width: 1px;
height: 392px;
border: 1px solid rgba(215, 215, 215, 1);
background: rgba(215, 215, 215, 1);
color: rgba(142, 142, 142, 1);

`

const Ul = styled.ul`
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
`

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
`

const ListItemContainer = styled.li`
width: 131px;
height: 37px;
border-radius: 4px;
box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25);
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
background-color: ${({ selected }) => (selected ? "rgba(255, 211, 125, 1)" : "rgba(224, 224, 224, 1)")};
`

const Adjust = styled.div`
margin-bottom: 60px;
`

const HomeContainer = styled.div`
display: flex;
flex-direction: column;
height: calc(83vh - 51px);
`

const Header = styled.header`
font-family: 'Roboto';
font-size: 34px;
font-weight: 400;
line-height: 40px;
letter-spacing: 0em;
text-align: left;
`

const TransactionsContainer = styled.article`
flex-grow: 1;
background-color: #fff;
color: #000;
border-radius: 5px;
display: flex;
flex-direction: column;
justify-content: space-between;
position: relative;
`

const Statement = styled.p`
font-family: 'Roboto';
font-size: 20px;
font-weight: 400;
line-height: 23px;
letter-spacing: 0em;
margin-top: 35px;
color: rgba(142, 142, 142, 1);
`

const Choices = styled.div`
margin-bottom: 20px;
display: flex;
`