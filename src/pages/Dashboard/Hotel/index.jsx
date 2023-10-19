import axios from "axios";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import useToken from "../../../hooks/useToken";

export default function Hotel() {
  const [hotels, setHotels] = useState();
  const [status, setStatus] = useState();
  const token = useToken();

  useEffect(() => {

    // pegando os tickets
    const url = `${import.meta.env.VITE_API_URL}/hotels`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const promise = axios.get(url, config);
    promise.then(response => {
      console.log(response.data);
      setHotels(response.data);
    })
      .catch(err => {
        setStatus(err.response.status);
        console.log(err.response);
        alert(err.response.data);
      });

  }, []);

  if (status == 404) {
    return(
      <CointainerGeral>
        <h1>Escolha de hotel e quarto</h1>
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
  }
`