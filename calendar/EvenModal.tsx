type Modal = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: Modal) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-opacity-50 flex items-center justify-center"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        className="bg-white m-auto rounded-lg p-4"
        style={{
          border: '1px solid #000',
          borderRadius: '10px',
          boxShadow: '2px solid black',
        }}
      >
        <div className="flex items-start justify-between p-5 border-b border-gray-200 rounded-t">
          <button
            className="ml-auto bg-transparent border-0 text-gray-800 opacity-75 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
            onClick={onClose}
          >
            <span className="bg-transparent text-red-700 h-6 w-6 text-2xl block outline-none focus:outline-none">
              ×
            </span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
