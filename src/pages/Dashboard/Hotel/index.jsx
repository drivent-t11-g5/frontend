import { styled } from "styled-components"

export default function Payment() {

  //Conexão com axios e verificação para mostrar a tela designada
  const includesHotel = false;
  const available = true;
  return (
    <SCContent>
      <SCTitle>Escolha de hotel e quarto</SCTitle>
      <div>
        {!includesHotel && <SCNotAllowed includes={includesHotel}>
          Sua modalidade de ingresso não inclui hospedagem
          Prossiga para a escolha de atividades
        </SCNotAllowed>}
        {(includesHotel && available)  && 
          <SCNotAllowed includes={includesHotel}>
            Você precisa ter confirmado pagamento antes
            de fazer a escolha de hospedagem
          </SCNotAllowed>
        }
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
  height:40px;
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 34px;
  line-height: 40px;
  color: #000000;
`

const SCNotAllowed = styled.p`
  width:${props => !props.includes ? '464px' : '411px' };
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