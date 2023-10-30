import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import UserContext from '../../../contexts/UserContext';
import EventInfoContext from '../../../contexts/EventInfoContext';

import { getActivities } from '../../../services/activitiesApi';
import { getTicket } from '../../../services/ticketApi';
import { CertificateContainer, UnavailableMessage } from './styled';

export default function Certificate() {
  const [activities, setActivities] = useState(null);
  const [ticket, setTicket] = useState(null);

  const { userData } = useContext(UserContext);
  const { token } = userData;
  const isRemote = ticket?.TicketType?.isRemote;

  const { eventInfo } = useContext(EventInfoContext);
  const { endsAt } = eventInfo;

  async function retrieveInfo(token, setTicket) {
    try {
      const ticket = await getTicket(token);
      setTicket(ticket);

      const activites = await getActivities(token);
      setActivities(activites);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    retrieveInfo(token, setTicket, setActivities);
  }, [])

  function renderAvailableCertificate() {
    return (
      <CertificateContainer>
        <h1>Certificado</h1>
        <p>Clique no botão abaixo para gerar seu certificado de participação.</p>
        <button onClick={() => window.open('/pdf', '_blank')}>GERAR CERTIFICADO</button>
      </CertificateContainer >
    );
  }

  function renderUnavailableCertificate() {
    const message = (
      'O certificado ficará disponível um dia após a realização do evento, ' +
      'para clientes que participaram das atividades de forma online ' +
      'ou de pelo menos cinco atividades de forma presencial.'
    );

    return (
      <CertificateContainer>
        <h1>Certificado</h1>
        <UnavailableMessage>
          {message}
        </UnavailableMessage>
      </CertificateContainer>
    );
  }

  function verifyAvailability() {
    const participatedEvents = activities?.filter((activity) => activity.subscribed === true);

    const now = dayjs();
    const isEventFinished = now.isAfter(dayjs(endsAt), 'day');

    if ((isRemote || (participatedEvents?.length >= 5)) && isEventFinished) {
      return renderAvailableCertificate();
    } else {
      return renderUnavailableCertificate()
    }
  }

  return verifyAvailability();
}
