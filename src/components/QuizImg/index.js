import styled from "styled-components";


// Alterar - é uma imagem 
const QuizImg = styled.div`
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${({ backgroundImage }) => backgroundImage});
    width: 100%;
    height: 180px;
    
`


export default QuizImg;