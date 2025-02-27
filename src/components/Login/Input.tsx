"use client";

export default function Input({ inputName, placeholder, type }) {
  return (
    <div className="mb-4">
      <div className="grid flex-shrink-0 grid-cols-6 content-stretch items-center justify-stretch justify-items-center rounded-lg bg-background-text">
        <input
          name={inputName}
          placeholder={placeholder}
          className="text-1xl col-span-6 col-start-1 mb-2 ml-3 mr-3 mt-2 w-full bg-background-text pl-3 pr-2 font-sans text-secondary placeholder:bg-background-text focus:outline-none"
          autoComplete="off"
          type={type}
        ></input>
      </div>
    </div>
  );
}
