const BrowserErrorPage = () => {

  const handleReload = () =>{
    window.location.reload();
  }
  return (
    <div className="flex flex-col gap-10 justify-center items-center">
    <div className="text-red-600 flex align-middle items-center justify-center">
      This application is only accessible on Mobile devices portrait mode.
    </div>
    <button className="border bg-gray-400 shadow-orange-400 shadow-xl w-16 hover:bg-slate-300" onClick={handleReload}>Reload</button>
    </div>
  );
};

export default BrowserErrorPage;
