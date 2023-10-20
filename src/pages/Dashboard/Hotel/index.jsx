import styled from "styled-components";
import RoomCard from "./RoomCard";
import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import { getTicket } from "../../../services/ticketApi";
import Button from "../../../components/Form/Button";
import { getRoomsByHotelId } from "../../../services/hotelApi";
import useToken from "../../../hooks/useToken";
import axios from "axios";

export default function Hotel() {
  const { userData } = useContext(UserContext);
  const [ticket, setTicket] = useState(undefined);
  // const [showContainer, setShowContainer] = useState(false);
  // const [selectedRooms, setSelectedRooms] = useState([]);
  const [hotels, setHotels] = useState();
  const [rooms, setRooms] = useState();
  const [state, setState] = useState([]);
  const [roomState, setRoomState] = useState([]);
  const token = useToken();

  const url = `${import.meta.env.VITE_API_URL}/hotels`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
/*
  if (status == 404) {
    return(
      <CointainerGeral>
        <h1>Escolha de hotel e quarto</h1>
      </CointainerGeral>
    )
  }
  
  */

  useEffect(() => {

    // pegando os tickets
    

    const promise = axios.get(url, config);
    promise.then(response => {
      const newState = [];
      for (let i=0; i<response.data.length; i++){
        newState.push(false)
      }
      setState(newState);
      console.log(response.data);
      setHotels(response.data);
    })
      .catch(err => {
        console.log(err.response);
      });

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

  function selectHotel(id, i) {
    const updateState = [];
    for (let j=0; j<state.length; j++){
      updateState.push(false);
    }
    updateState[i] = true;
    setState(updateState);
    const promise = axios.get(url+'/'+id, config);
    promise.then(response => {
      const newState = [];
      for (let i = 0; i<response.data.Rooms.length; i++){
        newState.push(false);
      }
      setRoomState(newState);
      setRooms(response.data.Rooms)
    })
           .catch(err => console.log(err));
  }

  function CapacityRoom({capacity, availableBookings, roomState}){
    let users = [];
    for (let i = 1; i<=capacity; i++){
      if (i>availableBookings){
        users.push(<ion-icon name="person"></ion-icon>);
      } else {
        if (i+1>availableBookings && roomState){
          users.push(<ion-icon name="person" style={{color: '#dc32b2'}}></ion-icon>);
        } else{
          users.push(<ion-icon name="person-outline" ></ion-icon>);
        }
      }
    }
    return(
      <span>{users}</span>
    )
  }

  function selectRoom(id, i){
    const updateState = [];
    for (let j=0; j<roomState.length; j++){
      updateState.push(false);
    }
    updateState[i] = true;
    setRoomState(updateState);
  }

  function RoomsContainer() {
    if (rooms){
      return(
        <div className="roomContainer">
          <h2 >Ótima pedida! Agora escolha seu quarto:</h2>
          <div>
          {rooms.map((room,i) => {
            if (room.availableBookings==0){
              return(
                <DivRoom available={false}>
                  {room.name}
                  <CapacityRoom capacity={room.capacity} availableBookings={room.availableBookings}/>
                </DivRoom>
              )
            } else {
              return(
                <DivRoom available={true} onClick={() => selectRoom(room.id, i)} roomState={roomState[i]}>
                  {room.name}
                  <CapacityRoom capacity={room.capacity} availableBookings={room.availableBookings} roomState={roomState[i]}/>
                </DivRoom>
              )
            }
          })}
          </div>
        </div>
      )
    }
  }

  function ReservaContainer() {
    if (roomState.includes(true)){
      return(
        <button>
          RESERVAR QUARTO
        </button>
      )
    }
  }

  if (ticket === undefined || ticket.status !== 'PAID') {
    return(
      <CointainerGeral>
        <h1>Escolha de hotel e quarto</h1>
        <CenteredContainer>
        <ContainerTitle><p>Você precisa ter confirmado pagamento antes
          de fazer a escolha de hospedagem</p></ContainerTitle>
      </CenteredContainer>
      </CointainerGeral>
    )
  } else if (!ticket.TicketType.includesHotel) {
    return(
      <CointainerGeral>
        <h1>Escolha de hotel e quarto</h1>
        <CenteredContainer>
        <ContainerTitle><p>Sua modalidade de ingresso não inclui hospedagem
          Prossiga para a escolha de atividades</p></ContainerTitle>
      </CenteredContainer>
      </CointainerGeral>
    )
  } else if (hotels){
    return(
      <CointainerGeral>
        <h1>Escolha de hotel e quarto</h1>
        <div>
          <h2>Primeiro, escolha seu hotel</h2>
          <ContainerHotelsInfo>
            {
              hotels.map((hotel, i) => {
                return(
                  <DivHotel onClick={() => selectHotel(hotel.id, i)} state={state[i]}>
                    <img src={hotel.image}/>
                    <h3>{hotel.name}</h3>
                    <div>
                      <p className="title">Tipos de acomodação:</p>
                    </div>
                    <div>
                      <p className="title">Vagas disponíveis:</p>
                    </div>
                  </DivHotel>
                )
              })
            }
          </ContainerHotelsInfo>
          <RoomsContainer/>
        </div>
        <ReservaContainer />
      </CointainerGeral>
    )
  }

  // verifica se usuário poderia ver o conteúdo da página
  // if (ticket === undefined || ticket.status !== 'PAID') return (
  //   <>
  //     <TitleContainer><p>Escolha de hotel e quarto</p></TitleContainer>
      // <CenteredContainer>
      //   <ContainerTitle><p>Você precisa ter confirmado pagamento antes
      //     de fazer a escolha de hospedagem</p></ContainerTitle>
      // </CenteredContainer>
  //   </>
  // );

  // if (!ticket.TicketType.includesHotel) return (
  //   <>
  //     <TitleContainer><p>Escolha de hotel e quarto</p></TitleContainer>
  //     <CenteredContainer>
        // <ContainerTitle><p>Sua modalidade de ingresso não inclui hospedagem
        //   Prossiga para a escolha de atividades</p></ContainerTitle>
  //     </CenteredContainer>
  //   </>
  // );

  // return (
  //   <>
  //     <TitleContainer><p>Escolha de hotel e quarto</p></TitleContainer>

  //     <Button onClick={() => { findRoomsFromHotel(1) }}>Simulando o clique num hotel</Button>

  //     <RoomsMainContainer showContainer={showContainer}>
  //       <p>Ótima pedida! Agora escolha seu quarto:</p>
  //       <RoomsContainer>
  //         {
  //           rooms && rooms.map((room) => <RoomCard
  //             selectedRooms={selectedRooms}
  //             setSelectedRooms={setSelectedRooms}
  //             availableBookings={room.availableBookings}
  //             name={room.name}
  //             capacity={room.capacity}
  //             id={room.id} />)
  //         }
  //       </RoomsContainer>
  //     </RoomsMainContainer>
  //   </>
  // );
}


const CointainerGeral = styled.div`
  font-family: "Roboto";
  h1{
    font-size: 34px;
    font-weight: 400;
    line-height: 40px;
    margin-bottom: 30px;
  }
  h2{
    color: #8E8E8E;
    font-size: 20px;
    font-weight: 400;
    line-height: 23px;
    margin-bottom: 15px;
  }
  .roomContainer{
    margin-bottom: 30px;
    >div{
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
  button {
    width: 182px;
    height: 37px;
    border: none;
    border-radius: 4px;
    background-color: #E0E0E0;
    font-family: "Roboto";
    box-shadow: 0px 2px 10px 0px #00000040;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: center;
    cursor: pointer;
  }
`
// const RoomsMainContainer = styled.div`
//   margin-left: 16px;
//   width: calc(100% - 16px);
//   display: ${(props) => { return (props.showContainer) ? "flex" : "none" }};
//   flex-direction: column;
//   justify-content: space-between;

//   p {
//     color: #8E8E8E;
//     font-size: 20px;
//     font-family: 'Roboto', sans-serif;
//     line-height: 26px;
//     margin-bottom: 30px;
//   }
// `;

// const RoomsContainer = styled.div`
//   width: 92%;
//   display: grid;
//   grid-template-columns: 190px 190px 190px 190px;
//   gap: 15px;
//   grid-gap: 10px 15px;
// `;

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

// const TitleContainer = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: left;

//   p {
//     color: #000;
//     font-size: 34px;
//     font-family: 'Roboto', sans-serif;
//     margin-bottom: 30px;
//   }
//   h2{
//     color: #8E8E8E;
//     font-size: 20px;
//     font-weight: 400;
//     line-height: 23px;
//     letter-spacing: 0em;
//     margin-bottom: 15px;

//   }
//   .roomContainer{
//     margin-bottom: 30px;
//     >div{
//       display: flex;
//       flex-wrap: wrap;
//       gap: 10px;
//     }
//   }
//   button {
//     width: 182px;
//     height: 37px;
//     border: none;
//     border-radius: 4px;
//     background-color: #E0E0E0;
//     font-family: "Roboto";
//     box-shadow: 0px 2px 10px 0px #00000040;
//     font-size: 14px;
//     line-height: 16px;
//     letter-spacing: 0em;
//     text-align: center;
//     cursor: pointer;
//   }
// `

const DivRoom = styled.div`
  width: 190px;
  height: 45px;
  border-radius: 10px;
  border: 1px solid #CECECE;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${(props) => {
    if (props.available){
      if (props.roomState){
        return 'rgba(255, 238, 210, 1)'
      } else {
        return '';
      }
    } else{
      return '#ddd';
    }
  }};
  color: ${(props) => (props.available ? '' : '#797777')};
  font-weight: 500;
  cursor: ${(props) => (props.available ? 'pointer' : 'not-allowed')};
`

const ContainerHotelsInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  .title{
    font-size: 15px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0em;
  }
  img {
    width: 170px;
    height: 100px;
    border-radius: 10px;
  }
`

const DivHotel = styled.div`
  cursor: pointer;
    width: 196px;
    height: 264px;
    background-color: ${(props) => (props.state ? "rgba(255, 238, 210, 1)" : "#ddd")};
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    h3{
    font-size: 20px;
    font-weight: 300;
    line-height: 23px;
    letter-spacing: 0em;
    }
`;
