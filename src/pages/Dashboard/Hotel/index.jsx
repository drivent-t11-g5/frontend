import axios from "axios";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import useToken from "../../../hooks/useToken";

export default function Hotel() {
  const [hotels, setHotels] = useState();
  const [rooms, setrooms] = useState();
  const [status, setStatus] = useState();
  const [text, setText] = useState();
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
      console.log(response.data);
      setHotels(response.data);
    })
      .catch(err => {
        setStatus(err.response.status);
        setText(err.response.statusText);
        console.log(err.response);
      });

  }, []);

  function selectHotel(id) {
    if (rooms) {
      setrooms('');
    } else {
      const promise = axios.get(url+'/'+id, config);
      promise.then(response => setrooms(response.data.Rooms))
             .catch(err => console.log(err));
    }
  }

  function CapacityRoom({capacity, availableBookings}){
    let users = [];
    for (let i = 1; i<=capacity; i++){
      if (i>availableBookings){
        users.push(<ion-icon name="person"></ion-icon>);
      } else {
        users.push(<ion-icon name="person-outline"></ion-icon>);
      }
    }
    return(
      <span>{users}</span>
    )
  }

  function RoomsContainer() {
    if (rooms){
      return(
        <div className="roomContainer">
          <h2>Ótima pedida! Agora escolha seu quarto:</h2>
          <div>
          {rooms.map(room => {
            return(
              <div>
                {room.name}
                <CapacityRoom capacity={room.capacity} availableBookings={room.availableBookings}/>
              </div>
            )
          })}
          </div>
        </div>
      )
    }
  }

  if (status == 404) {
    return(
      <CointainerGeral>
        <h1>Escolha de hotel e quarto</h1>
      </CointainerGeral>
    )
  }else if (status == 402 && text == 'Payment Required') {
    return(
      <CointainerGeral>
        <h1>Escolha de hotel e quarto</h1>
        <h3>Você precisa ter confirmado pagamento antes de fazer a escolha de hospedagem</h3>
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
              hotels.map(hotel => {
                return(
                  <div onClick={() => selectHotel(hotel.id)}>
                    <img src={hotel.image}/>
                    <h3>{hotel.name}</h3>
                    <div>
                      <p className="title">Tipos de acomodação:</p>
                    </div>
                    <div>
                      <p className="title">Vagas disponíveis:</p>
                    </div>
                  </div>
                )
              })
            }
          </ContainerHotelsInfo>
          <RoomsContainer/>
        </div>
      </CointainerGeral>
    )
  }
}

const CointainerGeral = styled.div`
  h1{
    font-family: "Roboto";
    font-size: 34px;
    font-weight: 400;
    line-height: 40px;
    letter-spacing: 0em;
    margin-bottom: 30px;
  }
  h2{
    color: #8E8E8E;
    font-family: "Roboto";
    font-size: 20px;
    font-weight: 400;
    line-height: 23px;
    letter-spacing: 0em;
    margin-bottom: 15px;

  }
  .roomContainer{
    >div{
      display: flex;
      gap: 10px;
      div{
        width: 190px;
        height: 45px;
        border-radius: 10px;
        border: 1px solid #CECECE;
        display: flex;
        align-items: center;
        justify-content: space-around;

      }
    }
  }
`

const ContainerHotelsInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  .title{
    font-family: "Roboto";
    font-size: 15px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0em;
  }
  >div{
    width: 196px;
    height: 264px;
    background-color: #CCCCCC;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    h3{
    font-family: "Roboto";
    font-size: 20px;
    font-weight: 300;
    line-height: 23px;
    letter-spacing: 0em;
    }
  }
  img {
    width: 170px;
    height: 100px;
    border-radius: 10px;
  }
`