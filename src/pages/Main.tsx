import React from "react";
import { Link } from "react-router-dom";

export default function Main() {
    return (
        <React.Fragment>
            ㅎㅇ 여긴 마피아저디에요
            <br />
            <Link to="/lobby">로비 가기</Link>
        </React.Fragment>
    );
}
