import styled from "styled-components";
import RoomCard from "./RoomCard";
import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import { getTicket } from "../../../services/ticketApi";
import Button from "../../../components/Form/Button";
import { getRoomsByHotelId } from "../../../services/hotelApi";

export default function Hotel() {
  const { userData } = useContext(UserContext);
  const [ticket, setTicket] = useState(undefined);
  const [showContainer, setShowContainer] = useState(false);
  const [rooms, setRooms] = useState(undefined);
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {

    (async () => {

      try {
        const userTicket = await getTicket(userData.token);
        setTicket(userTicket);
      } catch (err) {
        console.log(err);
      }

    })
      ();

  }, []);

  async function findRoomsFromHotel(id) {
    setShowContainer(true)

    try {
      const hotelsRooms = await getRoomsByHotelId(id, userData.token);
      setRooms(hotelsRooms.Rooms);

      console.log(hotelsRooms);
    } catch (err) {
      console.log(err);
    }

  }

  // verifica se usuário poderia ver o conteúdo da página
  if (ticket === undefined || ticket.status !== 'PAID') return (
    <>
      <TitleContainer><p>Escolha de hotel e quarto</p></TitleContainer>
      <CenteredContainer>
        <ContainerTitle><p>Você precisa ter confirmado pagamento antes
          de fazer a escolha de hospedagem</p></ContainerTitle>
      </CenteredContainer>
    </>
  );

  if (!ticket.TicketType.includesHotel) return (
    <>
      <TitleContainer><p>Escolha de hotel e quarto</p></TitleContainer>
      <CenteredContainer>
        <ContainerTitle><p>Sua modalidade de ingresso não inclui hospedagem
          Prossiga para a escolha de atividades</p></ContainerTitle>
      </CenteredContainer>
    </>
  );

  return (
    <>
      <TitleContainer><p>Escolha de hotel e quarto</p></TitleContainer>

      <Button onClick={() => { findRoomsFromHotel(1) }}>Simulando o clique num hotel</Button>

      <RoomsMainContainer showContainer={showContainer}>
        <p>Ótima pedida! Agora escolha seu quarto:</p>
        <RoomsContainer>
          {
            rooms && rooms.map((room) => <RoomCard
              selectedRooms={selectedRooms}
              setSelectedRooms={setSelectedRooms}
              availableBookings={room.availableBookings}
              name={room.name}
              capacity={room.capacity}
              id={room.id} />)
          }
        </RoomsContainer>
      </RoomsMainContainer>
    </>
  );
}


const RoomsMainContainer = styled.div`
  margin-left: 16px;
  width: calc(100% - 16px);
  display: ${(props) => { return (props.showContainer) ? "flex" : "none" }};
  flex-direction: column;
  justify-content: space-between;

  p {
    color: #8E8E8E;
    font-size: 20px;
    font-family: 'Roboto', sans-serif;
    line-height: 26px;
    margin-bottom: 30px;
  }
`;

const RoomsContainer = styled.div`
  width: 92%;
  display: grid;
  grid-template-columns: 190px 190px 190px 190px;
  gap: 15px;
  grid-gap: 10px 15px;
`;

const ContainerTitle = styled.div`
  width: 411px;
  height: 46px;
  margin-bottom: 35px;

  p {
    color: #8E8E8E;
    font-size: 20px;
    font-family: 'Roboto', sans-serif;
    line-height: 26px;
  }
`;

const CenteredContainer = styled.div`
  height: calc(100% - 34px);
  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: left;

  p {
    color: #000;
    font-size: 34px;
    font-family: 'Roboto', sans-serif;
  }
`;
