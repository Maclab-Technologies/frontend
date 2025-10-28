const MobileHeader = ({ activeTab, setMobileNavOpen }) => {
  return (
    <div className="mb-4 flex lg:hidden items-center">
      <button
        onClick={() => setMobileNavOpen(true)}
        className="text-gray-300 mr-3 hover:text-white lg:hidden"
      >
        <FaBars size={20} />
      </button>
      <h2 className="text-xl font-bold text-white">{activeTab}</h2>
    </div>
  );
};
export default MobileHeader;
