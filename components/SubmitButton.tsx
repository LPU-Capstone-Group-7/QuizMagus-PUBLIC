import React from "react";
import Spinner from "react-bootstrap/Spinner";

interface Props {
    isLoading: boolean;
    name: string;
    handleSubmit: () => void;
}

export default function SubmitButton({ isLoading, name, handleSubmit } : Props) {
    return (
        <button disabled={isLoading} className="btn-primary submitButton" onClick={handleSubmit}>
            {isLoading ? <Spinner animation="border" size="sm" variant="quizard-violet" /> : name }
        </button>
    );
}
