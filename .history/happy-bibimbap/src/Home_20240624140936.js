import * as React from "react";

function Home() {
  return (
    <>
      <div className="div">
        <img
          loading="lazy"
          srcSet=" https://cdn.builder.io/api/v1/image/assets/TEMP/22b110ba3345c7d66cb396ca13be7b1a488d892e7e4234591525b08219707e80?apiKey=95bdd6893dbc47d0ac51c502bd26afe2&"
          className="img"
        />
      </div>
      <style jsx>{`
        .div {
          background: linear-gradient(
            247deg,
            rgba(246, 115, 115, 0.83) 0%,
            #d74d8b 50.01%,
            #f1823c 100%
          );
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 80px 60px 0;
        }
        @media (max-width: 991px) {
          .div {
            padding-left: 20px;
          }
        }
        .img {
          aspect-ratio: 1.59;
          object-fit: auto;
          object-position: center;
          width: 100%;
          border-radius: 50px;
          border: 1.5px solid rgba(205, 201, 201, 0.2);
          box-shadow: 1px 4px 4px 0px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(25px);
          margin-top: 15px;
          max-width: 1631px;
        }
        @media (max-width: 991px) {
          .img {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}


export default Home;