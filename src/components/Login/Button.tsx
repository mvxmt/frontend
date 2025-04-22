export default function Button({ text }) {
  return (
    <div className="align-center flex">
      <button
        type="submit"
        className="group relative my-4 flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 font-sans text-lg font-medium text-secondary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        {text}
      </button>
    </div>
  );
}
