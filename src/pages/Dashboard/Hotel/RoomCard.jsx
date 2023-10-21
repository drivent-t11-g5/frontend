import styled from "styled-components";
import { IoPersonOutline, IoPerson } from "react-icons/io5";
import React, { useEffect, useState } from "react";

export default function RoomCard(props) {
    const { selectedRooms, setSelectedRooms, availableBookings, name, capacity, id } = props;
    const [roomCardDisabled, setRoomCardDisabled] = useState(false);
    const [peopleList, setPeopleList] = useState([]);

    useEffect(() => {

        if (availableBookings === 0) {

            const peopleListAux = [];
            setRoomCardDisabled(true);

            for (let i = 0; i < capacity; i++) {
                peopleListAux.push({ type: "IoPerson", color: "#8C8C8C" });
            }

            setPeopleList(peopleListAux);

        } else {
            cleanPersonIcons();
        } 

    }, []);

    function selectRoomForReservation(id) {

        const auxPeopleList = [...peopleList];

        if (selectedRooms.length === 0) {

            // encontra o ultimo simbolo de usuário válido e adiciona simbolo rosa
            let i = auxPeopleList.length - 1;
            for (; i >= 0; i--) {
                if (auxPeopleList[i].type === "IoPersonOutline") break;
            }
            auxPeopleList.splice(i, 1, { type: "IoPerson", color: "#FF4791" });
            setSelectedRooms([id]);

            setPeopleList(auxPeopleList);

        } else if (!selectedRooms.includes(id)) {

            // limpar todos os elementos... TODO
        } else {

            setSelectedRooms([]);
            cleanPersonIcons();
        }
    }

    function cleanPersonIcons() {
        const peopleListAux = [];
        for (let i = 0; i < availableBookings; i++) {
            peopleListAux.push({ type: "IoPersonOutline", color: "#000" });
        }

        for (let i = 0; i < capacity - availableBookings; i++) {
            peopleListAux.push({ type: "IoPerson", color: "#000" });
        }

        setPeopleList(peopleListAux);
    }

    return (
        <RoomCardStyled onClick={() => selectRoomForReservation(id)} selected={selectedRooms.includes(id)} disabled={roomCardDisabled}>
            <span>{name}</span>
            <div>
                {
                    peopleList.map(p => {

                        if (p.type === "IoPerson")
                            return <IoPerson size={24} color={p.color} />
                        else
                            return <IoPersonOutline size={24} color={p.color} />
                    })
                }

            </div>
        </RoomCardStyled>
    );
}

const RoomCardStyled = styled.button`
    width: 190px;
    height: 45px;
    border-radius: 10px;
    border: 1px solid #CECECE;
    background-color: ${props => props.selected ? "#FFEED2" : "white"};

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 14px;

    span {
        color: #454545;
        font-size: 20px;
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
    }

    div {
        display: flex;
        justify-content: right;
        min-width: 50%;
    }

    &:disabled {
        background-color: #E9E9E9;

        span {
            color: #9D9D9D;
        }
    }

    &:hover {
        cursor: pointer;
    }
`;