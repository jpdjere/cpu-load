import { Dispatch, FC } from "react";

type CheckboxProps = {
  mockHighLoad: boolean;
  setMockHighLoad: Dispatch<boolean>;
};

export const Checkbox: FC<CheckboxProps> = ({mockHighLoad, setMockHighLoad}) => {
  const handleChange = () => {
    setMockHighLoad(!mockHighLoad);
  };
  return (
    <div className="mr-2 w-100 align-middle select-none flex flex-row">
      Mock High Load:
      <div className="ml-3">
        <input
          type="checkbox"
          name="toggle"
          id="Blue"
          onChange={handleChange}
          className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        />

      </div>
    </div>
  );
};
