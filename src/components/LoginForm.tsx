"use client";

import { FormHTMLAttributes, Ref } from "react";

export const LoginForm: React.FC<{
  change?: FormHTMLAttributes<HTMLFormElement>["onChange"];
  hidden?: boolean;
  ref?: Ref<HTMLFormElement>;
}> = ({ change, ref, inputName, placeholder, type}) => {
  return (
    <div className="mb-4">
      <form action={change} ref={ref}>
        <div className="grid flex-shrink-0 grid-cols-6 content-stretch items-center justify-stretch justify-items-center bg-background-text rounded-lg">
          <input
            name={inputName}
            placeholder={placeholder}
            className="ml-3 mr-3 mt-2 mb-2 pl-3 pr-2 col-span-6 col-start-1 w-full text-1xl text-secondary placeholder:bg-background-text bg-background-text focus:outline-none font-sans"
            autoComplete="off"
            type={type}
          ></input>
        </div>
      </form>
    </div>
  );
};
