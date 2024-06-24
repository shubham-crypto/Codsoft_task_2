import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <div className="mt-auto bottom-0 w-full h-7 flex items-center justify-center text-white ">
        <p >Copyright ⓒ {year}</p>
      </div>
    </>
  );
}

export default Footer;
