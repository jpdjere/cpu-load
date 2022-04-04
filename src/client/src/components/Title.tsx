import { Dispatch, FC } from "react";
import { Checkbox } from "./Checkbox";

type TitleProps = {
  mockHighLoad: boolean;
  setMockHighLoad: Dispatch<boolean>;
};
export const Title: FC<TitleProps> = ({mockHighLoad, setMockHighLoad}) => {
  return (
    <header className="w-full shadow-lg bg-white items-center h-16 rounded-2xl z-40 pl-6 pr-6 mt-6">
      <ul className="flex justify-between">
        <div className="flex-1 text-xl text-gray-800 font-semibold mr-6">
          <p className="font-heading">CPU Load Observability Monitor</p>
          <a href="https://github.com/jpdjere" className="hidden md:block">
            <p className="text-s font-normal text-violet-600">By: Juan Pablo Djeredjian</p>
          </a>
        </div>
        <div className="mt-2">
          <Checkbox mockHighLoad={mockHighLoad} setMockHighLoad={setMockHighLoad} />
        </div>

        <img
          alt="profil"
          src="/datadog.png"
          className="object-cover flex-2 rounded-full h-10 w-10 ml-6 mr-6 "
        />
      </ul>
    </header>
  );
};
