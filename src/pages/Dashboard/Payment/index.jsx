import { styled } from "styled-components"

export default function Payment() {

  //Conexão com axios e verificação para mostrar a tela designada
  
  return (
    <SCContent>
      <SCTitle>Ingresso e pagamento</SCTitle>
      <div>
        <SCNoEnroll>
          Você precisa completar sua inscrição antes
          de prosseguir pra escolha de ingresso
        </SCNoEnroll>
      </div>
    </SCContent>
  )
}


const SCContent = styled.div`
  display:flex;
  flex-direction:column;
  width:100%;
  height:100%;
  div{
    width:100%;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:center;
  }
`

const SCTitle = styled.p`
  width:338px;
  height:40px;
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 34px;
  line-height: 40px;
  color: #000000;
`

const SCNoEnroll = styled.p`
  width:388px;
  height:46px;
  display: flex;
  justify-content:center;
  align-items:center; 
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  color: #8E8E8E;
`