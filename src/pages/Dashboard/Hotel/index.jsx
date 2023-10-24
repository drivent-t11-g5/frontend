import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import { getTicket } from "../../../services/ticketApi";
import useToken from "../../../hooks/useToken";
import axios from "axios";

export default function Hotel() {
  const { userData } = useContext(UserContext);
  const [ticket, setTicket] = useState(undefined);
  const [hotel, setHotel] = useState('');
  const [hotels, setHotels] = useState();
  const [rooms, setRooms] = useState();
  const [state, setState] = useState([]);
  const [roomState, setRoomState] = useState([]);
  const [render, setRender] = useState(0);
  const [booking, setBooking] = useState('')
  const token = useToken();

  const url = `${import.meta.env.VITE_API_URL}/hotels`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

  useEffect(() => {  
    const promise = axios.get(url, config);
    promise.then(response => {
      const newState = [];
      for (let i=0; i<response.data.length; i++){
        newState.push(false)
      }
      setState(newState);
      setHotels(response.data);
    })
      .catch(err => {
        console.log(err.response);
      });
    if (typeof booking != 'number'){
      const promiseBooking = axios.get(`${import.meta.env.VITE_API_URL}/booking`, config)
      promiseBooking.then(response => setBooking(response.data))
                  .catch(error => console.log(error));
    }

    (async () => {

      try {
        const userTicket = await getTicket(userData.token);
        setTicket(userTicket);
      } catch (err) {
        console.log(err);
      }

    })
      ();

  }, [render]);

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
    } else if (state.includes(true)) {
      return(
        <div className="roomContainer">
          <h2 >Ótima pedida! Agora escolha seu quarto:</h2>
          <ContainerTitle><p>Carregando...</p></ContainerTitle>
        </div>
      )
    }
  }

  function bookRoom(roomId) {
    if (typeof booking != 'number'){
      const promise = axios.post(`${import.meta.env.VITE_API_URL}/booking`, {roomId}, config);
      promise.then(response => {
        setRender(response);
        setBooking(response.data);
      })
             .catch(error => console.log(error));
    } else {
      const promise = axios.put(`${import.meta.env.VITE_API_URL}/booking/${booking}`, {roomId}, config);
      promise.then(response => {
        setRender(response);
        setBooking(response.data);
      })
             .catch(error => console.log(error));
    }
  }

  function ReservaContainer() {
    if (roomState.includes(true)){
      const index = roomState.indexOf(true);
      return(
        <button onClick={() => bookRoom(rooms[index].id)}>
          RESERVAR QUARTO
        </button>
      )
    }
  }

  function HotelInformation() {
    if (hotels) {
      return (
        <ContainerHotelsInfo>
            {
              hotels.map((hotel, i) => {
                return(
                  <DivHotel onClick={() => selectHotel(hotel.id, i)} state={state[i]}>
                    <img src={hotel.image}/>
                    <h3>{hotel.name}</h3>
                    <div className="divInfo">
                      <p>Tipos de acomodação:</p>
                      <AcomodationText acomodation={hotel.acomodation}/>
                    </div>
                    <div className="divInfo">
                      <p>Vagas disponíveis:</p>
                      <span>{hotel.availableBookings}</span>
                    </div>
                  </DivHotel>
                )
              })
            }
          </ContainerHotelsInfo>
      )
    } else {
      return (
        <CenteredContainer>
         <ContainerTitle><p>Carregando...</p></ContainerTitle>
     </CenteredContainer>
      )
    }
  }

  function AcomodationText({acomodation}){
    let text = '';
    const order = [];
    if (acomodation.includes('Single')) order.push('Single');
    if (acomodation.includes('Double')) order.push('Double')
    if (acomodation.includes('Triple')) order.push('Triple');
    for (let i=0; i<order.length; i++){
      if (i!=0 && i+1==order.length){
        text += ` e ${order[i]} `
      } else if (i==0){
        text += `${order[i]}`
      } else {
        text += `, ${order[i]} `
      }
    }
    return <span>{text}</span>
  }

  function HotelInformation2({info, hotel, roomId}){
    if (info){
      let text = `${info.name} `;
      if (info.capacity == 1) text += '(Single)';
      if (info.capacity == 2) text += '(Double)';
      if (info.capacity == 3) text += '(Triple)';
      return <span>{text}</span>
    } else if (hotel){
      let quantity = 0;
      hotel.Rooms.forEach(room => {
        if (room.id == roomId){
          quantity = room.capacity - room.availableBookings-1;
        }
      })
      if (quantity==0){
        return <span>Somente você</span>
      } else if (quantity==1) {
        return <span>Você e mais {quantity} pessoa</span>
      }else {
        return <span>Você e mais {quantity} pessoas</span>
      }
    }
  }

  function trocarQuarto() {
    setRooms(null);
    setState([]);
    setRoomState([]);
    setBooking(booking.id);
    setRender(render+1);
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
  } else{
    if (booking && typeof booking != 'number' && booking.Room){
      const promise = axios.get(url+'/'+booking.Room.hotelId, config);
      promise.then(response => setHotel(response.data))
             .catch(error => console.log(error));
      return(
        <CointainerGeral>
          <h1>Escolha de hotel e quarto</h1>
          <div>
            <h2>Você já escolheu seu quarto:</h2>
            <DivHotel state={true}>
              <img src={hotel.image}/>
              <h3>{hotel.name}</h3>
              <div className="divInfo">
                <p>Quarto reservado</p>
                <HotelInformation2 info={booking.Room}/>
              </div>
              <div className="divInfo">
                <p>Pessoas no seu quarto</p>
                <HotelInformation2 hotel={hotel} roomId={booking.Room.id} />
              </div>
            </DivHotel>
          </div>
          <button onClick={() => trocarQuarto()}>TROCAR DE QUARTO</button>
        </CointainerGeral>
      )
    }else{
      return(
        <CointainerGeral>
          <h1>Escolha de hotel e quarto</h1>
          <div>
            <h2>Primeiro, escolha seu hotel</h2>
            <HotelInformation />
            <RoomsContainer/>
          </div>
          <ReservaContainer />
        </CointainerGeral>
      )
    }
   } 
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
  margin-top: 30%;
`;

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
`

const DivHotel = styled.div`
 margin-bottom: 30px;
  img {
    width: 170px;
    height: 100px;
    border-radius: 10px;
  }
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
  .divInfo{
    line-height: 18px;
    letter-spacing: 0em;
    p{
      font-size: 15px;
      font-weight: 500;
    }
    span{
      font-size: 15px;
      font-weight: 300;
    }

  }
`;
