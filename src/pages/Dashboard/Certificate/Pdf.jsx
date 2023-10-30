import { useContext, useEffect, useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  PDFViewer,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import formatCpf from '@brazilian-utils/format-cpf';

import UserContext from '../../../contexts/UserContext';
import EventInfoContext from '../../../contexts/EventInfoContext';

import { getTicket } from '../../../services/ticketApi';
import { getPersonalInformations } from '../../../services/enrollmentApi';
import Splash from '../../../components/Splash';

Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
});

export default function Pdf() {
  const [ticket, setTicket] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { userData } = useContext(UserContext);
  const { token } = userData;
  const isRemote = ticket?.TicketType?.isRemote;
  const name = enrollment?.name;
  const cpf = enrollment?.cpf
  const formattedCpf = formatCpf(cpf);

  const { eventInfo } = useContext(EventInfoContext);
  const { title, logoImageUrl, startsAt, endsAt } = eventInfo;
  const formattedStartsAt = dayjs(startsAt).format('DD/MM/YYYY');
  const formattedEndsAt = dayjs(endsAt).format('DD/MM/YYYY');

  async function retrieveInfo(token, setTicket, setEnrollment) {
    try {
      const ticket = await getTicket(token);
      setTicket(ticket);

      const enrollment = await getPersonalInformations(token);
      setEnrollment(enrollment);

      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    retrieveInfo(token, setTicket, setEnrollment);
  }, [])

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Roboto',
      fontWeight: '400',
      gap: '20px',
    },
    h1: {
      fontSize: '84px',
    },
    p1: {
      fontSize: '24px'
    },
    h2: {
      fontSize: '60px',
    },
    p2: {
      marginHorizontal: '50px',
      fontSize: '24px',
    },
    image: {
      width: '100px',
      height: '100px',
      marginTop: '20px',
    },
  });

  function MyDocument() {
    const h1 = 'CERTIFICADO'
    const p1 = 'Certificamos, para todos os devidos fins, de que a(o): ';
    const p2 = (
      `Com documento ${formattedCpf} participou do evento ${title}, ` +
      `de forma ${isRemote ? 'online' : 'presencial'}, ` +
      `entre os dias ${formattedStartsAt} e ${formattedEndsAt}.`
    )

    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.h1}>
            <Text>{h1}</Text>
          </View>
          <View style={styles.p1}>
            <Text>{p1}</Text>
          </View>
          <View style={styles.h2} >
            <Text>{name}</Text>
          </View>
          <View style={styles.p2}>
            <Text>{p2}</Text>
          </View>
          <View style={styles.image}>
            <Image src={logoImageUrl} />
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <>
      {isLoading && <Splash loading />}
      <PDFViewer width={'100%'} height={window.innerHeight} >
        <MyDocument />
      </PDFViewer>
    </>
  );
}