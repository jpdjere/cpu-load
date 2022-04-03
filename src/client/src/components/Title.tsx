export const Title = () => {
  return (
    <header className="w-full shadow-lg bg-white items-center h-16 rounded-2xl z-40 pl-6 pr-6 pt-3">
      <ul className="flex justify-between">
        <p className="text-xl text-gray-800 font-semibold font-heading mr-6">
          CPU Load Observability Monitor
        </p>

        <img
          alt="profil"
          src="/datadog.png"
          className="mx-auto object-cover rounded-full h-10 w-10 mr-6 "
        />
      </ul>
    </header>
  );
};
